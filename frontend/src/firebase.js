// Firebase client-side configuration
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAIJOcqaDxqpztV7KOj52jNeyBnyuSV4DQ",
  authDomain: "chatify-app-156f9.firebaseapp.com",
  projectId: "chatify-app-156f9",
  storageBucket: "chatify-app-156f9.firebasestorage.app",
  messagingSenderId: "860952101473",
  appId: "1:860952101473:web:bbb9417cca46b26b246020",
  measurementId: "G-XK3S7KEJHX"
};

// Initialize Firebase (check if already initialized)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Export for use in components
export { app, auth, googleProvider, signInWithPopup };

// Helper function to sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return { idToken, user: result.user };
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

