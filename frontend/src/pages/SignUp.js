import React, { useContext, useState } from 'react'
import bg from "../assests/image2.jpg"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userdataContext } from '../Contexts/UserContext';
import axios from "axios"



function SignUp() {

  const [showPassword,setshowPassword]=useState(false)

  const {serverUrl,userData,setUserdata}=useContext(userdataContext)
  const navigate=useNavigate()
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState("")
   const [loading ,setLoading]=useState(false)
  const handleSignUp=async (e)=>{
    e.preventDefault()
    setError("")
    setLoading(true)
     try{
    let result =await axios.post(`${serverUrl}/api/auth/signup`,{name,email,password},{withCredentials:true})
    setUserdata(result.data)
        setLoading(false)
        navigate("/customize")
  }
    catch(error)
    {
      console.log(error);
      setUserdata(null)
      setLoading(false)
      setError(error.response.data.message)
      

    }

  }


  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>

      <form className='w-[90%] h-[700px] max-w-[600px] bg-[#00000062] backdrop-blur  shadow -lg shadow-black flex  flex-col justify-center items-center gap-[20px] ' onSubmit={handleSignUp}>
         <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
          Register To <span className='text-white-400'>Virtual Assistant </span>
         </h1>
         <input type='text' placeholder='Enter your Name' className='w-[90%] h-[60px] px-[20px] py -[10px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-full text-[18px]' onChange={(e)=>setName(e.target.value)} value={name}/>
          <input type='text' placeholder='Enter your Email' className='w-[90%] h-[60px] px-[20px] py -[10px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-full text-[18px]' onChange={(e)=>setEmail(e.target.value)} value={email} />

          <div className='w-[90%] h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
            <input type={showPassword?"text":"password"} placeholder='Enter your Password' className='w-full h-full px-[20px] py -[10px] outline-none border-2 bg-transparent placeholder-gray-300 rounded-full '  onChange={(e)=>setPassword(e.target.value)} value={password}/>
            {!showPassword &&  <IoEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setshowPassword(true)}/>}
              {showPassword &&  <IoEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setshowPassword(false)}/>
}
          </div>
              {error.length>0 && <p className='text-red-500 text-[17px]'>*{error}</p>}
          <button className='min-w-[150px] h-[60px]  mt-[30px] text-black font-semibold bg-white  rounded-full text-[19px]' disabled={loading}>
               { loading?"Loading ...":"SignUp"}
          </button>

          <p className='text-[white] text-[18px] cursor-pointer ' onClick={()=>{
            navigate("/signin")
          }}>Already have an account ?  <span className='text-blue-400 text-[18px] cursor-pointer'> SignIn</span></p>
      </form>



    </div>
  )
}

export default SignUp