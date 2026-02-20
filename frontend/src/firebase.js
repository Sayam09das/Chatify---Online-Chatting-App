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

// Configure Google Auth Provider with your project ID
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export for use in components
export { app, auth, googleProvider, signInWithPopup };

// Helper function to sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    
    // Optionally verify the token locally first
    console.log('Google Sign-In successful:', result.user.email);
    
    return { idToken, user: result.user };
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    // Provide more helpful error messages
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with a different sign-in method. Please try logging in with your original method.');
    } else if (error.code === 'auth/internal-error') {
      throw new Error('Authentication service error. Please check your network and try again.');
    }
    throw error;
  }
};

