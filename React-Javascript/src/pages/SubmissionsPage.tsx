import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Download,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  AlertTriangle,
  CheckCircle,
  Mail,
  SortAsc,
  SortDesc,
  Edit2,
  Save,
  X,
  Filter,
  ChevronDown,
  FileSpreadsheet,
  Clock,
  Calendar
} from 'lucide-react';
import { useFormStore } from '../store/formStore';
import { SpamDetector, SpamAnalysis } from '../utils/spamDetector';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FormSubmission } from '../store/types/form';

export const SubmissionsPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { forms, submissions, subscribeToFormSubmissions, deleteSubmission, updateSubmission } = useFormStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [spamFilter, setSpamFilter] = useState<'all' | 'spam' | 'valid'>('all');
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [dateFilter, setDateFilter] = useState<string>('');
  const [spamAnalyses, setSpamAnalyses] = useState<Record<string, SpamAnalysis>>({});
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<FormSubmission | null>(null);
  const [editedResponses, setEditedResponses] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  
  const form = forms.find(f => f.id === formId);
  
  useEffect(() => {
    if (formId) {
      const unsubscribe = subscribeToFormSubmissions(formId);
      return () => unsubscribe();
    }
  }, [formId, subscribeToFormSubmissions]);

  useEffect(() => {
    const analyzeSubmissions = async () => {
      const spamDetector = SpamDetector.getInstance();
      const analyses: Record<string, SpamAnalysis> = {};
      
      for (const submission of submissions) {
        analyses[submission.id] = await spamDetector.analyzeSubmission(submission.responses);
      }
      
      setSpamAnalyses(analyses);
    };

    if (submissions.length > 0) {
      analyzeSubmissions();
    }
  }, [submissions]);

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Form not found</p>
      </div>
    );
  }

  const filteredSubmissions = submissions
    .filter(submission => {
      const searchMatch = Object.values(submission.responses).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const spamMatch = spamFilter === 'all' 
        ? true 
        : spamFilter === 'spam' 
          ? spamAnalyses[submission.id]?.isSpam 
          : !spamAnalyses[submission.id]?.isSpam;
      
      const dateMatch = dateFilter
        ? format(new Date(submission.submittedAt), 'yyyy-MM-dd') === dateFilter
        : true;
      
      return searchMatch && spamMatch && dateMatch;
    })
    .sort((a, b) => {
      let aValue = sortField === 'submittedAt' ? a.submittedAt : a.responses[sortField];
      let bValue = sortField === 'submittedAt' ? b.submittedAt : b.responses[sortField];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const handleSelectAll = () => {
    if (selectedSubmissions.size === filteredSubmissions.length) {
      setSelectedSubmissions(new Set());
    } else {
      setSelectedSubmissions(new Set(filteredSubmissions.map(s => s.id)));
    }
  };

  const handleSelectSubmission = (id: string) => {
    const newSelected = new Set(selectedSubmissions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSubmissions(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedSubmissions.size === 0) return;
    
    if (confirm(`Delete ${selectedSubmissions.size} submissions?`)) {
      try {
        for (const id of selectedSubmissions) {
          await deleteSubmission(formId!, id);
        }
        setSelectedSubmissions(new Set());
        toast.success(`${selectedSubmissions.size} submissions deleted`);
      } catch (error) {
        toast.error('Failed to delete submissions');
      }
    }
  };

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      toast.error('No submissions to export');
      return;
    }

    try {
      const headers = ['Submission ID', 'Submitted At', 'Status', ...form.elements.map(el => el.label)];
      const csvContent = [
        headers.join(','),
        ...filteredSubmissions.map(sub => [
          sub.id,
          format(new Date(sub.submittedAt), 'yyyy-MM-dd HH:mm:ss'),
          spamAnalyses[sub.id]?.isSpam ? 'Spam' : 'Valid',
          ...form.elements.map(el => `"${String(sub.responses[el.id] || '').replace(/"/g, '""')}"`)
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions-${formId}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Submissions exported successfully');
    } catch (error) {
      toast.error('Failed to export submissions');
    }
  };

  const handleBulkEmail = () => {
    const emailSubmissions = Array.from(selectedSubmissions)
      .map(id => submissions.find(s => s.id === id))
      .filter(s => s !== undefined);
    
    const emails = emailSubmissions
      .flatMap(sub => Object.entries(sub!.responses)
        .filter(([key]) => key.toLowerCase().includes('email'))
        .map(([, value]) => value)
      )
      .filter(email => typeof email === 'string' && email.includes('@'));
    
    if (emails.length > 0) {
      window.location.href = `mailto:${emails.join(',')}`;
    } else {
      toast.error('No email addresses found in selected submissions');
    }
  };

  const handleEditSubmission = (submission: FormSubmission) => {
    setEditingSubmission(submission);
    setEditedResponses(submission.responses);
  };

  const handleSaveEdit = async () => {
    if (!editingSubmission) return;

    try {
      await updateSubmission(formId!, editingSubmission.id, editedResponses);
      toast.success('Submission updated successfully');
      setEditingSubmission(null);
      setEditedResponses({});
    } catch (error) {
      toast.error('Failed to update submission');
    }
  };

  const handleCancelEdit = () => {
    setEditingSubmission(null);
    setEditedResponses({});
  };

  const validSubmissions = filteredSubmissions.filter(s => !spamAnalyses[s.id]?.isSpam).length;
  const spamSubmissions = filteredSubmissions.filter(s => spamAnalyses[s.id]?.isSpam).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header - Google Forms Style */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-purple-600" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {form.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {submissions.length} {submissions.length === 1 ? 'response' : 'responses'}
                    </p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full font-medium">
                        ✓ {validSubmissions} valid
                      </span>
                      {spamSubmissions > 0 && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs rounded-full font-medium">
                          ⚠ {spamSubmissions} spam
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'cards'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'table'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Table
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar - Google Forms Style */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search responses..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  showFilters
                    ? 'border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  disabled={filteredSubmissions.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
                
                {selectedSubmissions.size > 0 && (
                  <>
                    <button
                      onClick={handleBulkEmail}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Mail className="h-4 w-4" />
                      Email ({selectedSubmissions.size})
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete ({selectedSubmissions.size})
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status Filter
                      </label>
                      <select
                        value={spamFilter}
                        onChange={(e) => setSpamFilter(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="all">All Submissions</option>
                        <option value="valid">Valid Only</option>
                        <option value="spam">Spam Only</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date Filter
                      </label>
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sort By
                      </label>
                      <select
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="submittedAt">Date Submitted</option>
                        {form.elements.map(el => (
                          <option key={el.id} value={el.id}>{el.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Order
                      </label>
                      <button
                        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors inline-flex items-center gap-2"
                      >
                        {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                        {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content - Cards or Table View */}
          {viewMode === 'cards' ? (
            <div className="space-y-4">
              {filteredSubmissions.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No submissions found</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Responses will appear here once users submit the form</p>
                </div>
              ) : (
                filteredSubmissions.map((submission) => {
                  const isSpam = spamAnalyses[submission.id]?.isSpam;
                  const isEditing = editingSubmission?.id === submission.id;
                  
                  return (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border hover:shadow-md transition-all ${
                        isSpam 
                          ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="p-6">
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <button 
                              onClick={() => handleSelectSubmission(submission.id)}
                              className="mt-1"
                            >
                              {selectedSubmissions.has(submission.id) ? (
                                <CheckSquare className="h-5 w-5 text-purple-600" />
                              ) : (
                                <Square className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {format(new Date(submission.submittedAt), 'h:mm a')}
                                </span>
                              </div>
                              <div className="mt-1">
                                {isSpam ? (
                                  <div className="flex items-center gap-2 group relative">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    <span className="text-sm text-red-600 dark:text-red-400 font-medium">Spam Detected</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Valid Response</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!isEditing && (
                              <>
                                <button
                                  onClick={() => handleEditSubmission(submission)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setSelectedSubmission(submission)}
                                  className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Delete this submission?')) {
                                      deleteSubmission(formId!, submission.id);
                                      toast.success('Submission deleted');
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            {isEditing && (
                              <>
                                <button
                                  onClick={handleSaveEdit}
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-1 text-sm font-medium"
                                >
                                  <Save className="h-4 w-4" />
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center gap-1 text-sm font-medium"
                                >
                                  <X className="h-4 w-4" />
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="space-y-4 pl-8">
                          {form.elements.map((element) => (
                            <div key={element.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {element.label}
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editedResponses[element.id] || ''}
                                  onChange={(e) => setEditedResponses({
                                    ...editedResponses,
                                    [element.id]: e.target.value
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                              ) : (
                                <p className="text-gray-900 dark:text-gray-100">
                                  {submission.responses[element.id] || <span className="text-gray-400">No response</span>}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Spam Analysis */}
                        {isSpam && spamAnalyses[submission.id] && (
                          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="font-medium text-red-800 dark:text-red-400 text-sm mb-1">Spam Indicators:</p>
                            <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
                              {spamAnalyses[submission.id].reasons.map((reason, i) => (
                                <li key={i}>• {reason}</li>
                              ))}
                            </ul>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-2">
                              Confidence: {(spamAnalyses[submission.id].confidence * 100).toFixed(0)}%
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <button onClick={handleSelectAll}>
                          {selectedSubmissions.size === filteredSubmissions.length && filteredSubmissions.length > 0 ? (
                            <CheckSquare className="h-5 w-5 text-purple-600" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </th>
                      {form.elements.slice(0, 3).map((element) => (
                        <th
                          key={element.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => {
                            if (sortField === element.id) {
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortField(element.id);
                              setSortDirection('asc');
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {element.label}
                            {sortField === element.id && (
                              sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => {
                            if (sortField === 'submittedAt') {
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortField('submittedAt');
                              setSortDirection('desc');
                            }
                          }}
                      >
                        <div className="flex items-center gap-2">
                          Submitted
                          {sortField === 'submittedAt' && (
                            sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6 + form.elements.length} className="px-6 py-12 text-center text-gray-500">
                          No submissions found
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((submission) => {
                        const isSpam = spamAnalyses[submission.id]?.isSpam;
                        
                        return (
                          <motion.tr
                            key={submission.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${isSpam ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
                          >
                            <td className="px-6 py-4">
                              <button onClick={() => handleSelectSubmission(submission.id)}>
                                {selectedSubmissions.has(submission.id) ? (
                                  <CheckSquare className="h-5 w-5 text-purple-600" />
                                ) : (
                                  <Square className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </td>
                            {form.elements.slice(0, 3).map((element) => (
                              <td key={element.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {submission.responses[element.id] || '-'}
                              </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {isSpam ? (
                                <div className="flex items-center gap-2 group relative">
                                  <AlertTriangle className="h-5 w-5 text-red-500" />
                                  <span className="text-sm text-red-600 dark:text-red-400">Spam</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                  <span className="text-sm text-green-600 dark:text-green-400">Valid</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {format(new Date(submission.submittedAt), 'MMM d, yyyy HH:mm')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEditSubmission(submission)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                                  title="Edit"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setSelectedSubmission(submission)}
                                  className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Delete this submission?')) {
                                      deleteSubmission(formId!, submission.id);
                                      toast.success('Submission deleted');
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* View/Edit Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Submission Details
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(selectedSubmission.submittedAt), 'MMMM d, yyyy \'at\' h:mm a')}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {form.elements.map((element) => (
                  <div key={element.id} className="border-l-4 border-purple-500 pl-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {element.label}
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-900 dark:text-gray-100">
                        {selectedSubmission.responses[element.id] || <span className="text-gray-400 italic">No response</span>}
                      </p>
                    </div>
                  </div>
                ))}
                
                {spamAnalyses[selectedSubmission.id]?.isSpam && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold text-red-800 dark:text-red-400">Spam Analysis</h3>
                    </div>
                    <ul className="text-sm text-red-700 dark:text-red-400 space-y-1 mb-3">
                      {spamAnalyses[selectedSubmission.id].reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-500">
                      <span className="font-semibold">Confidence Score:</span>
                      <div className="flex-1 bg-red-200 dark:bg-red-900/40 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${spamAnalyses[selectedSubmission.id].confidence * 100}%` }}
                        />
                      </div>
                      <span>{(spamAnalyses[selectedSubmission.id].confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
