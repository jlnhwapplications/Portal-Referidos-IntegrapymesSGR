import { initializeApp } from 'firebase/app';
import { getAuth, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: `${process.env.NEXT_PUBLIC_FIREBASE_APIKEY}`,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN}`, 
  projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECTID}`,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET}`,
  messagingSenderId: `${process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID}`,
  appId: `${process.env.NEXT_PUBLIC_FIREBASE_APPID}`,
};

const app = initializeApp(firebaseConfig, 'Portal-referido-web');
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const provider = new OAuthProvider('microsoft.com');

export { app, auth, firestore, storage, provider };