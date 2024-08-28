// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGT8mVQNufIxpR_xyS48USwuK_u_BK80U",
  authDomain: "pipravi-xx.firebaseapp.com",
  projectId: "pipravi-xx",
  storageBucket: "pipravi-xx.appspot.com",
  messagingSenderId: "1037703258011",
  appId: "1:1037703258011:web:8457cce22eefb5d2adcb3e",
  measurementId: "G-G9DQ2CSB57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {app, firestore };