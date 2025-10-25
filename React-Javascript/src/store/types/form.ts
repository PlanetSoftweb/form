export interface FormElement {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: Record<string, any>;
  style?: Record<string, any>;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  elements: FormElement[];
  userId: string;
  published?: boolean;
  style: Record<string, any>;
  settings?: {
    submitMessage?: string;
    redirectUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface FormSubmission {
  id: string;
  responses: Record<string, any>;
  submittedAt: Date;
}

export interface FormState {
  forms: Form[];
  currentForm: Form | null;
  submissions: FormSubmission[];
  loading: boolean;
  error: string | null;
  subscriptions: Map<string, () => void>;
  fetchForm: (formId: string) => Promise<Form | null>;
  fetchForms: (userId: string) => Promise<void>;
  saveForm: (formData: Partial<Form>) => Promise<string>;
  updateForm: (formId: string, updates: Partial<Form>) => Promise<void>;
  deleteForm: (formId: string) => Promise<void>;
  publishForm: (formId: string) => Promise<void>;
  unpublishForm: (formId: string) => Promise<void>;
  submitFormResponse: (formId: string, responses: Record<string, any>) => Promise<void>;
  updateSubmission: (formId: string, submissionId: string, responses: Record<string, any>) => Promise<void>;
  deleteSubmission: (formId: string, submissionId: string) => Promise<void>;
  subscribeToFormSubmissions: (formId: string) => () => void;
  cleanup: () => void;
}