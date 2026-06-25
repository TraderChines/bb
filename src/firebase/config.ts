
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB...", // Substituído pelas credenciais reais do projeto
  authDomain: "nextn-...",
  projectId: "nextn-...",
  storageBucket: "nextn-...",
  messagingSenderId: "...",
  appId: "..."
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
