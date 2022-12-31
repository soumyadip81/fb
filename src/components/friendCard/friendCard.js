import './friendCard.css';
import { useEffect,useState } from "react"
import defaultUser from "../../assets/default-user.jpg"
import me from "../../assets/me.PNG"

import { useAuth } from "../../context/use-auth.js";
import { getAuth, onAuthStateChanged,updateProfile} from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc,updateDoc,serverTimestamp, query, where, getDocs, arrayUnion, arrayRemove} from "firebase/firestore"; 
import { db } from "../../firebase-config";

export default function Sidebar(props){

    
    const add = async () =>{
        console.log('adding friend')
        const userDocRef = doc(db, "users", props.userId);
        const friendUserDocRef = doc(db, "users", props.friendId);
        //if in friend requests, add should remove from the friends list and add to contact
        if(props.type === 'friendRequests'){
            //add friend id to contacts
            
            await updateDoc(userDocRef, {
                contacts: arrayUnion(props.friendId)
                
            });
            //add current user id to contacts for friend
            await updateDoc(friendUserDocRef, {
                contacts: arrayUnion(props.userId),
                suggestions: arrayRemove(props.userId)
            });

            //remove friend id from currrent friend requests list
            await updateDoc(userDocRef, {
                friends: arrayRemove(props.friendId),
                suggestions: arrayRemove(props.friendId)
            });
           


        }
        
        else if(props.type === 'friendSuggestions'){
            console.log('adding suggestion')
           //add friend id to friend requests list
            await updateDoc(userDocRef, {
                suggestions: arrayRemove(props.friendId)
            });
            await updateDoc(friendUserDocRef, {
                friends: arrayUnion(props.userId),
                suggestions: arrayRemove(props.userId)
            });
           

        }

        //delete from suggestions
        window.location.reload();

    }

    const deleteCard = async () => {
        console.log('deleting friend')
        const userDocRef = doc(db, "users", props.userId);
        const friendUserDocRef = doc(db, "users", props.friendId);
        if(props.type === 'friendRequests'){
            //delete friend Id from friend requests list
            await updateDoc(userDocRef, {
                friends: arrayRemove(props.friendId)
            });

            //add both users to no suggestins list
            await updateDoc(userDocRef, {
                suggestions: arrayRemove(props.friendId)
            });
            await updateDoc(friendUserDocRef, {
                suggestions: arrayRemove(props.userId)
            });
        }
        else if(props.type === 'friendSuggestions'){

            console.log('deleting suggestion')
            //remove friend Id from suggestions list
            await updateDoc(userDocRef, {
                suggestions: arrayRemove(props.friendId)
            });
            await updateDoc(friendUserDocRef, {
                suggestions: arrayRemove(props.userId)
            });
        }
        window.location.reload();

    }
    

    //if in suggestions list, add should remove from the suggestions list and add to friends list for the other person
    //if in suggestions list, delete should remove from sugeestions list

    if(props.type === 'friendRequests'){

    }
    else if(props.type === 'friendSuggestions'){

    }
   
   
    useEffect(() => {
        console.log(props.profile);
       /* console.log(props.name);
        console.log(props.profile);
        console.log('id is ' + props.userId);
        console.log('friend id is ' + props.friendId);*/
      
        
       
    },[]);
    return(
       <div class = "cardFriend">
            <div class = "topFriend">
                <img src = {props.profile} alt = "profile"/> 
            </div>
            <div class= "bottomFriend">
                <div class = "acceptDecline">
                    <span><strong>{props.name}</strong></span>
                    <button class="btn btn-primary" onClick = {add}>Add</button>
                    <button class="btn"  onClick = {deleteCard} style = {{backgroundColor : '#e9ebee'}}>Delete</button>

                </div>
            </div>
       </div>





       )
}