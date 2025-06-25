import React, { useContext, useState, useEffect } from 'react';
import bg from "../assests/image2.jpg"
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { userdataContext } from '../Contexts/UserContext';
import axios from 'axios';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { serverUrl, userData, setUserdata, loadingUser } = useContext(userdataContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!loadingUser && userData) {
      navigate('/');
    }
  }, [loadingUser, userData, navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      setUserdata(result.data);
      navigate('/');
    } catch (error) {
      console.log(error);
      setUserdata(null);
      setError(error?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="w-full h-screen bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] max-w-[600px] h-[700px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col justify-center items-center gap-5 px-4"
        onSubmit={handleSignIn}
      >
        <h1 className="text-white text-3xl font-semibold mb-6">
          Sign In to <span className="text-white/70">Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder="Enter your Email"
          className="w-[90%] h-[60px] px-5 text-white border-2 border-white bg-transparent placeholder-gray-300 rounded-full text-lg outline-none"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <div className="w-[90%] h-[60px] relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your Password"
            className="w-full h-full px-5 text-white border-2 border-white bg-transparent placeholder-gray-300 rounded-full text-lg outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          {showPassword ? (
            <IoEyeOff
              className="absolute top-4 right-5 w-6 h-6 text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute top-4 right-5 w-6 h-6 text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {error && <p className="text-red-500 text-sm mt-2">* {error}</p>}

        <button
          className="min-w-[150px] h-[60px] mt-4 bg-white text-black font-semibold rounded-full text-lg"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>

        <p
          className="text-white text-base mt-4 cursor-pointer"
          onClick={() => navigate('/signup')}
        >
          New user? <span className="text-blue-400">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
