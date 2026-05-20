// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Replace these values with your actual Firebase project config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBf1OzontZrlbzUAKjJfHeaBmD8ya8NzXo",
  authDomain: "sharedshelf-7278b.firebaseapp.com",
  projectId: "sharedshelf-7278b",
  storageBucket: "sharedshelf-7278b.firebasestorage.app",
  messagingSenderId: "437400819729",
  appId: "1:437400819729:web:9d80822b171a56a2f339b0",
  measurementId: "G-2B9Z3F3P9F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);