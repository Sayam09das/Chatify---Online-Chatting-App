// Firebase Admin SDK for server-side operations
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth: getAdminAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin (singleton pattern)
let adminAuth = null;
let adminApp = null;

const getFirebaseAdminAuth = () => {
  if (adminAuth) return adminAuth;
  
  // For Firebase Admin, we use application default credentials
  // In production, you can set GOOGLE_APPLICATION_CREDENTIALS env variable
  // pointing to your service account JSON file
  try {
    // Check if already initialized
    try {
      adminApp = initializeApp();
    } catch (e) {
      // Already initialized
      adminApp = initializeApp();
    }
    adminAuth = getAdminAuth(adminApp);
    return adminAuth;
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
    // Return null if initialization fails - will handle gracefully
    return null;
  }
};

// Helper function to verify Google ID token
const verifyGoogleIdToken = async (idToken) => {
  try {
    const adminAuthInstance = getFirebaseAdminAuth();
    if (!adminAuthInstance) {
      throw new Error('Firebase Admin not initialized');
    }
    const decodedToken = await adminAuthInstance.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Token verification error:', error.message);
    throw error;
  }
};

module.exports = {
  getFirebaseAdminAuth,
  verifyGoogleIdToken
};

