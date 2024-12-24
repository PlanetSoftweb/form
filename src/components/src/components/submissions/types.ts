import { FormElement } from '../../store/formStore';

export interface SubmissionViewProps {
  formId: string;
  elements: FormElement[];
}

export interface EditModalProps {
  elements: FormElement[];
  editedResponses: Record<string, any>;
  setEditedResponses: (responses: Record<string, any>) => void;
  onClose: () => void;
  onSave: () => void;
}

export interface FormSubmissionResponse {
  [key: string]: any;
}

export interface FilterState {
  [key: string]: string;
}

export type ViewMode = 'table' | 'grid';

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100] as const;