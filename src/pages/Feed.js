import { useEffect, useState } from "react"
import Sidebar from "../components/sidebar/sidebar";
import Header from "../components/header/header";
import Contacts from "../components/contact/contact";
import Post from "../components/post/post";

import './Feed.css';
import { useAuth } from "../context/use-auth.js";
import { getAuth, onAuthStateChanged,updateProfile} from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc,updateDoc,serverTimestamp, query, where, getDocs} from "firebase/firestore"; 
import { db } from "../firebase-config";
import { 
    getStorage, 
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list, } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../firebase-config";
import {FcVideoCall} from "react-icons/fc";
import {FaImages} from "react-icons/fa";
import {BiHappy,BiMoviePlay} from "react-icons/bi";
import {MdAutoStories} from "react-icons/md";
import {AiOutlineVideoCameraAdd,AiOutlinePlusCircle} from "react-icons/ai";
import {GiExitDoor} from "react-icons/gi";
import { useNavigate } from "react-router-dom";

import { Button, Modal } from "react-bootstrap";

import{UserContext} from  "../context/show-profile-modal"
import{ImageContext} from  "../context/image-context"

import defaultUser from "../assets/default-user.jpg"


export default function Feed(){
   // const auth = useAuth();
    //const firstName = auth.user.displayName.split(" ")
    const [userName, setUserName] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const [postImageUpload, setPostImageUpload] = useState(null);
    const [imageUrl, setImageUrl] = useState(defaultUser);
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [postContent, setPostContent] = useState('')
   const [postList, setPostList] = useState([]);
   //let postList = ['', '']

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();

    const auth = getAuth();
    const authHook = useAuth();

    const storage = getStorage();

  


    const showPostImageUpload = () =>{
        if(document.getElementById('uploadPostPhoto').style.display === "none"){
            document.getElementById('uploadPostPhoto').style.display = "flex";
        }
        else{
            document.getElementById('uploadPostPhoto').style.display = "none";
        }
       
    }

   
   
    
    const uploadFile = () => {
        if (imageUpload == null) return;
        const uid = userName.uid;
        const imageRef = ref(storage, 'images/profilePic/' + uid);

        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            console.log(snapshot);
            alert('uploaded')
            const uid = userName.uid;
            getDownloadURL(ref(storage, 'images/profilePic/' + uid))
            .then((url) => {
                
                updateProfile(auth.currentUser, {
                    displayName: userName.displayName,
                    photoURL: url
                })

                updateDoc (doc(db, "users", uid), {
                    profilePicUrl: url,
                });

               

                const q = query(collection(db, "posts"), where("userId", "==",uid));
                getDocs(q)
                .then( (data) => {
                    data.forEach((document) => {
                           updateDoc (doc(db, "posts", document.id), {
                                useProfileUrl: url,
                            })
                        })

                });
                

                



                const img = document.getElementById('profile');
                img.setAttribute('src', url);
                document.getElementById('profilePic').setAttribute('src', url);
                document.getElementById('profilePicSideBar').setAttribute('src', url);
                setImageUrl(url);
                window.location.reload();
            })
    
            

        });
    };

    const uploadPost = async() => {
       // if (postImageUpload == null) return;
       document.getElementById('uploadPostPhoto').style.display = "none";
       setShowModal(false);
       //ADD TIME STAMP
        const uid = userName.uid;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if(postImageUpload == null){
            console.log('iamge null');
            if (docSnap.exists()) {
                const imageNumber = docSnap.data().numPost;
                console.log('update doc');
                updateDoc (doc(db, "users", uid), {
                    numPost: imageNumber + 1,
                });
                console.log('add doc');

                addDoc(collection(db, "posts"), {
                    hasimage: false,
                    userId: uid,
                    postContent: postContent,
                    timestamp: serverTimestamp(),
                    useProfileUrl: docSnap.data().profilePicUrl,
                    userName: docSnap.data().name,
                    commentsNum: 0,
                    sharesNum: 0,
                    });

                    setPostImageUpload(null);

                   // window.location.reload();
            }
        }

        else if (docSnap.exists()) {
            console.log('showing docRef');
            console.log(docSnap.data()); 
            const imageNumber = docSnap.data().numPost;
            const imageRef = ref(storage, 'post/' + uid + '/' + imageNumber);

            uploadBytes(imageRef, postImageUpload).then((snapshot) => {
                alert('uploaded')
                const uid = userName.uid;
                console.log('post content');
                console.log(postContent);
                getDownloadURL(imageRef)
                .then((url) => {
                    updateDoc (doc(db, "users", uid), {
                        numPost: imageNumber + 1,
                    });

                    addDoc(collection(db, "posts"), {
                        hasimage: true,
                        imageUrl: url,
                        userId: uid,
                        postContent: postContent,
                        timestamp: serverTimestamp(),
                        useProfileUrl: docSnap.data().profilePicUrl,
                        userName: docSnap.data().name,
                        commentsNum: 0,
                        sharesNum: 0,

                      });

                      setPostImageUpload(null);

                    // window.location.reload();
                      
                      
                })
        
                
    
            });
            
        } else {
        console.log("No such document!");
        }
     

       
       

    };

    const loadPostForFeed = async (uid) => {
        console.log('inside load post function')
       // const uid = userName.uid;
        //let uid;// = 'R4I5udnQ0dTsmZtuLmN7NxShYs73';
       

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const friendList = docSnap.data().contacts;
        let postListLocal = [];
       if(friendList.length > 0){
        console.log('more than 0 friends');
        console.log(friendList);
            let one = query(collection(db, "posts"), where("userId", 'in', friendList));
            console.log(one);
            let two = query(collection(db, "posts"),where("userId", "==",uid));
            //postListLocal = one.concat(two);
            let docDataArray = [];
            await getDocs(one)
            .then((data) => {
                console.log('post list is');
                data.forEach((doc) => {
                    docDataArray.push(doc.data())
                  });
                  //setPostList(docDataArray);
                  console.log(docDataArray);
               
            });

            await getDocs(two)
            .then((data) => {
                console.log('post list is');
                data.forEach((doc) => {
                    docDataArray.push(doc.data())
                  });
                  setPostList(docDataArray);
                  console.log(docDataArray);
               
            });

        }
        else{
            console.log('0 friends');
             postListLocal = query(collection(db, "posts"), where("userId", "==",uid));
             const postSnapshot = await getDocs(postListLocal)
                            .then((data) => {
                                console.log('post list is');
                                let docDataArray = [];
                                data.forEach((doc) => {
                                    // doc.data() is never undefined for query doc snapshots
                                    //console.log(doc.id, " => ", doc.data());
                                    //console.log(doc.data());
                                    docDataArray.push(doc.data())
                                  });
                                  setPostList(docDataArray);
                                  console.log(docDataArray);
                               
                            });

        }


        

      
      

    }

   




    if(userName === ''){
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                console.log('current status');
                if(authHook.user.displayName !== ''){
                    setUserName(authHook.user);
                    setImageUrl(authHook.user.photoURL);
                    document.getElementById('profilePic').setAttribute('src', authHook.user.photoURL);

                    //add to database
                    console.log('adding to database')
                    const id = Math.floor(Math.random() * 100)
                    await setDoc(doc(db, "cities", 'lol'), {
                        name: "Los Angeles",
                        state: "CA",
                        country: "USA"
                    });

                    loadPostForFeed(uid);

       
                }

                //load posts and feed based on user id
                
            } else {
                // User is signed out
                // ...
            }
            });

    }
    
    
    
    useEffect(() => {
       
        document.title = 'Facebook Feed';
        authHook.authChange();
        console.log('executing post load');
        if(userName !== ''){
            loadPostForFeed(userName.uid);
        }
        console.log(postList);
       
       // console.log('current status');
       
        
        
    },[]);
    return(
        <div class = "entirepage">
        <UserContext.Provider value={[show,setShow]}>
            <Header/>
        </UserContext.Provider>
        
            <div class = "feed-content"> 
                <div class = 'feed-left '>
                    <Sidebar/>
                </div>

                <div class = 'feed-middle '>
                   
                    <div class = "first-middle-section">
                        <div class="row .d-flex text-center first-line" style = {{height:"20%"}}>
                                <div class="col-sm-4">
                                    <MdAutoStories class = "iconFeed"/>
                                    <span class="text-muted"><strong>Stories</strong></span>   
                                </div>

                                <div class="col-sm-4">
                                    <BiMoviePlay class = "iconFeed"/>
                                    <span class="text-muted"><strong>Reels</strong></span>
                                </div>

                                <div class="col-sm-4">
                                    <AiOutlineVideoCameraAdd class = "iconFeed"/>
                                    <span class="text-muted"><strong>Rooms</strong></span>
                                </div>
                                
                            </div>
                            <hr class="my-12"/>
                        <div class="stories" >
                            <div>
                                <div class ="storyImage">
                                    <img src = {imageUrl} alt = "profile"/>  

                                </div>
                                <div class ="storyAdd">
                                    <AiOutlinePlusCircle style = {{fontSize: "1.5em", color: "blue", textAlign: "center"}}/>
                                    <p class = "text-center">Create story</p>
                                </div>

                            </div>
                            

                            
                           
                            

                        </div>

                    </div>
                    

                    <div class = "second-middle-section">
                        <div class="row .d-flex  first-line">
                            <div class="col-sm-1">
                                <img src = {imageUrl} alt = "profile" id = "profile" class = "profilePic"/>
                            </div>

                            <div class="col-sm-11">
                                <input type="text" 
                                onClick={() => {setShowModal(true)}}
                                class="form-control form-rounded " 
                                placeholder={"What's on your mind " + userName.displayName}
                                style={{background: "#e9ebee"}}/>
                            </div>
                            
                        </div>
                        <hr class="my-12"/>

                        <div class="row .d-flex  first-line">
                            <div class="col-sm-4">
                                <FcVideoCall class = "iconFeed"/>
                                <span class="text-muted"><strong>Live Video</strong></span>
                            </div>

                            <div class="col-sm-4">
                                <FaImages class = "iconFeed"/>
                                <span class="text-muted"><strong>Photo/Video</strong></span>
                                
                            </div>

                            <div class="col-sm-4">
                                <BiHappy class = "iconFeed"/>
                                <span class="text-muted"><strong>Feeling/Activity</strong></span>
                            </div>
                            
                        </div>


                        

                       
                        

                        


                    </div>
                       

                    
                       
                   
                    
                    {postList?.map( (doc) => 
                    (<div  class = "postDiv">
                        { <Post userName = {doc.userName} 
                        profileUrl ={doc.useProfileUrl}
                        containsImage = {doc.hasimage}
                        imageUrl ={doc.imageUrl}
                        date = {doc?.timestamp}
                        commentsNum = {doc.commentsNum}
                        sharesNum = {doc.sharesNum}
                        postContent = {doc.postContent}
                        />}
                        </div> ))}
                            
                    
                    


                    <Modal 
                        show={showModal} 
                        onHide={() => {setShowModal(false)}}
                        animation={true}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered

                        >
                            <Modal.Header closeButton>
                            <Modal.Title >Create Post</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div class="row .d-flex  first-line">
                                    <div class="col-sm-1">
                                        <img src = {imageUrl} alt = "profile" id = "profile" class = "profilePic"/>
                                    </div>

                                    <div class="col-sm-11">
                                        <p>{userName.displayName}</p>
                                    </div>
                                
                                </div>

                                <div class="row .d-flex  first-line">
                                    <div class="form-outline col-sm-12">
                                        <textarea class="form-control" 
                                        id="textAreaExample"
                                        rows="3"
                                        placeholder={"What's on your mind " + userName.displayName}
                                        onChange = {(event) => {setPostContent(event.target.value)}}
                                        style={{background: "white",
                                        border: 'none',
                                        borderCcolor: 'transparent',
                                        marginBottom: '5%'}}
                                        >

                                        </textarea>
                                        
                                    </div>

                                </div>

                               
                                    <div style = {{
                                        background: '#e9ebee',
                                        height: '6em',
                                        textAlign: 'center',
                                        display: 'none',
                                        marginBottom: '5%'
                                    }}
                                    id =  'uploadPostPhoto'
                                    >
                                        <div 
                                        style = {{flex: '100%', alignSelf: 'center'}}>
                                            <label for="file-input">
                                            <FaImages class = "iconFeed"/>
                                            </label>

                                            <input 
                                            id="file-input" 
                                            type="file" 
                                            style = {{display:'none'}}
                                            onChange={(event) => {
                                                setPostImageUpload(event.target.files[0]);
                                            }}
                                            />

                                            <p>Add Photos/Videos</p>

                                        </div>

                                    </div>
                               
                               <div style = {{
                                background: 'white',
                                height: '3em',
                                display: 'flex',
                                flexDirection: 'row',
                                textAlign: 'center',
                                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                                borderRadius: '5%',
                                marginBottom: '5%'}}>
                                        <div style ={{flex: '100%', alignSelf:'center'}}>
                                            <span style = {{paddingRight: '20%'}}> Add to your post</span>
                                            <FaImages class = "iconFeed" onClick = {showPostImageUpload}/>

                                        </div>
                               </div>

                              
                            </Modal.Body>
                            <Modal.Footer>
                            <button onClick={uploadPost} style = {{display:'block'}}> Upload Post</button>
                            </Modal.Footer>
                        </Modal>


                    
                    
                   

                    

                       
                      


                    
                </div>



               
                <div class = 'feed-right '>
                <ImageContext.Provider 
                value={[imageUrl, setImageUrl,imageUpload, setImageUpload, uploadFile, show, setShow]}>
                        <Contacts userId = {userName?.uid} name = {userName.displayName}/>
                   
                </ImageContext.Provider>
                   

                    
                </div>

            </div>
        

        </div>

    )
}