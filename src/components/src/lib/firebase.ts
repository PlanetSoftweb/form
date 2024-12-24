import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCndlqRu38bLPh78fJlZTe_zzNhQmCUVQ4",
  authDomain: "rpvis-da1e7.firebaseapp.com",
  projectId: "rpvis-da1e7",
  storageBucket: "rpvis-da1e7.firebasestorage.app",
  messagingSenderId: "212803806874",
  appId: "1:212803806874:web:99a107ee13018c227ca123",
  measurementId: "G-HR3CCY1R7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with settings
const firestoreSettings = {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  ignoreUndefinedProperties: true
};

// Initialize services with enhanced settings
export const db = initializeFirestore(app, firestoreSettings);
export const auth = getAuth(app);

// Configure auth settings
auth.useDeviceLanguage(); // Use the device's language
auth.settings.appVerificationDisabledForTesting = false; // Enable verification in production

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db, {
  synchronizeTabs: true
}).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});

// Initialize Analytics only in production
const initializeAnalytics = async () => {
  if (process.env.NODE_ENV === 'production') {
    try {
      if (await isSupported()) {
        return getAnalytics(app);
      }
    } catch (err) {
      console.warn('Analytics not supported:', err);
    }
  }
  return null;
};

export const analytics = initializeAnalytics();

// Helper function to handle Firestore timestamps
export const serverTimestamp = () => new Date();

export default app;