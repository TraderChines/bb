
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "studio-6066508295-d330e.firebaseapp.com",
  projectId: "studio-6066508295-d330e",
  storageBucket: "studio-6066508295-d330e.firebasestorage.app",
  messagingSenderId: "1071286958434",
  appId: "1:1071286958434:web:055811c0f1e00f91a92e1b"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
