import React, { useState,  useContext, createContext } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {authConfig} from '../firebase-config.js'
import { getAuth, updateProfile,signInWithEmailAndPassword } from "firebase/auth";
import { 
  getStorage, 
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list, } from "firebase/storage";
import { getAnalytics, setUserProperties } from "firebase/analytics";
import { collection, addDoc, doc, setDoc, getDoc,updateDoc,serverTimestamp, query, where, getDocs} from "firebase/firestore"; 
import { db } from "../firebase-config";






  firebase.initializeApp( {

  apiKey: "AIzaSyAR1OlGOezzCYZWol73O00qUMk8vXZvu6A",

  authDomain: "facebook-clone-d5fbd.firebaseapp.com",

  projectId: "facebook-clone-d5fbd",

  storageBucket: "facebook-clone-d5fbd.appspot.com",

  messagingSenderId: "198092444614",

  appId: "1:198092444614:web:08c98eceed73a78425d8c7",

  measurementId: "G-68LVJEPPGB"

});







const authContext = createContext();
 // Hook for child components to get the auth object ...
  // ... and re-render when it changes.
export const useAuth = () => {
    return useContext(authContext);
};

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
  }


function useProvideAuth (){
    const [user, setUser] = useState(null);
    const storage = getStorage();
    const [errorList, setErrorList] = useState({
      email:'',
      password:'',
    
    });
  
   const authChange = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("state = definitely signed in")
        console.log(user);
        setUser(user);
      }
      else {
        console.log("state = definitely signed out")
      }
    })
    const updateProfileFunc = (firstName, lastName) =>{
      console.log('update profile')
      
      const auth = getAuth();
      updateProfile(auth.currentUser, {
        displayName: "Jane Q. User", photoURL: "https://example.com/jane-q-user/profile.jpg"
      }).then(() => {
        // Profile updated!
        console.log(auth.currentUser);
       
        // ...
      }).catch((error) => {
        // An error occurred
        
        // ...
      });
    };
    

    const signin = (email, password) => {
      const auth = getAuth();
      console.log(auth);

         return firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((response) => {
            console.log(response);
            setUser(response.user);

           /* const  q = query(collection(db, "users"), where("uid", "!=",  auth.currentUser.uid));
            console.log("query");
            console.log(q);
            let friendSuggestionsArray = [];
            const querySnapshot = getDocs(q)
            .then( (data) => {
              //console.log(data);
              data.forEach((document) => {
                  friendSuggestionsArray.push(document.data().uid);
              
              });

              updateDoc(doc(db, "users", auth.currentUser.uid), {
                suggestions: friendSuggestionsArray
              });
          });*/
       
            return response.user;
          })
          .catch((error) => {
            console.log(email);
            console.log(password);
            console.log("error is " + error.message);
          });


      };
    
      const signup = (email, password, firstName, lastName,gender,month,day,year) => {
        const auth = getAuth();
       //const auth = authConfig;
        return firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((response) => {
            console.log("signed up")
            
            getDownloadURL(ref(storage, 'default-user.jpg'))
            .then((url) => {
              console.log('url new');
              console.log(url);
              updateProfile(auth.currentUser, {
                displayName: firstName + ' ' + lastName, 
                photoURL:"https://firebasestorage.googleapis.com/v0/b/facebook-clone-d5fbd.appspot.com/o/default-user.jpg?alt=media&token=44779710-7e76-4753-af8a-428611ba6519"
                
              })
            })
            
            setUser(response.user);
            console.log(response.user);
            

            console.log('ADDING TO DATABASE')
            const id = Math.floor(Math.random() * 100)
            const  q = query(collection(db, "users"), where("uid", "!=",  auth.currentUser.uid));
            console.log("query");
            console.log(q);
            let friendSuggestionsArray = [];
            const querySnapshot = getDocs(q)
            .then( (data) => {
              //console.log(data);
              data.forEach((document) => {
                  friendSuggestionsArray.push(document.data().uid);
              
              });

              setDoc(doc(db, "users", auth.currentUser.uid), {
                name: firstName + ' ' + lastName,
                gender: gender,
                friends: [],
                contacts: [],
                suggestions: friendSuggestionsArray,
                birthday: month + '/' + day + '/' + year,
                profilePicUrl: "https://firebasestorage.googleapis.com/v0/b/facebook-clone-d5fbd.appspot.com/o/default-user.jpg?alt=media&token=44779710-7e76-4753-af8a-428611ba6519",
                numPost: 0,
                uid: auth.currentUser.uid
              });
          });
            

            return response.user;
          })
          .catch((error) => {
            console.log(error.code);
            console.log(error.message.includes('email'));
            console.log(error.message)

            if(error.message.includes('email')){
              setErrorList({
                email:error.message,
                password:'',
              })
              console.log(errorList);
            }
            else if(error.message.includes('password')){
              setErrorList({
                email:'',
                password:error.message,
              })
            }
            else{
              setErrorList({
                email:'',
                password:'',
              })

            }
            
            



            
          }
          
         );
          
           
      };
    
      const signout = () => {
        return firebase
          .auth()
          .signOut()
          .then(() => {
            setUser(false);
          });
      };
    
      const sendPasswordResetEmail = (email) => {
        return firebase
          .auth()
          .sendPasswordResetEmail(email)
          .then(() => {
            return true;
          });
      };
    
      const confirmPasswordReset = (code, password) => {
        return firebase
          .auth()
          .confirmPasswordReset(code, password)
          .then(() => {
            return true;
          });
      };

     
         
      return {
        user,
        firebase,
        errorList,
        updateProfileFunc,
        authChange,
        signin,
        signup,
        signout,
        sendPasswordResetEmail,
        confirmPasswordReset,
        
      };

      

}
  
 

 