// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBH8oqNRMke8oA3euwRafn4vI7j495yz6c",
  authDomain: "opensource-a1209.firebaseapp.com",
  projectId: "opensource-a1209",
  storageBucket: "opensource-a1209.firebasestorage.app",
  messagingSenderId: "199585559950",
  appId: "1:199585559950:web:b30d34c6543d7310f7e0df",
  measurementId: "G-KDDSRHYSZ6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
