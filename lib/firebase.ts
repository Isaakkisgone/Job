// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcLvOEOdBL-SstHMezQZloaRXkqT8q9H0",
  authDomain: "ochiroo-dca89.firebaseapp.com",
  projectId: "ochiroo-dca89",
  storageBucket: "ochiroo-dca89.firebasestorage.app",
  messagingSenderId: "400950312235",
  appId: "1:400950312235:web:d3acacd5653d68b304d96e",
  measurementId: "G-Q1RNKZZLF4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
