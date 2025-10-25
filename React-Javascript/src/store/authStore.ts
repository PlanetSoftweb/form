import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface UserData {
  email: string;
  fullName: string;
  companyName: string;
  industry: string;
  interests: string[];
  additionalInfo?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  unverifiedEmail: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, userData: UserData) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => () => void;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,
  unverifiedEmail: null,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        set({ user, loading: false, initialized: true });
      },
      (error) => {
        console.error('Auth state change error:', error);
        set({ error: error.message, loading: false, initialized: true });
      }
    );
    return unsubscribe;
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null, unverifiedEmail: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await firebaseSignOut(auth);
        set({ error: 'email-not-verified', user: null, unverifiedEmail: email });
        toast.error('Please verify your email before signing in');
        return;
      }

      set({ user: userCredential.user, unverifiedEmail: null });
      toast.success('Signed in successfully');
    } catch (error: any) {
      let errorMessage = 'Failed to sign in';
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
      }
      
      set({ error: errorMessage, user: null });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, if not create one
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        fullName: userCredential.user.displayName || '',
        companyName: '',
        industry: '',
        interests: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      set({ user: userCredential.user });
      toast.success('Signed in with Google successfully');
    } catch (error: any) {
      let errorMessage = 'Failed to sign in with Google';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Pop-up blocked by browser. Please allow pop-ups and try again';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign-in cancelled';
          break;
      }
      
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, userData) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore first
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Send email verification
      try {
        await sendEmailVerification(userCredential.user);
        toast.success('Account created! Please check your email (including spam folder) to verify your account.', { duration: 6000 });
      } catch (emailError: any) {
        console.error('Email verification error:', emailError);
        // Account is created successfully, just email failed
        toast.success('Account created! However, verification email failed to send. Please contact support or try again later.', { duration: 7000 });
      }
      
      // Sign out user until email is verified
      await firebaseSignOut(auth);
      
      set({ user: null });
    } catch (error: any) {
      let errorMessage = 'Failed to create account';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
      }
      
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (email) => {
    try {
      set({ loading: true, error: null });
      
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Please check your inbox and spam folder.', { duration: 6000 });
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email';
      
      switch (error.code) {
        case 'auth/user-not-found':
          // Don't reveal if user exists for security, but still show success
          toast.success('If an account exists with this email, a password reset link has been sent.', { duration: 6000 });
          set({ loading: false });
          return;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
          break;
      }
      
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await firebaseSignOut(auth);
      set({ user: null });
      toast.success('Signed out successfully');
      window.location.href = '/'; // Redirect to landing page after logout
    } catch (error: any) {
      set({ error: error.message });
      toast.error('Failed to sign out');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resendVerificationEmail: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      // Sign in temporarily to get user object (needed for sendEmailVerification)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      // Sign out immediately
      await firebaseSignOut(auth);
      
      set({ user: null, loading: false });
      toast.success('Verification email sent! Please check your inbox and spam folder.', { duration: 6000 });
    } catch (error: any) {
      let errorMessage = 'Failed to resend verification email';
      
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          errorMessage = 'Invalid password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
          break;
      }
      
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
}));