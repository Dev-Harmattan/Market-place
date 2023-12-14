// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'market-place-58558.firebaseapp.com',
  projectId: 'market-place-58558',
  storageBucket: 'market-place-58558.appspot.com',
  messagingSenderId: '452412424273',
  appId: '1:452412424273:web:9e5a28d89cb2925f837870',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
