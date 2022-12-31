import { useEffect } from "react"
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import './Login.css';
import { useAuth } from "../context/use-auth.js";
import { authConfig } from "../firebase-config.js";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; 
import { db } from "../firebase-config";





export default function Login(){
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender,setGender] = useState('');
    const [day,setDay] = useState('1');
    const [month,setMonth] = useState('Jan');
    const [year,setYear] = useState('1905');
    const [errorListInternal, setErrorListInternal] = useState({
        firstName: '',
        lastName: '',
        gender: '',
    })
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateList = [];
    for(let i = 1; i <= 31; ++i ){
        dateList.push(i);
    }
    const yearList = [];
    for(let i = 1905; i <= 2022; ++i){
        yearList.push(i);
    }

    //all context devlarations
    const auth = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        document.title = 'Facebook - log in or signup';
    },[]);

   const signupValidationLogic = async () => {
         //check for gender
        const errorValues = {
            gender: '',
            firstName: '',
            lastName: '',

        }
        if(document.getElementById('male').checked === false && 
        document.getElementById('female').checked === false &&
        document.getElementById('custom').checked === false){
           errorValues.gender = 'please select an option';
        }
        else{
            errorValues.gender = ''
        }

        //check for first name
        if(firstName === ''){
           errorValues.firstName = 'First name cannot be empty';

        }
        else{
            errorValues.firstName = '';
        }

        //check lastName
        if(lastName === ''){
            errorValues.lastName = 'Last name cannot be empty';

        }
        else{
            errorValues.lastName = '';
        }

        setErrorListInternal({
            gender: errorValues.gender,
            firstName: errorValues.firstName,
            lastName: errorValues.lastName,
        })

       

       

    };

  

    

    

    

 





    return(
        <div class = "top">
        

        <div class="row .d-flex gap-0.2 justify-items-center align-items-center ">
            <div class="col-sm-7">
                <h1 class="text-primary"> <strong>facebook</strong></h1>
                <h3>Connect with friends and the world around you on facebook</h3>
            </div>

            <div class="col-sm-5">
                <div class = "form p-3 mb-2 bg-white d-flex flex-column gap-3 rounded">
                    <input class="border border-3 form-control input-lg" 
                    placeholder="Email or phone number"
                    onChange={(event) => {setEmail(event.target.value)}}/>
                    <input class="border border-3 form-control input-lg" 
                    placeholder="Password"
                    onChange={(event) => {setPassword(event.target.value)}}/>
                    <Button
                    className="btn btn-primary btn-lg"
                    onClick={() => {auth.signin(email,password) && navigate("/feed")}}
                    > 
                        Log In
                    </Button>
                    <p class="text-primary text-center">Forgot password?</p>

                    <hr class="my-12"/>

                    <Button
                    className="btn btn-success btn-lg"
                    onClick={() => {setShow(true)}}
                    > 
                        Create new account
                    </Button>


                </div>
            </div>

            <div class ="modal-content">

            <Modal show={show} 
            onHide={() => {setShow(false)}} 
            animation={false}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
                <Modal.Header closeButton>
                <Modal.Title>Sign up</Modal.Title>
                
                </Modal.Header>
                <Modal.Body >
                    <form class = "mb-4 mt-4 ms-3 me-3 d-flex flex-column gap-3 ">




                        <div class = "row novalidate" >
                            <div class="col-sm-6">
                            <input 
                            class = {(errorListInternal.firstName === '')
                             ? "form-control border border  border-1 form-control input-lg"
                             : "form-control border border-danger border-1 form-control input-lg"}
                            placeholder="First Name"
                            onChange={(event) => {setFirstName(event.target.value)}}
                            />
                            <span class="text-danger"> <small>{errorListInternal.firstName}</small></span>
                            </div>


                            <div class="col-sm-6">
                            <input 
                            class = {(errorListInternal.lastName === '')
                            ? "border border-1 form-control input-lg"
                            : "border border-danger border-1 form-control input-lg"} 
                            placeholder="Last Name"
                            onChange={(event) => {setLastName(event.target.value)}}
                            />
                            </div>
                            <span class="text-danger"> <small>{errorListInternal.lastName}</small></span>
                        </div>
                        <div class = "row">
                            <div>
                                <input 
                                 class = {(auth.errorList.email === '')
                                 ? "border border-1 form-control input-lg"
                                 : "border border-danger border-1 form-control input-lg"}  
                                placeholder="Mobile number or email"
                                onChange={(event) => {setEmail(event.target.value)}}
                                />
                            </div>
                            <span class="text-danger"> <small>{auth.errorList.email}</small></span>
                        </div>
                        <div class = "row">
                            <div>
                                <input 
                                class = {(auth.errorList.password === '')
                                ? "border border-1 form-control input-lg"
                                : "border border-danger border-1 form-control input-lg"}  
                                placeholder="New password"
                                onChange={(event) => {setPassword(event.target.value)}}
                                />
                            </div>
                            <span class="text-danger"> <small>{auth.errorList.password}</small></span>
                        </div>

                        <div class = "row">
                        <p>Birthday</p>
                            <div class = "col-md-4">
                                <select id="month" name="months" class="form-select form-select-md mb-1" onChange={(event) => {setMonth(event.target.value)}}>
                                    {monthList.map( (entry) => { return (<option value = {entry}>{entry}</option>)})}
                                </select>
                            </div>

                            <div class = "col-md-4">
                                <select id="date" name="dates" class="form-select form-select-md mb-1"  onChange={(event) => {setDay(event.target.value)}}>
                                    {dateList.map( (entry) => { return (<option value = {entry}>{entry}</option>)})}
                                </select>
                            </div>

                            <div class = "col-md-4">
                                <select id="year" name="years" class="form-select form-select-md mb-1"  onChange={(event) => {setYear(event.target.value)}}>
                                    {yearList.map( (entry) => { return (<option value = {entry}>{entry}</option>)})}
                                </select>
                            </div>
                        </div>

                        <div class = "row">
                        <p>Gender</p>
                            <div class = "col-md-4">
                                <input type="radio" id="female" name="fav_language" value="female" onClick={(event) => {setGender(event.target.value)}}
                                />
                                <label for="female">Female</label><br></br>  
                            </div>

                            <div class = "col-md-4">
                                <input type="radio" id="male" name="fav_language" value="male" onClick={(event) => {setGender(event.target.value)}}/>
                                <label for="male">Male</label><br></br>  
                            </div>

                            <div class = "col-md-4">
                                <input type="radio" id="custom" name="fav_language" value="custom" onClick={(event) => {setGender(event.target.value)}}/>
                                <label for="custom">Custom</label><br></br>  
                            </div>
                            <span class="text-danger"> <small>{errorListInternal.gender}</small></span>
                        </div>

                        <p class = "text text-muted">
                            <small>
                            People who use our service may have uploaded your contact information to Facebook. Learn more.
                            <br></br>
                            By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS Notifications from us and can opt out any time. 
                            </small>
                    
                        </p>
                        
                            
                    </form>
                    

                    

                    
                    
                </Modal.Body>
                <Modal.Footer class = "mb-3 d-flex justify-content-center">
                
                        <Button
                        className="btn btn-success btn-md w-25"
                        onClick={() => {auth.signup(email,password,firstName,lastName,gender,month,day,year) && signupValidationLogic() && setShow(false) && navigate("/feed")}}
                        type="submit"
                        
                        > 
                            Sign up
                        </Button>
                   
                </Modal.Footer>
            </Modal>

            </div>



            
        </div>

       
    

        

        </div>

    )
}