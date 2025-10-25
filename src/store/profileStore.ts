import { create } from 'zustand';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

interface UserProfile {
  email: string;
  fullName: string;
  companyName: string;
  industry: string;
  interests: string[];
  additionalInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({ 
          profile: {
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          } as UserProfile
        });
      } else {
        set({ error: 'Profile not found' });
        toast.error('Profile not found');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      set({ error: error.message });
      if (error.code === 'permission-denied') {
        toast.error('Please sign in to view your profile');
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, 'users', userId);
      
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          ...updates,
          updatedAt: new Date()
        } : null
      }));

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      set({ error: error.message });
      if (error.code === 'permission-denied') {
        toast.error('Please sign in to update your profile');
      } else {
        toast.error('Failed to update profile');
      }
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));