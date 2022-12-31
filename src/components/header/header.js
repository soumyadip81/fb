import { useEffect, useContext } from "react"
import './header.css';
import { MdHome,MdApps,MdFacebook } from "react-icons/md";
import { FiPlayCircle, FiFlag, FiMessageCircle } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import { GrAppsRounded } from "react-icons/gr";
import { FaBell } from "react-icons/fa";
import { AiOutlineMessage,AiOutlineSearch } from "react-icons/ai";
import {FaUserFriends} from "react-icons/fa";
import {AiOutlinePlaySquare} from "react-icons/ai";
import {CiShop} from "react-icons/ci";
import {HiUserGroup} from "react-icons/hi";
import defaultUser from "/Users/soumyadip/Desktop/react/facebook-clone/my-app/src/assets/default-user.jpg";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged,updateProfile} from "firebase/auth";

import {UserContext} from "../../context/show-profile-modal";






export default function Header(){
    const navigate = useNavigate();
    const auth = getAuth();
    const setProfileBool = useContext(UserContext);
    const showProfile = setProfileBool[0];
    const setProfile =  setProfileBool[1];

    const changeProfileVisiblity = () => { 
        setProfile(!showProfile);
        console.log(showProfile);
        
    }
    useEffect(() => {
        console.log('context status');
        console.log(setProfileBool);
        
       
    },[]);
    return(
        <div class = "header-main-container">
            <div class = "left-searchbar">
                <div>
                    <MdFacebook class = "icon-left"/>
                </div>

                <div class="input-group rounded searchbar w-70">
                    <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                    <span class="input-group-text border-0" id="search-addon">
                        <AiOutlineSearch/>
                    </span>
                </div>

            </div>
            
            <div class = "middle-icons">
                
                <div>
                    <MdHome class = "icon" onClick =  {() => {navigate('/feed')}}/>
                </div>

                <div>
                    <FaUserFriends class = "icon" onClick = {() => {navigate('/friends')}}/>
                </div>

                <div>
                    <AiOutlinePlaySquare class = "icon"/>
                </div>

                <div>
                    <CiShop class = "icon"/>
                </div>

                <div>
                    <HiUserGroup class = "icon"/>
                </div>
            
            </div>

            <div class = "right-icons">
                <div class = "round">
                    <MdApps class = "round-icon"/>
                </div>

                <div class = "round">
                    <FiMessageCircle class = "round-icon"/>
                </div>

                <div class = "round">
                    <FaBell class = "round-icon"/>
                </div>

                <div class = "profile" onClick = {changeProfileVisiblity }>
                    <img src = {defaultUser} alt ="profile" id = "profilePic" class = "profilePic"/>
                </div>

            </div>

            
               


                
                

               




               

            
            


       

        </div>

    )
}