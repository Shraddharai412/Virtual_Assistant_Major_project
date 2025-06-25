import React, { useContext } from 'react';
import { userdataContext } from '../Contexts/UserContext';

function Card({ image }) {

    const {serverUrl,
      userData,
      setUserdata,
      loadingUser,
      backendImage,setbackendImage,
      frontendImage,setFrontendImage,SelectedImage,SetselectedImage}=useContext(userdataContext)
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950  cursor-pointer hover:border-4 hover:border-white ${SelectedImage==image?"border-4 border-white shadow-2xl shadow-blue-950":null}` } onClick={()=>{
      SetselectedImage(image)
      setFrontendImage(null)
      setbackendImage(null)}}>
      <img
        src={image}
        alt="assistant"
        className="w-full h-full object-cover"

      />
    </div>
  );
}

export default Card;
