import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userdataContext } from '../Contexts/UserContext';
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";

function Customize2() {
  const {
    userdata,
    backendImage,
    SelectedImage,
    serverUrl,
    setUserdata 
  } = useContext(userdataContext);

  const navigate = useNavigate();
  const [assistantName, setAssistantname] = useState(userdata?.assistantName || '');
  const[loading,setLoading]=useState(false)

  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {
      const formData = new FormData();

      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);  
      } else {
        formData.append("imageurl", SelectedImage); 
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );

      console.log(" Assistant updated:", result.data);
        setLoading(false)
      setUserdata(result.data); 
      navigate('/');
    } catch (error) {
      setLoading(false)
      console.error("Update failed:", error);

    }
  };

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>
      <MdKeyboardBackspace className='absolute top-[30px] cursor-pointer left-[30px] text-white w-[25px] h-[25] ' onClick={()=>navigate("/customize")}/>
      <h1 className='text-white mb-[30px] text-[30px] text-center'>
        Enter Your <span>Assistant Name</span>
      </h1>

      <input
        type='text'
        placeholder='eg: Kiaro'
        className='w-[90%] max-w-[600px] h-[60px] px-[20px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-full text-[18px]'
        onChange={(e) => setAssistantname(e.target.value)}
        value={assistantName}
      />

      {assistantName && (
        <button
          className='min-w-[300px] h-[60px] mt-4 bg-white text-black font-semibold rounded-full text-lg cursor-pointer' disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {!loading?"Finally Create Your Assistant":"Loading"}
        </button>
      )}
    </div>
  );
}

export default Customize2;
