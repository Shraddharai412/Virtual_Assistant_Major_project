import React, { useContext, useState } from 'react'
import Card from '../Components/Card'
import img1 from '../assests/1Authbg1.jpg'
import img2 from '../assests/2image.png'
import img3 from '../assests/3img.jpg'
import img4 from '../assests/4img.jpg'
import img5 from '../assests/5img.jpg'
import img6 from '../assests/6img.jpg'
import img7 from '../assests/7img.jpg'
import img8 from '../assests/authBg.png'
import img9 from '../assests/image6.jpeg'
import img10 from '../assests/image7.jpeg'
import { RiImageAddLine } from "react-icons/ri";
import { useRef } from 'react'
import { userdataContext } from '../Contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";
function Customize() {
  const {serverUrl,
    userData,
    setUserdata,
    loadingUser,
    backendImage,setbackendImage,
    frontendImage,setFrontendImage,SelectedImage,SetselectedImage}=useContext(userdataContext)

    const navigate=useNavigate()

  
  const inputImage=useRef();
  const handleImage =(e)=>{
    const file=e.target.files[0]
    setbackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#030353] flex justify-center items-center flex-col p-[20px] '>
       <MdKeyboardBackspace className='absolute top-[30px] cursor-pointer left-[30px] text-white w-[25px] h-[25] ' onClick={()=>navigate("/")}/>
       <h1 className='text-white mb-[30px] text-[30px] text-center '>Select Your<span> Assistant</span> </h1>
       <div className='w-[900px] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px]'>
         <Card image={img1}/>
         <Card image={img2}/>
         {/* <Card image={img3}/> */}
         <Card image={img4}/>
         {/* <Card image={img5}/> */}
         <Card image={img6}/>
         <Card image={img7}/>
         <Card image={img8}/>
         {/* <Card image={img9}/> */}
         <Card image={img10}/>
         <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950  cursor-pointer hover:border-4 hover:border-white flex items-center justify-center  ${SelectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950":null}`} onClick={()=>{inputImage.current.click()
          SetselectedImage("input")
         }}>
      {!frontendImage && <RiImageAddLine className='text-white w[25px] h-[25px]'/>}
      {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
    </div>
     <input type='file' accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
         </div>
         {SelectedImage &&  <button className="min-w-[150px] h-[60px] mt-4 bg-white text-black font-semibold rounded-full text-lg cursor-pointer" onClick={()=>navigate("/customize2")}> Next</button> }
         
     

    </div>
  )
}

export default Customize