import './Friend.css';
import { useEffect,useState } from "react"
import {AiOutlineLike} from "react-icons/ai";
import {TbMoodHappy} from "react-icons/tb";
import {BiComment} from "react-icons/bi";
import {RiShareForwardLine} from "react-icons/ri";

import{UserContext} from  "../context/show-profile-modal"
import { useAuth } from "../context/use-auth.js";
import { getAuth, onAuthStateChanged,updateProfile} from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc,updateDoc,serverTimestamp, query, where, getDocs} from "firebase/firestore"; 
import { db } from "../firebase-config";

import Sidebar from "../components/sidebar/sidebar";
import Header from "../components/header/header";
import FriendCard from "../components/friendCard/friendCard";



export default function Friend(props){
    const [userId, setUserId]= useState('')
    const [suggestions,setSuggestions] = useState([]);
    const [friends,setFriends] = useState([]);
    const q = query(collection(db, "users"), where("capital", "==", true));

    const [show, setShow] = useState(false);
    const auth = getAuth();

    const loadFriendSuggestions = async(uid) => {
        console.log('inside loadFriendSuggestions function ')
        let friendSuggestionsArray = [];
        let friendsListArray = [];

        const docRef = doc(db, "users", uid);
        const snap = getDoc(docRef)
        .then((docSnap) => {

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                //setSuggestions(docSnap.data().suggestions)
                docSnap.data().suggestions.forEach((suggestionsId) => {
                   // console.log(suggestionsId)
                    const suggestedUserRef = doc(db, "users", suggestionsId);
                    getDoc(suggestedUserRef)
                    .then((suggestedSnap) => {
                        friendSuggestionsArray.push({
                            name: suggestedSnap.data().name,
                            profilePic:　suggestedSnap.data().profilePicUrl,
                            friendId: suggestedSnap.data().uid
                        });
                       
                    if(friendSuggestionsArray.length === docSnap.data().suggestions.length){
                        setSuggestions(friendSuggestionsArray);

                   }
                    })
                    
                    
                })
                docSnap.data().friends.forEach((friendId) => {
                   
                    console.log('inside friends array')
                    const friendRef = doc(db, "users", friendId);
                   const friendSnap =  getDoc(friendRef)
                    .then((friendSnap)=>{
                        console.log(friendSnap.data().name);
                        friendsListArray.push({
                            name: friendSnap.data().name,
                            profilePic: friendSnap.data().profilePicUrl,
                            friendId: friendSnap.data().uid
                           })
                           console.log(friendsListArray);
                           if(friendsListArray.length === docSnap.data().friends.length){
                                setFriends(friendsListArray);
                                console.log('friends array')
                                console.log(friendsListArray)
                           }
                        
                        

                        
                    });
                  });
                 
                
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
                
                let q;
                q = query(collection(db, "users"), where("uid", "!=", uid));
        });
        
        

        

    }
    
   
   
    useEffect(() => {
        console.log('in friends')
        if(userId === ''){
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                   setUserId(user.uid);
                   console.log(user.uid);
                   loadFriendSuggestions(user.uid);
                   
           
                   
    
                   
                    
                }
            });
    
        }
    
        

       
        
        
       
    },[]);
    return(
        <div class = "entirepage">
            <UserContext.Provider value={[show,setShow]}>
                <Header/>
            </UserContext.Provider>
            <div class = "feed-content">
                <div class = 'feed-left'>
                            <Sidebar/>
                </div> 
                
                <div class = 'friend-requests'>
                    Friend Requests
                        <div class = 'requests'>
                            {friends?.map( (doc) => 
                            (<div  class = "postDiv">
                            { <FriendCard 
                                name = {doc.name}
                                profile = {doc.profilePic}
                                type = 'friendRequests'
                                userId = {userId}
                                friendId = {doc.friendId}
                               
                                />}
                                </div> ))}

                        </div>
                    Friend Suggestions
                  
                        <div class = 'requests'>
                            {suggestions?.map( (doc) => 
                            (<div  class = "postDiv">
                            { <FriendCard 
                                name = {doc.name}
                                profile = {doc.profilePic}
                                type = 'friendSuggestions'
                                userId = {userId}
                                friendId = {doc.friendId}
                                />}
                                </div> ))}

                        </div>
                  
                    
                </div> 
            </div>

        </div>
       
      
       
            
      

       )
}