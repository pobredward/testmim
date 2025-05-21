import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3oi_xJHTcyTKoE38Vk6DHWp203SgVFOM",
  authDomain: "test-zip-98f68.firebaseapp.com",
  projectId: "test-zip-98f68",
  storageBucket: "test-zip-98f68.firebasestorage.app",
  messagingSenderId: "511331550799",
  appId: "1:511331550799:web:21a63a1aeeb22edb404c3a",
  measurementId: "G-L5Q5LJ8TY2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app); 