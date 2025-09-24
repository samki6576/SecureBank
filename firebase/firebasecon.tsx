// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAXAtVpeBWpCLJIL2cHAX-xbIFyCY9kF2E",
    authDomain: "track-3447a.firebaseapp.com",
    projectId: "track-3447a",
    storageBucket: "track-3447a.firebasestorage.app",
    messagingSenderId: "63403525240",
    appId: "1:63403525240:web:f8736056791bfbe195198d"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
