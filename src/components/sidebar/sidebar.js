import { useEffect,useState } from "react"
import { useAuth } from '../../context/use-auth';
import { getAuth, onAuthStateChanged,updateProfile} from "firebase/auth";
import './sidebar.css';
import defaultUser from "../../assets/default-user.jpg"
import {FaUserFriends} from "react-icons/fa";
import {HiUserGroup} from "react-icons/hi";
import {CiShop} from "react-icons/ci";
import {AiOutlinePlaySquare} from "react-icons/ai";
import {RxCountdownTimer} from "react-icons/rx";
import {BsBookmarkDashFill} from "react-icons/bs";
import {MdEmojiFlags} from "react-icons/md";






export default function Sidebar(){
    const [profilePic, setProfilePic] = useState(defaultUser)
    const [name, setName] = useState('')
    const auth = getAuth();
    const authHook = useAuth();

   
    useEffect(() => {
        console.log('side bar');
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                    console.log(user);
                    setName(user.displayName);
                    setProfilePic(user.photoURL);
               
                
            } else {
                // User is signed out
                // ...
            }
            });
        
       
    },[]);
    return(
        <div class = "sidebar-main-container">
            <div style = {{display:"flex", alignItems:"center"}}>
                
                <img src = {profilePic} alt = "profile" class = "profilePic" id = "profilePicSideBar"
                style = {{
                    height: "auto",
                    maxWidth: "2em"
                }}/>
                <span>{name}</span>
                
                
            </div>

            <div style = {{display:"flex", alignItems:"center"}}>
                <FaUserFriends style = {{fontSize: '2em'}}/>
                <span>Friends</span>
            </div>

            <div style = {{display:"flex", alignItems:"center"}}>
                <HiUserGroup style = {{fontSize: '2em'}}/>
                <span>Groups</span>
            </div>

            <div style = {{display:"flex", alignItems:"center"}}>
                <CiShop style = {{fontSize: '2em'}}/>
                <span>Marketplace</span>
            </div>

            <div style = {{display:"flex", alignItems:"center"}}>
                <AiOutlinePlaySquare style = {{fontSize: '2em'}}/>
                <span>Watch</span>
            </div>

            <div style = {{display:"flex", alignItems:"center"}}>
                <RxCountdownTimer style = {{fontSize: '2em'}}/>
                <span>Memories</span>
            </div>

            <div style = {{display:"flex", alignItems:"center"}}>
                <BsBookmarkDashFill style = {{fontSize: '2em'}}/>
                <span>Saved</span>
            </div>

            <div style = {{display:"flex", alignItems:"center"}}>
                <MdEmojiFlags style = {{fontSize: '2em'}}/>
                <span>Pages</span>
            </div>

            <hr class="my-12"/>

        </div>

    )
}