import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9uIoUynJQrd2-5n0ulIKoOa0AGMPN0Vk",
  authDomain: "be-fit-ede85.firebaseapp.com",
  projectId: "be-fit-ede85",
  storageBucket: "be-fit-ede85.appspot.com",
  messagingSenderId: "266874794531",
  appId: "1:266874794531:web:affd70345298c03acf7796",
  measurementId: "G-RWSD51SQKW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, storage}
