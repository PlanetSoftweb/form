// Centralize all constants
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Manufacturing',
  'Retail',
  'Other'
];

export const INTEREST_AREAS = [
  'Customer Feedback',
  'Employee Surveys',
  'Market Research',
  'Event Registration',
  'Lead Generation',
  'Education/Training',
  'Other'
];

export const FORM_TEMPLATES = [
  {
    id: 'contact',
    name: 'Contact Form',
    description: 'Basic contact form with name, email, and message fields',
    elements: [
      { type: 'text', label: 'Full Name', required: true, id: 'name' },
      { type: 'email', label: 'Email Address', required: true, id: 'email' },
      { type: 'textarea', label: 'Message', required: true, id: 'message' }
    ]
  },
  {
    id: 'feedback',
    name: 'Customer Feedback',
    description: 'Collect detailed feedback about your product or service',
    elements: [
      { type: 'text', label: 'Name', required: true, id: 'name' },
      { type: 'email', label: 'Email', required: true, id: 'email' },
      { type: 'select', label: 'Rating', required: true, id: 'rating', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
      { type: 'textarea', label: 'What could we improve?', required: false, id: 'improvements' }
    ]
  },
  {
    id: 'event',
    name: 'Event Registration',
    description: 'Collect registrations for your upcoming event',
    elements: [
      { type: 'text', label: 'Attendee Name', required: true, id: 'name' },
      { type: 'email', label: 'Email Address', required: true, id: 'email' },
      { type: 'select', label: 'Ticket Type', required: true, id: 'ticket', options: ['Standard', 'VIP', 'Group'] },
      { type: 'textarea', label: 'Special Requirements', required: false, id: 'requirements' }
    ]
  }
];