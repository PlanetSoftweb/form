import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Users, Calendar, MessageSquare, ClipboardCheck, Star, 
  Search, Sparkles, Wand2, Briefcase, GraduationCap, Heart, 
  ShoppingBag, TrendingUp, Award, Gift, Phone, Mail, MapPin,
  CreditCard, UserPlus, FileCheck, BookOpen
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { AIFormDeveloper } from './modals/AIFormDeveloper';

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  color: string;
  fields: number;
  popular?: boolean;
}

const templates: Template[] = [
  {
    id: '1',
    title: 'Contact Form',
    description: 'Simple contact form with name, email, and message fields',
    icon: MessageSquare,
    category: 'Business',
    color: 'from-blue-500 to-cyan-500',
    fields: 4,
    popular: true
  },
  {
    id: '2',
    title: 'Event Registration',
    description: 'Register attendees for events with custom fields',
    icon: Calendar,
    category: 'Events',
    color: 'from-purple-500 to-pink-500',
    fields: 6,
    popular: true
  },
  {
    id: '3',
    title: 'Customer Feedback',
    description: 'Collect customer feedback and satisfaction ratings',
    icon: Star,
    category: 'Feedback',
    color: 'from-yellow-500 to-orange-500',
    fields: 5
  },
  {
    id: '4',
    title: 'Job Application',
    description: 'Professional job application form with resume upload',
    icon: FileText,
    category: 'HR',
    color: 'from-green-500 to-teal-500',
    fields: 8,
    popular: true
  },
  {
    id: '5',
    title: 'Survey',
    description: 'Multi-question survey with rating scales',
    icon: ClipboardCheck,
    category: 'Research',
    color: 'from-indigo-500 to-blue-500',
    fields: 10
  },
  {
    id: '6',
    title: 'Team Sign-up',
    description: 'Sign up form for teams and groups',
    icon: Users,
    category: 'Teams',
    color: 'from-red-500 to-pink-500',
    fields: 7
  },
  {
    id: '7',
    title: 'Course Registration',
    description: 'Educational course enrollment and registration',
    icon: GraduationCap,
    category: 'Education',
    color: 'from-violet-500 to-purple-500',
    fields: 9
  },
  {
    id: '8',
    title: 'Volunteer Sign-up',
    description: 'Volunteer registration with availability tracking',
    icon: Heart,
    category: 'Community',
    color: 'from-rose-500 to-pink-500',
    fields: 6
  },
  {
    id: '9',
    title: 'Product Order',
    description: 'Product order form with payment details',
    icon: ShoppingBag,
    category: 'Business',
    color: 'from-emerald-500 to-green-500',
    fields: 8
  },
  {
    id: '10',
    title: 'Sales Lead',
    description: 'Capture sales leads and prospect information',
    icon: TrendingUp,
    category: 'Business',
    color: 'from-cyan-500 to-blue-500',
    fields: 7
  },
  {
    id: '11',
    title: 'Contest Entry',
    description: 'Contest and giveaway entry form',
    icon: Award,
    category: 'Events',
    color: 'from-amber-500 to-yellow-500',
    fields: 5
  },
  {
    id: '12',
    title: 'Gift Registry',
    description: 'Wedding or event gift registry',
    icon: Gift,
    category: 'Events',
    color: 'from-fuchsia-500 to-pink-500',
    fields: 6
  },
  {
    id: '13',
    title: 'Support Ticket',
    description: 'Customer support request and ticket submission',
    icon: Phone,
    category: 'Business',
    color: 'from-sky-500 to-blue-500',
    fields: 6
  },
  {
    id: '14',
    title: 'Newsletter Signup',
    description: 'Email newsletter subscription form',
    icon: Mail,
    category: 'Marketing',
    color: 'from-indigo-500 to-purple-500',
    fields: 3
  },
  {
    id: '15',
    title: 'Appointment Booking',
    description: 'Schedule appointments and consultations',
    icon: Calendar,
    category: 'Business',
    color: 'from-teal-500 to-cyan-500',
    fields: 7
  },
  {
    id: '16',
    title: 'Address Collection',
    description: 'Collect shipping and billing addresses',
    icon: MapPin,
    category: 'Business',
    color: 'from-orange-500 to-red-500',
    fields: 8
  },
  {
    id: '17',
    title: 'Payment Form',
    description: 'Secure payment and billing information collection',
    icon: CreditCard,
    category: 'Business',
    color: 'from-slate-500 to-gray-600',
    fields: 9
  },
  {
    id: '18',
    title: 'Membership Registration',
    description: 'Member registration with tier selection',
    icon: UserPlus,
    category: 'Community',
    color: 'from-blue-600 to-indigo-600',
    fields: 8
  },
  {
    id: '19',
    title: 'Document Request',
    description: 'Request and upload documents',
    icon: FileCheck,
    category: 'Business',
    color: 'from-green-600 to-emerald-600',
    fields: 5
  },
  {
    id: '20',
    title: 'Quiz Form',
    description: 'Interactive quiz with scoring',
    icon: BookOpen,
    category: 'Education',
    color: 'from-purple-600 to-violet-600',
    fields: 12
  },
  {
    id: '21',
    title: 'Employee Onboarding',
    description: 'New employee onboarding information',
    icon: Briefcase,
    category: 'HR',
    color: 'from-blue-500 to-purple-500',
    fields: 15
  }
];

const categories = ['All', 'Business', 'Events', 'Feedback', 'HR', 'Research', 'Teams', 'Education', 'Community', 'Marketing'];

export const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateId: string) => {
    if (user) {
      navigate(`/builder?template=${templateId}`);
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="h-4 w-4" />
              Professional Templates
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Form Templates
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Start with a professionally designed template and customize it to your needs. Or let AI create one for you instantly.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAIModal(true)}
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all"
            >
              <Sparkles className="h-6 w-6" />
              <span>Generate Form with AI</span>
              <Wand2 className="h-5 w-5" />
            </motion.button>
            
            <p className="text-sm text-blue-100 mt-4">
              Powered by Google Gemini - Describe your form and AI will create it in seconds
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-6 mb-12"
        >
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100"
            >
              {template.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Popular
                  </span>
                </div>
              )}
              
              <div className={`h-40 bg-gradient-to-br ${template.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <template.icon className="h-20 w-20 text-white drop-shadow-lg transform group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {template.title}
                  </h3>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
                    {template.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 min-h-[48px]">{template.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{template.fields} fields</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUseTemplate(template.id)}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                  >
                    Use Template
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-lg">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No templates found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          </motion.div>
        )}
      </div>

      <AIFormDeveloper isOpen={showAIModal} onClose={() => setShowAIModal(false)} />
    </div>
  );
};
