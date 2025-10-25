import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useFormStore } from '../store/formStore';
import { useAuthStore } from '../store/authStore';
import { LivePreviewEditor } from './builder/LivePreviewEditor';
import { ModernToolbox } from './builder/ModernToolbox';
import { FigmaLayersPanel } from './builder/FigmaLayersPanel';
import { EnhancedPropertiesPanel } from './builder/EnhancedPropertiesPanel';
import { LayersPanel } from './builder/LayersPanel';
import { CommandPalette } from './builder/CommandPalette';
import { AIAssistant } from './builder/AIAssistant';
import { StyleEditor } from './StyleEditor';
import { SubmissionsView } from './SubmissionsView';
import { FormPreview } from './FormPreview';
import { 
  LayoutDashboard, 
  Loader2,
  Undo2,
  Redo2,
  BarChart2,
  Layers,
  Sparkles,
  Home,
  Upload,
  Plus,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  Palette,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  FileStack,
  ThumbsUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import useUndo from 'use-undo';
import { motion, AnimatePresence } from 'framer-motion';

export const ModernFormBuilder = () => {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchForm, saveForm, updateForm, publishForm } = useFormStore();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tab = searchParams.get('tab');
    return tab === 'submissions' ? 'submissions' : 'live';
  });
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [showProperties, setShowProperties] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  const [showToolbox, setShowToolbox] = useState(true);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  const [formLink, setFormLink] = useState('');
  const [publishMode, setPublishMode] = useState<'publish' | 'update'>('publish');
  const [showFormDetailsModal, setShowFormDetailsModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop');
  const [currentBuilderPage, setCurrentBuilderPage] = useState(0);

  const getPageStructure = () => {
    const pages: { type: 'page' | 'thankyou', elements: any[], label: string }[] = [];
    let currentPageElements: any[] = [];
    let pageNumber = 1;
    
    elements.forEach((element) => {
      if (element.type === 'pagebreak') {
        if (currentPageElements.length > 0) {
          pages.push({ type: 'page', elements: currentPageElements, label: `Page ${pageNumber}` });
          pageNumber++;
          currentPageElements = [];
        }
      } else if (element.type === 'thankyou') {
        if (currentPageElements.length > 0) {
          pages.push({ type: 'page', elements: currentPageElements, label: `Page ${pageNumber}` });
          currentPageElements = [];
        }
        pages.push({ type: 'thankyou', elements: [element], label: 'Thank You' });
      } else {
        currentPageElements.push(element);
      }
    });
    
    if (currentPageElements.length > 0) {
      pages.push({ type: 'page', elements: currentPageElements, label: pageNumber === 1 ? 'Page 1' : `Page ${pageNumber}` });
    }
    
    return pages.length > 0 ? pages : [{ type: 'page' as const, elements: elements, label: 'Page 1' }];
  };

  const addNewPage = () => {
    const newPageBreak = {
      type: 'pagebreak',
      label: 'Page Break',
      id: `pagebreak-${Date.now()}`
    };
    addElement(newPageBreak);
    toast.success('New page added!');
  };

  const [
    elementsState,
    { 
      set: setElements,
      undo: undoElements,
      redo: redoElements,
      canUndo,
      canRedo,
    },
  ] = useUndo<any[]>([]);

  const elements = elementsState.present;

  const [style, setStyle] = useState({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#3b82f6',
    borderRadius: '0.5rem',
    borderWidth: '1px',
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    fontFamily: 'Inter, system-ui, sans-serif',
  });

  useEffect(() => {
    const loadForm = async () => {
      if (formId) {
        const form = await fetchForm(formId);
        if (form) {
          setFormTitle(form.title);
          setFormDescription(form.description || '');
          setElements(form.elements);
          setIsPublished(form.published || false);
          if (form.style) {
            setStyle({
              ...style,
              ...form.style
            });
          }
        }
      }
      setLoading(false);
    };
    loadForm();
  }, [formId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redoElements();
        } else {
          undoElements();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSave = async () => {
    if (!formTitle.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to save forms');
      return;
    }

    try {
      setSaving(true);
      const formData = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        elements,
        style,
        userId: user.uid,
      };

      let currentFormId = formId;

      if (formId) {
        await updateForm(formId, formData);
      } else {
        const newFormId = await saveForm(formData);
        currentFormId = newFormId;
        navigate(`/builder/${newFormId}`, { replace: true });
      }

      // Generate form link
      if (currentFormId) {
        const link = `${window.location.origin}/form/${currentFormId}`;
        setFormLink(link);
        
        // If not published yet, publish it
        if (!isPublished) {
          await publishForm(currentFormId);
          setPublishMode('publish');
          setShowPublishSuccess(true);
          setIsPublished(true);
        } else {
          // Already published, just show the link
          setPublishMode('update');
          setShowPublishSuccess(true);
        }
      }
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  const addElement = (element: any) => {
    const newElement = { ...element, id: crypto.randomUUID() };
    setElements([...elements, newElement]);
    setSelectedElement(newElement);
    toast.success(`Added ${element.type} element`);
  };

  const addElementAtIndex = (element: any, index: number) => {
    const newElement = { ...element, id: crypto.randomUUID() };
    const newElements = [...elements];
    newElements.splice(index, 0, newElement);
    setElements(newElements);
    setSelectedElement(newElement);
    toast.success(`Inserted ${element.type} element`);
  };

  const duplicateElement = (element: any) => {
    const newElement = { ...element, id: crypto.randomUUID() };
    const index = elements.findIndex(e => e.id === element.id);
    const newElements = [...elements];
    newElements.splice(index + 1, 0, newElement);
    setElements(newElements);
    toast.success('Element duplicated');
  };

  const removeElement = (id: string) => {
    setElements(elements.filter((element) => element.id !== id));
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
    toast.success('Element removed');
  };

  const updateElement = (id: string, updates: Partial<any>) => {
    setElements(elements.map((element) => 
      element.id === id ? { ...element, ...updates } : element
    ));
    if (selectedElement?.id === id) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
  };

  const handleElementClick = (element: any) => {
    if (!element) {
      // Deselect - keep properties panel open
      setSelectedElement(null);
      return;
    }
    setSelectedElement(element);
    setShowProperties(true);
    setShowStyleEditor(false);
    setShowLayers(false);
    toast.success(`Selected: ${element.label}`, { duration: 1500 });
  };

  const handleCanvasClick = () => {
    // Deselect when clicking on canvas background
    setSelectedElement(null);
  };

  const handleCommand = (command: string) => {
    switch (command) {
      case 'save':
        handleSave();
        break;
      case 'undo':
        undoElements();
        break;
      case 'redo':
        redoElements();
        break;
      default:
        toast.success(`Command: ${command}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navbar - Figma Style */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center h-16">
            {/* Left Side - Home Button & Form Info */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                title="Go to Dashboard"
                data-testid="button-home"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </button>
              
              <div className="w-px h-8 bg-gray-200"></div>
              
              {/* Form Title & Description */}
              <button
                onClick={() => setShowFormDetailsModal(true)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all"
                data-testid="button-form-details"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <LayoutDashboard className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-900">
                    {formTitle || 'Untitled Form'}
                  </span>
                  {formDescription && (
                    <span className="text-xs text-gray-500 max-w-xs truncate">
                      {formDescription}
                    </span>
                  )}
                </div>
              </button>
            </div>
            
            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
              {/* Add Elements Toggle */}
              {activeTab !== 'submissions' && (
                <>
                  <button
                    onClick={() => setShowToolbox(!showToolbox)}
                    className={`p-2 rounded-lg transition-all ${
                      showToolbox ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Add Elements"
                    data-testid="button-add-elements"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                  
                  {/* Layers Toggle */}
                  <button
                    onClick={() => setShowLayers(!showLayers)}
                    className={`p-2 rounded-lg transition-all ${
                      showLayers ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Layers"
                    data-testid="button-layers"
                  >
                    <Layers className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="w-px h-8 bg-gray-200"></div>

              {/* Undo/Redo */}
              <button
                onClick={undoElements}
                disabled={!canUndo}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Undo (⌘Z)"
                data-testid="button-undo"
              >
                <Undo2 className="h-5 w-5" />
              </button>
              <button
                onClick={redoElements}
                disabled={!canRedo}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Redo (⌘⇧Z)"
                data-testid="button-redo"
              >
                <Redo2 className="h-5 w-5" />
              </button>

              <div className="w-px h-8 bg-gray-200"></div>

              {/* View Submissions */}
              {formId && (
                <button
                  onClick={() => setActiveTab(activeTab === 'submissions' ? 'live' : 'submissions')}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'submissions' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="View Submissions"
                  data-testid="button-submissions"
                >
                  <BarChart2 className="h-5 w-5" />
                </button>
              )}

              {/* Style Settings */}
              <button
                onClick={() => {
                  setShowStyleEditor(!showStyleEditor);
                  if (!showStyleEditor) {
                    setShowProperties(false);
                  }
                }}
                className={`p-2 rounded-lg transition-all ${
                  showStyleEditor ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Style Settings"
                data-testid="button-style"
              >
                <Palette className="h-5 w-5" />
              </button>

              <div className="w-px h-8 bg-gray-200"></div>

              {/* Preview Button */}
              <button
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                data-testid="button-preview"
              >
                <Eye className="h-5 w-5" />
                Preview
              </button>

              {/* Publish/Update Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all font-medium shadow-sm"
                data-testid="button-publish"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
                {saving ? 'Publishing...' : (isPublished ? 'Update' : 'Publish')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)] relative">
        {/* Toolbox */}
        <AnimatePresence>
          {activeTab !== 'submissions' && showToolbox && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              className="w-64 shadow-xl overflow-hidden"
            >
              <ModernToolbox onAddElement={addElement} isDarkMode={isDarkMode} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas Area */}
        <div 
          className={`flex-1 overflow-y-auto overflow-x-hidden relative transition-all ${isDraggingOver ? 'bg-blue-50/30' : ''}`}
          style={{ paddingBottom: getPageStructure().length > 1 ? '80px' : '0' }}
          onClick={handleCanvasClick}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (e.currentTarget === e.target) {
              setIsDraggingOver(false);
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingOver(false);
            try {
              const data = e.dataTransfer.getData('application/json');
              if (data) {
                const element = JSON.parse(data);
                const newElement: any = {
                  type: element.type,
                  label: element.type === 'heading' ? element.content : element.label,
                  required: false,
                };
                if (element.placeholder) newElement.placeholder = element.placeholder;
                if (element.options) newElement.options = element.options;
                if (element.content && element.type !== 'heading') newElement.content = element.content;
                addElement(newElement);
                toast.success('Element added!');
              }
            } catch (error) {
              console.error('Drop error:', error);
            }
          }}
        >
          <div 
            className="min-h-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {activeTab === 'submissions' ? (
              <SubmissionsView formId={formId!} elements={elements} />
            ) : (
              <>
                {/* Form Header */}
                {(formTitle || formDescription) && (
                  <div className="max-w-4xl mx-auto mb-8 text-center">
                    {formTitle && (
                      <h1 className="text-4xl font-bold mb-3" style={{ color: style.textColor, fontFamily: style.fontFamily }}>
                        {formTitle}
                      </h1>
                    )}
                    {formDescription && (
                      <p className="text-lg text-gray-600" style={{ fontFamily: style.fontFamily }}>{formDescription}</p>
                    )}
                  </div>
                )}

                {/* Live Preview Editor */}
                {elements.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-4xl mx-auto text-center py-24 border-2 border-dashed rounded-2xl transition-all ${
                      isDraggingOver 
                        ? 'border-blue-500 bg-blue-50 scale-105' 
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-gray-900 text-xl font-bold mb-2">
                      {isDraggingOver ? 'Drop Element Here!' : 'Start Building Your Form'}
                    </p>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                      {isDraggingOver 
                        ? 'Release to add the element to your form' 
                        : 'Drag elements from the toolbox or click to add them. Edit directly in the preview!'
                      }
                    </p>
                  </motion.div>
                ) : (
                  <LivePreviewEditor
                    elements={getPageStructure().length > 1 ? getPageStructure()[currentBuilderPage]?.elements || elements : elements}
                    style={style}
                    onUpdateElement={updateElement}
                    onRemoveElement={removeElement}
                    onDuplicateElement={duplicateElement}
                    onReorderElements={setElements}
                    onSelectElement={handleElementClick}
                    selectedElement={selectedElement}
                    onAddElementAtIndex={addElementAtIndex}
                  />
                )}
              </>
            )}
          </div>

          {/* Page Navigation - Fixed Bottom */}
          {activeTab !== 'submissions' && getPageStructure().length > 1 && (
            <div className="fixed bottom-0 left-64 right-0 bg-white border-t shadow-lg z-30">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-2 py-3 px-6 overflow-x-auto">
                  {/* Page Tabs */}
                  {getPageStructure().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentBuilderPage(index);
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                        currentBuilderPage === index 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {page.type === 'thankyou' ? (
                        <ThumbsUp className="h-4 w-4" />
                      ) : (
                        <FileStack className="h-4 w-4" />
                      )}
                      {page.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panels */}
        <AnimatePresence>
          {activeTab !== 'submissions' && (showStyleEditor || showProperties || showLayers) && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              className="w-80 bg-white border-l shadow-xl flex flex-col overflow-hidden"
            >
              {showStyleEditor ? (
                <StyleEditor style={style} onChange={setStyle} />
              ) : showLayers ? (
                <FigmaLayersPanel
                  elements={elements}
                  selectedElement={selectedElement}
                  onSelectElement={handleElementClick}
                  onReorderElements={setElements}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <EnhancedPropertiesPanel
                  selectedElement={selectedElement}
                  onUpdate={updateElement}
                  onClose={() => {
                    setSelectedElement(null);
                    setShowProperties(false);
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Assistant */}
      {activeTab === 'live' && (
        <AIAssistant
          currentElements={elements}
          formTitle={formTitle}
          formDescription={formDescription}
          onAddElement={addElement}
          currentStyle={style}
          onStyleChange={setStyle}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onCommand={handleCommand}
      />

      {/* Form Details Modal */}
      <AnimatePresence>
        {showFormDetailsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFormDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Form Details</h2>
                <button
                  onClick={() => setShowFormDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  data-testid="button-close-modal"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Form Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Name
                  </label>
                  <input
                    type="text"
                    placeholder="Untitled Form"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                    data-testid="input-modal-form-title"
                  />
                </div>

                {/* Form Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Add a description to help people understand your form..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 resize-none"
                    data-testid="input-modal-form-description"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setShowFormDetailsModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                  data-testid="button-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowFormDetailsModal(false);
                    toast.success('Form details updated');
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                  data-testid="button-save-details"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish Success Popup - Wix Style Bottom Right */}
      <AnimatePresence>
        {showPublishSuccess && (
          <motion.div
            initial={{ opacity: 0, x: 400, y: 100 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50 w-[420px]"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Blue Top Bar */}
              <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              
              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={() => setShowPublishSuccess(false)}
                  className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Header with Icon */}
                <div className="flex items-start gap-4 mb-5">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-200"
                  >
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </motion.div>
                  
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {publishMode === 'publish' ? 'Congratulations!' : 'Form Updated'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {publishMode === 'publish' 
                        ? 'Your form is published and live online' 
                        : 'Your changes are now live'}
                    </p>
                  </div>
                </div>

                {/* Form Link Section */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 mb-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-white rounded-lg px-3 py-2.5 border border-gray-200 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={formLink}
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none truncate"
                      />
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(formLink);
                        toast.success('Link copied!', { duration: 2000 });
                      }}
                      className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                      title="Copy Link"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <a
                    href={formLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm shadow-md hover:shadow-lg"
                  >
                    <span>View Site</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* What's Next Section */}
                {publishMode === 'publish' && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What's Next</p>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BarChart2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">Track your responses</p>
                        <p className="text-xs text-gray-600">View submissions and analytics in your dashboard</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Done Button */}
                <button
                  onClick={() => setShowPublishSuccess(false)}
                  className="mt-4 w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal - Full Screen Responsive */}
      <AnimatePresence>
        {showPreviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setShowPreviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full h-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-shrink-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Form Preview</h3>
                  <p className="text-sm text-gray-500">This is how your form will look to users</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Publish/Update Button */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all font-medium shadow-sm"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {saving ? 'Publishing...' : (isPublished ? 'Update' : 'Publish')}
                  </button>

                  {/* View Published Form Button */}
                  {isPublished && formLink && (
                    <a
                      href={formLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Live Form
                    </a>
                  )}

                  <div className="w-px h-8 bg-gray-200"></div>

                  {/* Device Switcher */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setPreviewDevice('phone')}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                            previewDevice === 'phone' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title="Phone View"
                        >
                          <Smartphone className="h-4 w-4" />
                          <span className="text-sm font-medium">Phone</span>
                        </button>
                        <button
                          onClick={() => setPreviewDevice('tablet')}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                            previewDevice === 'tablet' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title="Tablet View"
                        >
                          <Tablet className="h-4 w-4" />
                          <span className="text-sm font-medium">Tablet</span>
                        </button>
                        <button
                          onClick={() => setPreviewDevice('desktop')}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                            previewDevice === 'desktop' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title="Desktop View"
                        >
                          <Monitor className="h-4 w-4" />
                          <span className="text-sm font-medium">Desktop</span>
                        </button>
                      </div>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-8">
                    {/* Phone Device Frame */}
                    {previewDevice === 'phone' && (
                      <div className="relative">
                        {/* Phone Frame */}
                        <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl" style={{ width: '380px', height: '780px' }}>
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-gray-900 rounded-b-3xl z-10"></div>
                          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-auto">
                            <div className="text-sm [&_h1]:!text-xl [&_h2]:!text-lg [&_p]:!text-sm [&_label]:!text-xs [&_input]:!text-sm [&_button]:!text-sm [&_select]:!text-sm [&_textarea]:!text-sm">
                              <FormPreview 
                                title={formTitle}
                                description={formDescription}
                                elements={elements}
                                style={style}
                                onSubmit={() => {}}
                                isPreview={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Tablet Device Frame */}
                    {previewDevice === 'tablet' && (
                      <div className="relative">
                        <div className="relative bg-gray-900 rounded-3xl p-4 shadow-2xl" style={{ width: '820px', height: '680px' }}>
                          <div className="w-full h-full bg-white rounded-2xl overflow-auto">
                            <div className="[&_h1]:!text-2xl [&_h2]:!text-xl">
                              <FormPreview 
                                title={formTitle}
                                description={formDescription}
                                elements={elements}
                                style={style}
                                onSubmit={() => {}}
                                isPreview={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Desktop View */}
                    {previewDevice === 'desktop' && (
                      <div className="w-full h-full max-w-7xl">
                        <div className="bg-white rounded-xl shadow-2xl overflow-auto h-full">
                          <FormPreview 
                            title={formTitle}
                            description={formDescription}
                            elements={elements}
                            style={style}
                            onSubmit={() => {}}
                            isPreview={true}
                          />
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
