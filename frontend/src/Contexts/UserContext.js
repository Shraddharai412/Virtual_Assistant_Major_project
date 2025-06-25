import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';


export const userdataContext = createContext();

function UserContext({ children }) {
  const serverUrl = 'http://localhost:8000';

  const [userData, setUserdata] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

     const[frontendImage,setFrontendImage]=useState(null)
     const[backendImage,setbackendImage]=useState(null)
     const[SelectedImage,SetselectedImage]=useState(null)

  const handleCurrentUser = async () => {
    try {
      const results = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserdata(results.data);
      console.log('Logged in user:', results.data);
    } catch (error) {
      console.log('No user logged in or error:', error);
      setUserdata(null); 
    } finally {
      setLoadingUser(false);
    }
  };

  const getGeminiResponse= async (command)=>{

    try {
      
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
      return result.data
    } catch (error) {

      console.log(error)

      
    }

  }

  useEffect(() => {
    handleCurrentUser();
  }, []);

  // Context value shared across app
  const value = {
    serverUrl,
    userData,
    setUserdata,
    loadingUser,
    backendImage,setbackendImage,
    frontendImage,setFrontendImage,
    SelectedImage,SetselectedImage,
    getGeminiResponse

  };

  return (
    <userdataContext.Provider value={value}>
      {loadingUser ? (
        <div className="w-full h-screen flex justify-center items-center text-white text-xl">
          Loading...
        </div>
      ) : (
        children
      )}
    </userdataContext.Provider>
  );
}

export default UserContext;
