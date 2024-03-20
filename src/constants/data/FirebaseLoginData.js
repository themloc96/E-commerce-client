// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1bx73HNl2zB6nw9L5cfw1LHOPmnOMNfk",
  authDomain: "raonark-55440.firebaseapp.com",
  projectId: "raonark-55440",
  storageBucket: "raonark-55440.appspot.com",
  messagingSenderId: "954889427119",
  appId: "1:954889427119:web:a16035cc05d05ac2b2dc5a",
  measurementId: "G-96CWCZNP4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
// eslint-disable-next-line no-unused-vars
const auth = getAuth(app);

export {app, analytics, auth};