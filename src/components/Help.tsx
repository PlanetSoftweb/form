import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Book, Zap, Users, Shield, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqItems: FAQItem[] = [
    {
      category: 'Getting Started',
      question: 'How do I create my first form?',
      answer: 'After signing in, click the "Create Form" button on your dashboard. You can start from scratch, use a template, or let our AI generate a form based on your description. Then use the drag-and-drop editor to add and customize form elements.'
    },
    {
      category: 'Getting Started',
      question: 'Do I need coding knowledge to use FormBuilder?',
      answer: 'No! FormBuilder is designed to be completely code-free. Our intuitive drag-and-drop interface makes it easy for anyone to create professional forms without any technical knowledge.'
    },
    {
      category: 'Getting Started',
      question: 'How do I share my form?',
      answer: 'Once you publish your form, you can share it via a unique URL or embed it on your website using the provided embed code. You can find these options in the form settings after publishing.'
    },
    {
      category: 'Forms & Features',
      question: 'What types of form elements can I add?',
      answer: 'FormBuilder supports various elements including text inputs, textareas, dropdowns, checkboxes, radio buttons, date/time pickers, file uploads, ratings, headings, paragraphs, images, and dividers. You can customize each element\'s properties and styling.'
    },
    {
      category: 'Forms & Features',
      question: 'Can I customize the appearance of my forms?',
      answer: 'Yes! You have full control over your form\'s styling including colors, fonts, border radius, background effects, and layout. The style editor provides real-time preview so you can see changes instantly.'
    },
    {
      category: 'Forms & Features',
      question: 'How does the AI form generator work?',
      answer: 'Our AI-powered form generator uses advanced language models to create forms based on your description. Simply describe what kind of form you need (e.g., "customer feedback survey" or "event registration"), and our AI will generate a complete form structure with appropriate fields.'
    },
    {
      category: 'Forms & Features',
      question: 'Can I duplicate or reuse forms?',
      answer: 'Yes, you can duplicate existing forms from your dashboard. This is useful when you want to create similar forms or use a previous form as a template for a new one.'
    },
    {
      category: 'Submissions & Data',
      question: 'How do I view form submissions?',
      answer: 'Go to your form in the builder and click the "Submissions" tab. You can view all responses, filter and search submissions, view detailed analytics, and export data to CSV format.'
    },
    {
      category: 'Submissions & Data',
      question: 'Can I export submission data?',
      answer: 'Yes! You can export all submissions to CSV format for further analysis in spreadsheet applications like Excel or Google Sheets. The export button is available in the submissions view.'
    },
    {
      category: 'Submissions & Data',
      question: 'Is my data secure?',
      answer: 'Absolutely. We use Firebase (Google Cloud Platform) for secure data storage with encryption in transit and at rest. All data is backed up regularly, and we follow industry best practices for security and privacy.'
    },
    {
      category: 'Submissions & Data',
      question: 'How does spam detection work?',
      answer: 'FormBuilder includes built-in spam detection that analyzes submissions for suspicious patterns, spam keywords, and malicious content. Potential spam is flagged for your review in the submissions dashboard.'
    },
    {
      category: 'Account & Billing',
      question: 'Is FormBuilder free to use?',
      answer: 'FormBuilder offers both free and premium plans. The free plan includes basic features perfect for getting started. Premium plans offer advanced features, higher submission limits, and priority support.'
    },
    {
      category: 'Account & Billing',
      question: 'How do I reset my password?',
      answer: 'Click the "Forgot Password?" link on the login page. Enter your email address and we\'ll send you instructions to reset your password. Check your spam folder if you don\'t receive the email within a few minutes.'
    },
    {
      category: 'Account & Billing',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account from the Profile settings page. Please note that deleting your account will permanently remove all your forms and submission data. This action cannot be undone.'
    },
    {
      category: 'Technical',
      question: 'Can I embed forms on my website?',
      answer: 'Yes! After publishing your form, you can embed it on any website using the provided iframe code. The embedded form is fully responsive and maintains all functionality.'
    },
    {
      category: 'Technical',
      question: 'What browsers are supported?',
      answer: 'FormBuilder works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience.'
    },
    {
      category: 'Technical',
      question: 'Is FormBuilder mobile-friendly?',
      answer: 'Yes! Both the form builder interface and published forms are fully responsive and work perfectly on mobile devices, tablets, and desktops.'
    },
    {
      category: 'Technical',
      question: 'What happens if I lose internet connection while creating a form?',
      answer: 'FormBuilder includes offline persistence, so your work is saved locally and will sync automatically when your connection is restored. However, we recommend saving your forms regularly to prevent any potential data loss.'
    }
  ];

  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleItem = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of FormBuilder
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Book className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Getting Started</h3>
            <p className="text-sm text-gray-600 mt-2">Learn the basics</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Forms & Features</h3>
            <p className="text-sm text-gray-600 mt-2">Build amazing forms</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Submissions</h3>
            <p className="text-sm text-gray-600 mt-2">Manage responses</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Security</h3>
            <p className="text-sm text-gray-600 mt-2">Data protection</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          {categories.map(category => {
            const categoryItems = filteredFAQs.filter(item => item.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">
                    {category}
                  </span>
                </h3>
                <div className="space-y-3">
                  {categoryItems.map((item) => {
                    const globalIndex = faqItems.indexOf(item);
                    const isExpanded = expandedItems.includes(globalIndex);

                    return (
                      <div key={globalIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-4 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">No results found for "{searchTerm}"</p>
              <p className="text-gray-400 mt-2">Try searching with different keywords</p>
            </div>
          )}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you with any questions or issues.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};
