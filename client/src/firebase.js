// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-fa701.firebaseapp.com",
  projectId: "mern-auth-fa701",
  storageBucket: "mern-auth-fa701.firebasestorage.app",
  messagingSenderId: "790477287483",
  appId: "1:790477287483:web:4f73a243815ca76b7cec1e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


