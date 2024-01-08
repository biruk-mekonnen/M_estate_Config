// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5HJjtHRIZZdY6eWYOkkBgIZvmuAu7RAs",
  authDomain: "menoria-280d5.firebaseapp.com",
  projectId: "menoria-280d5",
  storageBucket: "menoria-280d5.appspot.com",
  messagingSenderId: "937603954972",
  appId: "1:937603954972:web:1aa4607eb3fe729092e2d9",
  measurementId: "G-5RQG762WS0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
