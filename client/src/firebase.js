// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Replace these values with your actual Firebase project config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyB2kYZFVmP-eYvlVmQauZulLhEC8kUTxk4",
  authDomain: "sharedshelf-37bf2.firebaseapp.com",
  projectId: "sharedshelf-37bf2",
  storageBucket: "sharedshelf-37bf2.firebasestorage.app",
  messagingSenderId: "189238232683",
  appId: "1:189238232683:web:577367dd9a18866aec932e",
  measurementId: "G-W6FCTC5YN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);