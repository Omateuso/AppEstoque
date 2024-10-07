import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCYsI8WOJKl1hfyFOxiWSzpyjB2mZ3bgv8",
  authDomain: "bazarestrela-d30a2.firebaseapp.com",
  projectId: "bazarestrela-d30a2",
  storageBucket: "bazarestrela-d30a2.appspot.com",
  messagingSenderId: "828086429120",
  appId: "1:828086429120:web:b18dafee8693d9c64b9425"
};

// Inicializando o app Firebase
export const firebase = initializeApp(firebaseConfig);

// Inicializando o Auth com persistência
export const auth = initializeAuth(firebase, {
  persistence: getReactNativePersistence(AsyncStorage),
});

