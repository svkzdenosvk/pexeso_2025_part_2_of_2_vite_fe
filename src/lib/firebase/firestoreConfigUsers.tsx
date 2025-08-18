// Firebase core SDK imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

/**
 * Firebase Initialization (Users Database)
 *
 * Sets up Firebase services for authentication and Firestore.
 * The configuration object contains all required credentials
 * to connect this application to the Firebase project.
 *
 * Features:
 * 1. **Authentication** → Handles user sign-in/sign-up and session management.
 * 2. **Firestore** → Cloud database for storing application data.
 *
 * @note
 * - `measurementId` is optional and used only for analytics.
 * - Keep `firebaseConfig` values secure; avoid exposing them in public repos.
 */

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyA3bnLyVXbZWyAUe8gfEoKseDRWjfEYHBA",
  authDomain: "pexesousers.firebaseapp.com",
  projectId: "pexesousers",
  storageBucket: "pexesousers.firebasestorage.app",
  messagingSenderId: "1000059706799",
  appId: "1:1000059706799:web:59f3d7ad9b18917163a35a",
  measurementId: "G-KB4KHDC2V6"
};

// Initialize Firebase App
const appUsers = initializeApp(firebaseConfig);

// Export initialized Firebase services
export const auth = getAuth(appUsers); // Authentication service
export const projectUsers = getFirestore(appUsers); // Firestore database
// const analytics = getAnalytics(appUsers); // Optional: Firebase Analytics
