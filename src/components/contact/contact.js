import { useContext, useEffect, useState } from "react"
import './contact.css';
import { useNavigate } from "react-router-dom";
import defaultUser from "../../assets/default-user.jpg"
import{ImageContext} from  "../../context/image-context"
import {UserContext} from "../../context/show-profile-modal";
import {GiExitDoor} from "react-icons/gi";
import { useAuth } from "../../context/use-auth.js";

import { getAuth, onAuthStateChanged,updateProfile} from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc,updateDoc,serverTimestamp, query, where, getDocs} from "firebase/firestore"; 
import { db } from "../../firebase-config";



export default function Contact(props){
   
    const imageValues = useContext(ImageContext);
    const imageUrl = imageValues[0];
    const setImageUpload = imageValues[3];
    const uploadFile = imageValues[4];
    const show = imageValues[5];
    const setShow = imageValues[6];

    const authHook = useAuth();
    const auth = getAuth();
    const [contactList, setContactList] = useState([]);
    
    const navigate = useNavigate();
   
   
    useEffect(() => {
        console.log('CONTACTS')
        if(!props.userId){
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                   
                    const uid = user.uid;
                    console.log(uid);

                    const docRef = doc(db, "users", uid);
                    let contactListArray = [];
                    getDoc(docRef)
                    .then((docSnap) => {
                        docSnap.data().contacts.forEach((id) => {
                            const contactId = id;
                            console.log(id);
                            const contactRef = doc(db, "users", contactId);
                            getDoc(contactRef)
                            .then((contactVal) => {
                                contactListArray.push({
                                    profilePic: contactVal.data().profilePicUrl,
                                    name: contactVal.data().name
                                })
                                console.log(contactListArray)
                                if(contactListArray.length === docSnap.data().contacts.length){
                                    console.log('setting');
                                    setContactList(contactListArray);
                                }
                            })

                          });
                    })
                   
           
                    
    
                    //load posts and feed based on user id
                    
                } 
            });
    
        }

        
       

       
       
    },[]);
    return(
            <>
                <button onClick = {() => {setShow(!show)}}> Settings</button>
                    
                    <div class = "friends-group">
                        <p><strong> Contacts</strong></p>

                        {contactList?.map( (doc) => 
                            (<div style = {{maxHeight: '2em'}}>
                                <img src = {doc.profilePic} alt = "profile" class = "profilePic" id = "profilePicSideBar"
                                style = {{
                                    maxHeight: "2em",
                                    maxWidth: "2em"
                                }}/>
                                <span>{doc.name}</span>
    
                            </div>))}

                        
                        

                        <hr class="my-12"/>
                        <p><strong> Groups</strong></p>


                    </div>

                    {show &&
                        <div class = "profileModal">
                            <div class = "uploadPhotoSection text-center">
                                <img src = {imageUrl} alt = "profile" class = "profilePic" id = "profilePicSideBar"
                                style = {{
                                    height: "auto",
                                    maxWidth: "2em"
                                }}/>
                                <span>{props.name}</span>
                                <hr class="my-12"/>

                                <label for="inputProfile">Choose a profile picture:</label>
                                <input
                                    type="file"
                                    id = "inputProfile"
                                    name = "inputProfile"
                                    onChange={(event) => {
                                        setImageUpload(event.target.files[0]);
                                    }}
                                />

                                <button onClick={uploadFile}> Upload Image</button>
                            </div>
                        

                        <div class = "logoutSection text-center" onClick = {() => authHook.signout() && navigate('/')} >
                            <div style = {{backgroundColor: "#e9ebee", 
                            borderRadius: '50%',
                            width:'1.5em',
                            display: 'inline-block'}}>
                                <GiExitDoor style = {{fontSize: '1.5em'}}/>
                            </div>
                            <span>Log Out</span>
                        </div>
                    

                    </div>

                    } 
            </>

    )
}