import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "-----------------------------------------",
  authDomain: "bazarestrela-d30a2.firebaseapp.com",
  projectId: "bazarestrela-d30a2",
  storageBucket: "bazarestrela-d30a2.appspot.com",
  messagingSenderId: "828086429120",
  appId: "1:828086429120:web:b18dafee8693d9c64b9425"
};

export const firebaseApp = () => {
  return initializeApp(firebaseConfig);
};

export const initAuth = () => {
  return initializeAuth(firebaseApp(), {
    persistence: getReactNativePersistence(AsyncStorage),
  });
};

export const auth = initAuth();
