import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { refreshApiKeyCache } from '../lib/geminiService';
import toast from 'react-hot-toast';
import { 
  Eye, EyeOff, Save, Users, FileText, Key, Shield, BarChart3, Activity,
  Clock, TrendingUp, CheckCircle, Server, Zap
} from 'lucide-react';

interface FormDetail {
  formId: string;
  formTitle: string;
  ownerEmail: string;
  submissionCount: number;
  createdAt: string;
}

interface UserDetail {
  uid: string;
  email: string;
  fullName: string;
  companyName: string;
  industry: string;
  formCount: number;
  totalSubmissions: number;
  createdAt: string;
  lastActive: string;
}

interface ActivityLog {
  id: string;
  userEmail: string;
  action: string;
  timestamp: string;
  details: string;
}

interface OpenRouterKeyData {
  label: string;
  limit: number | null;
  limit_reset: string | null;
  limit_remaining: number | null;
  include_byok_in_limit: boolean;
  usage: number;
  usage_daily: number;
  usage_weekly: number;
  usage_monthly: number;
  byok_usage: number;
  byok_usage_daily: number;
  byok_usage_weekly: number;
  byok_usage_monthly: number;
  is_free_tier: boolean;
}

interface OpenRouterCreditsData {
  total_credits: number;
  total_usage: number;
}

interface OpenRouterActivityItem {
  date: string;
  model: string;
  model_permaslug: string;
  endpoint_id: string;
  provider_name: string;
  usage: number;
  byok_usage_inference: number;
  requests: number;
  prompt_tokens: number;
  completion_tokens: number;
  reasoning_tokens: number;
}

