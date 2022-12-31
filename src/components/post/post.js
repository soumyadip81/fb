import './post.css';
import { useEffect,useState } from "react"
import {AiOutlineLike} from "react-icons/ai";
import {TbMoodHappy} from "react-icons/tb";
import {BiComment} from "react-icons/bi";
import {RiShareForwardLine} from "react-icons/ri";

export default function Sidebar(props){
    const [date,setDate] = useState('');
   
    useEffect(() => {
        console.log(props.containsImage);
        console.log(props.postContent);
       // console.log(props.imageUrl);

        
       
    },[]);
    return(
       <>
       <div class="row .d-flex  first-line">
            <div class="col-sm-1">
                <img src = {props.profileUrl} alt = "profile" 
                style = {{ width: '2em',objectFit: 'cover', 
                objectPosition: '100% 0', borderRadius: '50%', 
                position: 'relative', top: '13%'}}/>
            </div>

            <div class="col-sm-11" style = {{display: "flex", flexDirection: 'column', gap: '0'}}>
                <span><strong>{props.userName}</strong></span>
                <span> <small>{  props?.date?.toDate()?.getMonth() + '/' + props?.date?.toDate()?.getDate() + '/' + props?.date?.toDate()?.getFullYear()}</small></span>
            </div>
                                
        </div>

        <div class="row .d-flex  first-line">
            <div class="col-sm-12">
                <p>{props.postContent}</p>
            </div>       
        </div>




        {props.containsImage &&
            <div style = {{textAlign: 'center'}}>
                <img src = {props.imageUrl} alt = "profile" 
                    style = {{ width: '20em',objectFit: 'cover', 
                    objectPosition: '100% 0'}}/>

            </div>
            }
            
       
        

        <div class="row .d-flex  first-line" 
        style = {{ display: 'flex', alignItems: 'center'}}>
            <div class="col-sm-3">
                    <AiOutlineLike style = {{fontSize: '1.5em', borderRadius: '50%'}}/>
                    <TbMoodHappy style = {{fontSize: '1.5em', borderRadius: '50%'}}/>
            </div> 

            <div class="col-sm-9" style={{textAlign: 'right'}}>
                <span class ="text-muted">{props.commentsNum + ' '} comments {props.sharesNum + ' '} shares</span>
            </div>
        </div>
            
        <div class="row .d-flex  first-line" 
        style = {{paddingTop: '0', textAlign: 'center'}}>
            <hr class="my-12"/>     
            <div class="col-sm-4">
                <AiOutlineLike style = {{fontSize: '1.5em', borderRadius: '50%'}}/>
               <span class = 'text-muted'>Like</span>
            </div>
            <div class="col-sm-4">
                <BiComment style = {{fontSize: '1.5em', borderRadius: '50%'}}/>
                <span class = 'text-muted'>Comment</span>
            </div>
            <div class="col-sm-4">
                <RiShareForwardLine style = {{fontSize: '1.5em', borderRadius: '50%'}}/>
                <span class = 'text-muted'>Share</span>  
            </div>
            <hr class="my-12"/>    
        </div>

        <div class="row .d-flex  first-line" style = {{paddingTop: '0', textAlign: 'center'}}>
            <div class="col-sm-1">
                <img src = {props.profileUrl} alt = "profile" 
                    style = {{ width: '2em',objectFit: 'cover', 
                    objectPosition: '100% 0', borderRadius: '50%', 
                    position: 'relative', top: '13%'}}/>
            </div>

            <div class="col-sm-11">
                <input type="text" 
                class="form-control form-rounded " 
                placeholder={"Write a comment..."}
                style={{background: "#e9ebee"}}/>
            </div>
            
        </div>

      
       </>

       )
}