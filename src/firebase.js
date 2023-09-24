// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAVqxE5T85Mq4MEx0B2AdJ6QhlVkz4pdOg",
  authDomain: "bharathonecare4.firebaseapp.com",
  projectId: "bharathonecare4",
  storageBucket: "bharathonecare4.appspot.com",
  messagingSenderId: "415146097766",
  appId: "1:415146097766:web:e184219ffcecad57dbc1a7",
  measurementId: "G-T90HV3ET0E"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
// Initialize Firebase