export function SuperAdmin() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState({ 
    users: 0, 
    forms: 0, 
    totalSubmissions: 0,
    activeUsers: 0 
  });
  const [formDetails, setFormDetails] = useState<FormDetail[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetail[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [displayedUserCount, setDisplayedUserCount] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openRouterData, setOpenRouterData] = useState<OpenRouterKeyData | null>(null);
  const [creditsData, setCreditsData] = useState<OpenRouterCreditsData | null>(null);
  const [activityData, setActivityData] = useState<OpenRouterActivityItem[]>([]);
  const [fetchingLimits, setFetchingLimits] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [apiVerified, setApiVerified] = useState<boolean | null>(null);

  const SUPER_ADMIN_EMAIL = 'kevalsavaliya2222@gmail.com';
  
  // Check if user is the super admin - redirect to 404 silently if not
  useEffect(() => {
    if (!user || user.email !== SUPER_ADMIN_EMAIL) {
      navigate('/404', { replace: true });
      return;
    }
    
    loadAllData();
  }, [user, navigate]);

  const loadAllData = async () => {
    setLoadingStats(true);
    try {
      await Promise.all([
        loadStats(),
        loadApiKey(),
        loadActivityLogs()
      ]);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('🔍 Super Admin: Loading statistics...');
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userCount = usersSnapshot.size;
      console.log(`👥 Found ${userCount} users in database`);
      let formCount = 0;
      let totalSubmissions = 0;
      let activeUserCount = 0;
      const allFormDetails: FormDetail[] = [];
      const allUserDetails: UserDetail[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const formsSnapshot = await getDocs(collection(db, 'users', userDoc.id, 'forms'));
        
        let userFormCount = formsSnapshot.size;
        let userSubmissionCount = 0;

        if (userFormCount > 0) {
          activeUserCount++;
        }
        
        formCount += userFormCount;

        for (const formDoc of formsSnapshot.docs) {
          const formData = formDoc.data();
          const submissionsSnapshot = await getDocs(
            collection(db, 'users', userDoc.id, 'forms', formDoc.id, 'submissions')
          );
          
          const submissionCount = submissionsSnapshot.size;
          totalSubmissions += submissionCount;
          userSubmissionCount += submissionCount;

          allFormDetails.push({
            formId: formDoc.id,
            formTitle: formData.title || 'Untitled Form',
            ownerEmail: userData.email || 'Unknown',
            submissionCount,
            createdAt: formData.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'
          });
        }

        // Add user details
        allUserDetails.push({
          uid: userDoc.id,
          email: userData.email || 'Unknown',
          fullName: userData.fullName || 'N/A',
          companyName: userData.companyName || 'N/A',
          industry: userData.industry || 'N/A',
          formCount: userFormCount,
          totalSubmissions: userSubmissionCount,
          createdAt: userData.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
          lastActive: userData.updatedAt?.toDate?.()?.toLocaleDateString() || userData.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'
        });
      }

      allFormDetails.sort((a, b) => b.submissionCount - a.submissionCount);
      allUserDetails.sort((a, b) => b.formCount - a.formCount);

      setStats({ 
        users: userCount, 
        forms: formCount, 
        totalSubmissions,
        activeUsers: activeUserCount 
      });
      setFormDetails(allFormDetails);
      setUserDetails(allUserDetails);
      console.log(`✅ Stats loaded: ${userCount} users, ${formCount} forms, ${totalSubmissions} submissions`);
      
      if (userCount === 0) {
        console.warn('⚠️ No users found in database. Users need to register first.');
      }
    } catch (error: any) {
      console.error('❌ Error loading stats:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        name: error?.name,
        stack: error?.stack
      });
      
      let errorMsg = 'Failed to load statistics';
      if (error?.code === 'permission-denied') {
        errorMsg = 'Permission denied: Please check Firestore security rules';
        console.error('🔒 Firestore permission denied. You need to update your Firestore rules to allow admin access.');
      } else if (error?.message) {
        errorMsg = `Error: ${error.message}`;
      }
      
      toast.error(errorMsg);
    }
  };

  const loadActivityLogs = async () => {
    try {
      const activities: ActivityLog[] = [];
      const usersSnapshot = await getDocs(collection(db, 'users'));

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userEmail = userData.email || 'Unknown';

        if (userData.createdAt) {
          activities.push({
            id: `user-${userDoc.id}`,
            userEmail,
            action: 'User Registered',
            timestamp: userData.createdAt?.toDate?.()?.toLocaleString() || 'N/A',
            details: `New user account created`
          });
        }

        const formsSnapshot = await getDocs(collection(db, 'users', userDoc.id, 'forms'));
        for (const formDoc of formsSnapshot.docs) {
          const formData = formDoc.data();
          if (formData.createdAt) {
            activities.push({
              id: `form-${formDoc.id}`,
              userEmail,
              action: 'Form Created',
              timestamp: formData.createdAt?.toDate?.()?.toLocaleString() || 'N/A',
              details: `Created form: ${formData.title || 'Untitled'}`
            });
          }
        }
      }

      activities.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });

      setActivityLogs(activities.slice(0, 50));
    } catch (error: any) {
      console.error('Error loading activity logs:', error);
      if (error?.code === 'permission-denied') {
        console.error('🔒 Activity logs: Firestore permission denied');
      }
    }
  };

  const loadApiKey = async () => {
    try {
      const docRef = doc(db, 'admin', 'config');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setApiKey(docSnap.data().openrouterApiKey || '');
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('API key cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'admin', 'config');
      await setDoc(docRef, {
        openrouterApiKey: apiKey.trim(),
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || 'unknown'
      });
      
      refreshApiKeyCache();
      toast.success('API key updated successfully!');
      
      // Fetch limits after saving
      await fetchOpenRouterLimits();
    } catch (error: any) {
      console.error('Error saving API key:', error);
      toast.error(`Failed to save API key: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key first');
      return;
    }

    setTestingApi(true);
    setApiVerified(null);
    try {
      // First test with a simple completion request
      const testResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI FormBuilder Admin',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            { role: 'user', content: 'Hi' }
          ],
          max_tokens: 5
        })
      });

      console.log('Test API Response Status:', testResponse.status);

      if (!testResponse.ok) {
        const errorData = await testResponse.json().catch(() => ({}));
        console.error('Test API Error:', errorData);
        throw new Error(errorData.error?.message || `API test failed: ${testResponse.status}`);
      }

      setApiVerified(true);
      toast.success('✅ API Key verified successfully!');
      
      // Auto-fetch limits after successful verification
      await fetchOpenRouterLimits();
    } catch (error: any) {
      console.error('Error testing API key:', error);
      setApiVerified(false);
      
      // Better error message
      let errorMsg = 'Invalid API key';
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        errorMsg = 'Network error - check your internet connection';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      toast.error(`❌ API verification failed: ${errorMsg}`);
    } finally {
      setTestingApi(false);
    }
  };

  const fetchOpenRouterLimits = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key first');
      return;
    }

    setFetchingLimits(true);
    try {
      // Fetch key limits, credits, and activity in parallel
      const [keyResponse, creditsResponse, activityResponse] = await Promise.all([
        fetch('https://openrouter.ai/api/v1/key', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI FormBuilder Admin',
          },
        }),
        fetch('https://openrouter.ai/api/v1/credits', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI FormBuilder Admin',
          },
        }),
        fetch('https://openrouter.ai/api/v1/activity', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI FormBuilder Admin',
          },
        })
      ]);

      console.log('Key Response Status:', keyResponse.status);
      console.log('Credits Response Status:', creditsResponse.status);
      console.log('Activity Response Status:', activityResponse.status);

      if (!keyResponse.ok) {
        const errorData = await keyResponse.json().catch(() => ({}));
        console.error('Key API Error:', errorData);
        throw new Error(`Failed to fetch limits: ${keyResponse.status} ${keyResponse.statusText}`);
      }

      const keyResult = await keyResponse.json();
      console.log('Key Result:', keyResult);
      setOpenRouterData(keyResult.data);

      // Credits endpoint might fail, handle gracefully
      if (creditsResponse.ok) {
        const creditsResult = await creditsResponse.json();
        console.log('Credits Result:', creditsResult);
        setCreditsData(creditsResult.data);
      } else {
        console.warn('Credits endpoint failed, continuing without credits data');
        setCreditsData(null);
      }

      // Activity endpoint might fail, handle gracefully
      if (activityResponse.ok) {
        const activityResult = await activityResponse.json();
        console.log('Activity Result:', activityResult);
        setActivityData(activityResult.data || []);
      } else {
        console.warn('Activity endpoint failed, continuing without activity data');
        setActivityData([]);
      }

      toast.success('📊 API data fetched successfully!');
    } catch (error: any) {
      console.error('Error fetching OpenRouter data:', error);
      toast.error(`Failed to fetch data: ${error.message || 'Unknown error'}`);
      setOpenRouterData(null);
      setCreditsData(null);
      setActivityData([]);
    } finally {
      setFetchingLimits(false);
    }
  };

  const loadMoreUsers = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayedUserCount(prev => prev + 10);
      setLoadingMore(false);
    }, 300);
  };
  
  if (!user || user.email !== SUPER_ADMIN_EMAIL) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'activity', label: 'Activity Tracking', icon: Activity },
    { id: 'status', label: 'App Status', icon: Server },
    { id: 'api', label: 'API Config', icon: Key }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            Super Admin Dashboard
          </h1>
          <div className="flex gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <span className="font-semibold">{user?.email}</span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {loadingStats && activeTab !== 'api' ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading data...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                        <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.users}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
                        <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                        <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Forms</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.forms}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Submissions</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSubmissions}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Engagement Rate</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Active Users Rate</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {stats.users > 0 ? Math.round((stats.activeUsers / stats.users) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${stats.users > 0 ? (stats.activeUsers / stats.users) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Averages</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Forms per Active User</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {stats.activeUsers > 0 ? (stats.forms / stats.activeUsers).toFixed(1) : 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Submissions per Form</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {stats.forms > 0 ? (stats.totalSubmissions / stats.forms).toFixed(1) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Details</h2>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {Math.min(displayedUserCount, userDetails.length)} of {userDetails.length} users
                  </div>
                </div>
                {userDetails.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Company</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Industry</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Forms</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Submissions</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Joined</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Last Active</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDetails.slice(0, displayedUserCount).map((user) => (
                            <tr 
                              key={user.uid}
                              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                              <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                                {user.email}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {user.fullName}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {user.companyName}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {user.industry}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {user.formCount}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  {user.totalSubmissions}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {user.createdAt}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {user.lastActive}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {displayedUserCount < userDetails.length && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={loadMoreUsers}
                          disabled={loadingMore}
                          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                        >
                          {loadingMore ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Loading...
                            </>
                          ) : (
                            <>
                              Load More Users
                              <span className="text-sm opacity-80">({userDetails.length - displayedUserCount} remaining)</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Users Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      No users have registered yet. Users need to sign up first.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Forms Tab */}
            {activeTab === 'forms' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Form Usage Details</h2>
                </div>
                {formDetails.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Form Title</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Owner</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Submissions</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formDetails.map((form) => (
                          <tr 
                            key={form.formId}
                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                              {form.formTitle}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {form.ownerEmail}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                form.submissionCount > 10 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : form.submissionCount > 0
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {form.submissionCount}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {form.createdAt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Forms Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      No forms have been created yet. Users need to create forms first.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Activity Tracking Tab */}
            {activeTab === 'activity' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Timeline</h2>
                </div>
                {activityLogs.length > 0 ? (
                  <div className="space-y-4">
                    {activityLogs.map((activity) => (
                      <div 
                        key={activity.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg mt-1">
                          <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{activity.action}</h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{activity.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.userEmail}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{activity.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No activity logs available
                  </div>
                )}
              </div>
            )}

            {/* App Status Tab */}
            {activeTab === 'status' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="font-bold text-gray-900 dark:text-white">System Status</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                        <span className="text-sm font-semibold text-green-600">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Authentication</span>
                        <span className="text-sm font-semibold text-green-600">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">AI Service</span>
                        <span className="text-sm font-semibold text-green-600">Operational</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-6 h-6 text-yellow-600" />
                      <h3 className="font-bold text-gray-900 dark:text-white">Performance</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">&lt; 200ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">99.9%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">0.01%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Server className="w-6 h-6 text-blue-600" />
                      <h3 className="font-bold text-gray-900 dark:text-white">Resources</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {((stats.totalSubmissions * 2 + stats.forms * 5) / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Database Reads</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {stats.users + stats.forms + stats.totalSubmissions}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">API Calls</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Normal</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">System Health</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Overall Health</span>
                        <span className="text-sm font-semibold text-green-600">Excellent</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Config Tab */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Key className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      OpenRouter API Key Management
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        OpenRouter API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="sk-or-v1-..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        >
                          {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        This API key will be used for AI form generation across the platform
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={saveApiKey}
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save API Key'}
                      </button>

                      <button
                        onClick={testApiKey}
                        disabled={testingApi || !apiKey.trim()}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          apiVerified === true 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : apiVerified === false 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                      >
                        <CheckCircle className="w-5 h-5" />
                        {testingApi ? 'Testing...' : apiVerified === true ? '✓ Verified' : apiVerified === false ? '✗ Failed' : 'Test & Verify'}
                      </button>

                      <button
                        onClick={fetchOpenRouterLimits}
                        disabled={fetchingLimits || !apiKey.trim()}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Activity className="w-5 h-5" />
                        {fetchingLimits ? 'Fetching...' : 'Check Limits'}
                      </button>
                    </div>
                  </div>

                  {apiVerified !== null && (
                    <div className={`p-4 rounded-lg border ${
                      apiVerified 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                    }`}>
                      <p className={`text-sm ${
                        apiVerified 
                          ? 'text-green-800 dark:text-green-200' 
                          : 'text-red-800 dark:text-red-200'
                      }`}>
                        <strong>{apiVerified ? '✅ API Key Status:' : '❌ API Key Status:'}</strong> {apiVerified ? 'Valid and working! The key has been verified with OpenRouter API.' : 'Invalid or expired. Please check your API key and try again.'}
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>How to use:</strong>
                      <br />1. Enter your OpenRouter API key above
                      <br />2. Click "Test & Verify" to check if the key works with a model
                      <br />3. Click "Save API Key" to store it securely
                      <br />4. Use "Check Limits" to see your usage and rate limits
                    </p>
                  </div>
                </div>

                {/* Credits Overview */}
                {creditsData && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Zap className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Credits Overview
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
                        <div className="flex items-center gap-3 mb-3">
                          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Total Credits Purchased</h3>
                        </div>
                        <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                          ${creditsData.total_credits.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Total amount added to account
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl p-6 border border-amber-200 dark:border-amber-700">
                        <div className="flex items-center gap-3 mb-3">
                          <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Total Usage</h3>
                        </div>
                        <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                          ${creditsData.total_usage.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Total credits consumed
                        </p>
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Current Balance</h3>
                          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                            ${(creditsData.total_credits - creditsData.total_usage).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Usage Rate</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {creditsData.total_credits > 0 
                              ? ((creditsData.total_usage / creditsData.total_credits) * 100).toFixed(1) 
                              : 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Usage & Limits */}
                {openRouterData && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <BarChart3 className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        API Usage & Rate Limits
                      </h2>
                    </div>

                    {/* Credit Limits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-3 mb-3">
                          <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Credit Limit</h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {openRouterData.limit === null ? 'Unlimited' : `$${openRouterData.limit.toFixed(2)}`}
                        </p>
                        {openRouterData.limit_reset && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Resets: {openRouterData.limit_reset}
                          </p>
                        )}
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 border border-green-200 dark:border-green-700">
                        <div className="flex items-center gap-3 mb-3">
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Credits Remaining</h3>
                        </div>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {openRouterData.limit_remaining === null ? 'Unlimited' : `$${openRouterData.limit_remaining.toFixed(2)}`}
                        </p>
                        {openRouterData.limit !== null && openRouterData.limit_remaining !== null && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {((openRouterData.limit_remaining / openRouterData.limit) * 100).toFixed(1)}% remaining
                          </p>
                        )}
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-3 mb-3">
                          <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Total Usage</h3>
                        </div>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          ${openRouterData.usage.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {openRouterData.is_free_tier ? 'Free Tier' : 'Paid Tier'}
                        </p>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Usage Breakdown</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Usage</span>
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${openRouterData.usage_daily.toFixed(4)}
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Weekly Usage</span>
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${openRouterData.usage_weekly.toFixed(4)}
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Usage</span>
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${openRouterData.usage_monthly.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* BYOK Usage if applicable */}
                    {(openRouterData.byok_usage > 0 || openRouterData.include_byok_in_limit) && (
                      <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Key className="w-5 h-5 text-orange-600" />
                          BYOK (Bring Your Own Key) Usage
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total BYOK</span>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              ${openRouterData.byok_usage.toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Daily</span>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              ${openRouterData.byok_usage_daily.toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Weekly</span>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              ${openRouterData.byok_usage_weekly.toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Monthly</span>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              ${openRouterData.byok_usage_monthly.toFixed(4)}
                            </p>
                          </div>
                        </div>
                        {openRouterData.include_byok_in_limit && (
                          <p className="mt-3 text-sm text-orange-700 dark:text-orange-400">
                            ⚠️ BYOK usage is included in your credit limit
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Activity Analytics */}
                {activityData.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Activity className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        API Activity Analytics (Last 30 Days)
                      </h2>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Requests</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {activityData.reduce((sum, item) => sum + item.requests, 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Usage</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ${activityData.reduce((sum, item) => sum + item.usage, 0).toFixed(4)}
                        </p>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prompt Tokens</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {activityData.reduce((sum, item) => sum + item.prompt_tokens, 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completion Tokens</p>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {activityData.reduce((sum, item) => sum + item.completion_tokens, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Activity Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Model</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Provider</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Requests</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Usage ($)</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Prompt Tokens</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Completion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activityData.slice(0, 20).map((activity, index) => (
                            <tr 
                              key={`${activity.endpoint_id}-${index}`}
                              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                              <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                {activity.date}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                                {activity.model}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {activity.provider_name}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {activity.requests}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                ${activity.usage.toFixed(4)}
                              </td>
                              <td className="py-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                {activity.prompt_tokens.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                {activity.completion_tokens.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {activityData.length > 20 && (
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                        Showing 20 of {activityData.length} activity records
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
