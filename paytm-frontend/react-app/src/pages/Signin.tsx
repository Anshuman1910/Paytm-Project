import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin(){
    const[username,setUsername] = useState("")
    const[password,setPassword] = useState("")
    const navigate = useNavigate()

    return(
        <div className="bg-slate-300 h-screen flex justify-center items-center ">
            <div className="flex flex-col justify-center bg-white rounded-lg  items-center ">
            <div className=" w-80 rounded-lg bg-white text-black px-4 text-center">
                <Heading label="Sign in"/>
                <SubHeading label={"Enter your credentials to access your account"}/>
                <InputBox label={"Username"} placeholder={"Enter your username"} value={username} onChange={(e)=>setUsername(()=>e.target.value)}/>
                <InputBox label={"Password"} placeholder={"Enter your password"} value={password} onChange={(e)=>setPassword(()=>e.target.value)}/>
                <div className="pt-4">
                    <Button buttonText={"Sign in"} onClick={async()=>{
                        const response =await axios.post("http://localhost:3000/api/v1/user/login",{
                            username,
                            password,
                        })
                        localStorage.setItem("token",response.data.token)
                        navigate("/dashboard")
                    }}/>
                </div>
                <div className="pt-2">
                    <BottomWarning label={"Don't have an account?"} to={"/signup"} buttonText={"Sign up"}/>
                </div>
            </div> 
            </div>
        </div>
    )
}