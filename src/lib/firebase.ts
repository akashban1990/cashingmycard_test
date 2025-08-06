// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALQXeoUYfOkCxpUeOHBq7hMHTsiPuYufc",
  authDomain: "cashingmycard-test.firebaseapp.com",
  projectId: "cashingmycard-test",
  storageBucket: "cashingmycard-test.firebasestorage.app",
  messagingSenderId: "1062417291508",
  appId: "1:1062417291508:web:ef7a00b1d3001c267ee6a1",
  measurementId: "G-NSVMMET8S7"
};

// Initialize Firebase app only once (important for hot reloads in dev)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export auth instance
export const auth = getAuth(app);
