// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {

  apiKey: "AIzaSyAR1OlGOezzCYZWol73O00qUMk8vXZvu6A",

  authDomain: "facebook-clone-d5fbd.firebaseapp.com",

  projectId: "facebook-clone-d5fbd",

  storageBucket: "facebook-clone-d5fbd.appspot.com",

  messagingSenderId: "198092444614",

  appId: "1:198092444614:web:08c98eceed73a78425d8c7",

  measurementId: "G-68LVJEPPGB"

};


// Initialize Firebase


const app = initializeApp(firebaseConfig);



//connects to database in firebase to the app
//export db so it can be accessed from another files
export const db = getFirestore(app);
export const authConfig = getAuth(app);
export const storage = getStorage(app);

