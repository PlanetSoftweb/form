import { create } from 'zustand';
import { db } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import type { FormState, Form, FormSubmission } from './types/form';

export const useFormStore = create<FormState>((set, get) => ({
  forms: [],
  currentForm: null,
  submissions: [],
  loading: false,
  error: null,
  subscriptions: new Map(),

  fetchForm: async (formId) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, 'forms', formId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const formData = docSnap.data();
        const form = { 
          ...formData, 
          id: docSnap.id,
          createdAt: formData.createdAt?.toDate(),
          updatedAt: formData.updatedAt?.toDate(),
          publishedAt: formData.publishedAt?.toDate(),
        } as Form;
        
        set({ currentForm: form, loading: false });
        get().subscribeToFormSubmissions(formId);
        return form;
      }
      set({ loading: false });
      return null;
    } catch (error: any) {
      console.error('Error fetching form:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to load form');
      return null;
    }
  },

  fetchForms: async (userId) => {
    try {
      set({ loading: true, error: null });
      const formsRef = collection(db, 'forms');
      const q = query(formsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const forms = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        publishedAt: doc.data().publishedAt?.toDate(),
      })) as Form[];
      
      set({ forms, loading: false });
    } catch (error: any) {
      console.error('Error fetching forms:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to load forms');
    }
  },

  saveForm: async (formData) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'forms'), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const newForm = {
        ...formData,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Form;
      
      set(state => ({ forms: [...state.forms, newForm], loading: false }));
      toast.success('Form saved successfully');
      return docRef.id;
    } catch (error: any) {
      console.error('Error saving form:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to save form');
      throw error;
    }
  },

  updateForm: async (formId, updates) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, 'forms', formId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      set(state => ({
        forms: state.forms.map(form =>
          form.id === formId
            ? { ...form, ...updates, updatedAt: new Date() }
            : form
        ),
        loading: false
      }));
      
      toast.success('Form updated successfully');
    } catch (error: any) {
      console.error('Error updating form:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to update form');
      throw error;
    }
  },

  deleteForm: async (formId) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'forms', formId));
      
      set(state => ({
        forms: state.forms.filter(form => form.id !== formId),
        loading: false
      }));
      
      toast.success('Form deleted successfully');
    } catch (error: any) {
      console.error('Error deleting form:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to delete form');
      throw error;
    }
  },

  publishForm: async (formId) => {
    try {
      set({ loading: true, error: null });
      await updateDoc(doc(db, 'forms', formId), {
        published: true,
        publishedAt: serverTimestamp()
      });
      
      set(state => ({
        forms: state.forms.map(form =>
          form.id === formId
            ? { ...form, published: true, publishedAt: new Date() }
            : form
        ),
        loading: false
      }));
      
      toast.success('Form published successfully');
    } catch (error: any) {
      console.error('Error publishing form:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to publish form');
      throw error;
    }
  },

  unpublishForm: async (formId) => {
    try {
      set({ loading: true, error: null });
      await updateDoc(doc(db, 'forms', formId), {
        published: false,
        publishedAt: null
      });
      
      set(state => ({
        forms: state.forms.map(form =>
          form.id === formId
            ? { ...form, published: false, publishedAt: undefined }
            : form
        ),
        loading: false
      }));
      
      toast.success('Form unpublished successfully');
    } catch (error: any) {
      console.error('Error unpublishing form:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to unpublish form');
      throw error;
    }
  },

  submitFormResponse: async (formId, responses) => {
    try {
      set({ loading: true, error: null });
      const submissionRef = await addDoc(collection(db, `forms/${formId}/submissions`), {
        responses,
        submittedAt: serverTimestamp()
      });
      
      const newSubmission = {
        id: submissionRef.id,
        responses,
        submittedAt: new Date()
      };
      
      set(state => ({
        submissions: [...state.submissions, newSubmission],
        loading: false
      }));
      
      toast.success('Response submitted successfully');
    } catch (error: any) {
      console.error('Error submitting response:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to submit response');
      throw error;
    }
  },

  updateSubmission: async (formId, submissionId, responses) => {
    try {
      set({ loading: true, error: null });
      await updateDoc(doc(db, `forms/${formId}/submissions`, submissionId), {
        responses,
        updatedAt: serverTimestamp()
      });
      
      set(state => ({
        submissions: state.submissions.map(sub =>
          sub.id === submissionId
            ? { ...sub, responses }
            : sub
        ),
        loading: false
      }));
      
      toast.success('Response updated successfully');
    } catch (error: any) {
      console.error('Error updating submission:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to update response');
      throw error;
    }
  },

  deleteSubmission: async (formId, submissionId) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, `forms/${formId}/submissions`, submissionId));
      
      set(state => ({
        submissions: state.submissions.filter(sub => sub.id !== submissionId),
        loading: false
      }));
      
      toast.success('Response deleted successfully');
    } catch (error: any) {
      console.error('Error deleting submission:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to delete response');
      throw error;
    }
  },

  subscribeToFormSubmissions: (formId) => {
    const existingSub = get().subscriptions.get(formId);
    if (existingSub) {
      existingSub();
      get().subscriptions.delete(formId);
    }

    const submissionsRef = collection(db, `forms/${formId}/submissions`);
    const unsubscribe = onSnapshot(submissionsRef, (snapshot) => {
      const submissions = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        submittedAt: doc.data().submittedAt?.toDate(),
      })) as FormSubmission[];

      set(state => ({
        submissions,
        forms: state.forms.map(form => 
          form.id === formId 
            ? { ...form, submissions }
            : form
        )
      }));
    }, (error) => {
      console.error('Error in submissions subscription:', error);
      toast.error('Failed to sync submissions');
    });

    get().subscriptions.set(formId, unsubscribe);
    return unsubscribe;
  },

  cleanup: () => {
    const { subscriptions } = get();
    subscriptions.forEach(unsubscribe => unsubscribe());
    subscriptions.clear();
  }
}));

export type { Form, FormElement, FormSubmission } from './types/form';