import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup(){
    const[firstName,setFirstName] = useState("")
    const[lastName,setLastName] = useState("")
    const[username,setUsername] = useState("")
    const[password,setPassword] = useState("")
    const navigate = useNavigate()

    return(
        <div className="bg-slate-300 h-screen flex justify-center items-center ">
            <div className="flex flex-col justify-center bg-white rounded-lg  items-center ">
            <div className=" w-80 rounded-lg bg-white text-black px-4 text-center">
                <Heading label="Sign up"/>
                <SubHeading label={"Enter your information to create an account"}/>
                <InputBox label={"First Name"} placeholder={"Enter your first name"} value={firstName} onChange={(e)=>setFirstName(()=>e.target.value)}/>
                <InputBox label={"Last Name"} placeholder={"Enter your last name"} value={lastName} onChange={(e)=>setLastName(()=>e.target.value)}/>
                <InputBox label={"Username"} placeholder={"Enter your username"} value={username} onChange={(e)=>setUsername(()=>e.target.value)}/>
                <InputBox label={"Password"} placeholder={"Enter your password"} value={password} onChange={(e)=>setPassword(()=>e.target.value)}/>
                <div className="pt-4">
                    <Button buttonText={"Sign up"} onClick={async()=>{
                        await  axios.post("http://localhost:3000/api/v1/user/signup",{
                            firstName,
                            lastName,
                            username,
                            password,
                        })
                        navigate("/signin")
                    }}/>
                </div>
                <div className="pt-2">
                    <BottomWarning label={"Already have an account?"} to={"/signin"} buttonText={"Sign in"}/>
                </div>
            </div> 
            </div>
        </div>
    )
}