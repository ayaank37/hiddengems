// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCv_YG6qGhlN6SAu2jzhSU5Xm5HihHRh58",
    authDomain: "hidden-gem-explorer.firebaseapp.com",
    projectId: "hidden-gem-explorer",
    storageBucket: "hidden-gem-explorer.firebasestorage.app",
    messagingSenderId: "165583474510",
    appId: "1:165583474510:web:af1987cc5dc372d598981f",
    measurementId: "G-V81CLCP942"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
