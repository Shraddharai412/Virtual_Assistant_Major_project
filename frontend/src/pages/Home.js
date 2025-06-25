import React, { useContext, useState, useEffect, useRef } from 'react';
import { userdataContext } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from '../assests/ai.gif';
import userImg from '../assests/user.gif';
import { CgMenuGridR } from 'react-icons/cg';
import { ImCross } from 'react-icons/im';

function Home() {
  const { userData, serverUrl, setUserdata, getGeminiResponse } = useContext(userdataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setuserText] = useState('');
  const [aiText, setaiText] = useState('');
  const [ham, setHam] = useState(false);

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;
  const allVoices = useRef([]);

  const isHindiTextLikely = (text) => {
    const hindiWords = ['aap', 'kaise', 'ho', 'kya', 'mein', 'nahi', 'haan', 'acha'];
    return hindiWords.some(word => text.toLowerCase().includes(word));
  };

  const transliterationMap = {
    'aap': 'आप',
    'kaise': 'कैसे',
    'ho': 'हो',
    'kya': 'क्या',
    'mein': 'मैं',
    'nahi': 'नहीं',
    'haan': 'हाँ',
    'acha': 'अच्छा'
  };

  const convertToDevanagari = (text) => {
    let result = text;
    for (const [key, value] of Object.entries(transliterationMap)) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      result = result.replace(regex, value);
    }
    return result;
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserdata(null);
      navigate('/signin');
    } catch (error) {
      setUserdata(null);
      console.log(error);
    }
  };

  const speak = (text) => {
    const cleanedText = text.replace(/\n/g, '. ');
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setaiText('');
      setTimeout(() => startRecognition(), 800);
    };

    const voices = allVoices.current;
    const googleHindi = voices.find(v => v.name.includes('Google हिन्दी'));
    const hindiVoice = googleHindi || voices.find(v => v.lang === 'hi-IN');
    const englishVoice = voices.find(v => v.lang === 'en-US');

    if (/^[\u0900-\u097F]/.test(cleanedText) && hindiVoice) {
      utterance.voice = hindiVoice;
    } else if (englishVoice) {
      utterance.voice = englishVoice;
    }

    synth.cancel();
    synth.speak(utterance);
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch (error) {
        if (!error.message.includes('start')) {
          console.error('Recognition error:', error);
        }
      }
    }
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    console.log("Gemini Response:", response);

    let spokenText = response;

    // Fallback if Gemini only gives joke intro
    if (response.toLowerCase().includes("here's") && response.length < 30) {
      spokenText = "Why don’t scientists trust atoms? Because they make up everything!";
    } else if (response.toLowerCase().startsWith("here's a joke")) {
      const parts = response.split('\n').slice(1);
      spokenText = parts.length ? parts.join(' ') : spokenText;
    }

    if (isHindiTextLikely(spokenText)) {
      speak(convertToDevanagari(spokenText));
    } else {
      speak(spokenText);
    }

    if (type === 'google-search') {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'youtube-search' || type === 'youtube-play') {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank');
    }
    if (type === 'calculator-open') {
      window.open('https://www.google.com/search?q=calculator', '_blank');
    }
    if (type === 'instagram-open') {
      window.open('https://www.instagram.com/', '_blank');
    }
    if (type === 'facebook-open') {
      window.open('https://www.facebook.com/', '_blank');
    }
    if (type === 'weather-show') {
      window.open(`https://www.google.com/search?q=weather+${encodeURIComponent(userInput)}`, '_blank');
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = synth.getVoices();
      allVoices.current = voices;
    };

    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;
    let restartInterval;

    const greet = () => {
      const utterance = new SpeechSynthesisUtterance(`नमस्ते ${userData.name}, मैं आपकी किस प्रकार मदद कर सकता हूँ?`);
      utterance.lang = 'hi-IN';

      const voices = allVoices.current;
      const googleHindi = voices.find(v => v.name.includes('Google हिन्दी'));
      const hindiVoice = googleHindi || voices.find(v => v.lang === 'hi-IN');
      if (hindiVoice) utterance.voice = hindiVoice;

      synth.cancel();
      synth.speak(utterance);
    };

    greet();
    setTimeout(() => startRecognition(), 1500);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current && isMounted) setTimeout(() => startRecognition(), 1000);
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current && isMounted) setTimeout(() => startRecognition(), 1000);
    };

   recognition.onresult = async (e) => {
  const transcript = e.results[e.results.length - 1][0].transcript.trim();
  console.log('User said:', transcript);  
  const assistantName = userData?.assistantName?.toLowerCase();
  if (assistantName && transcript.toLowerCase().includes(assistantName)) {
    setaiText('');
    setuserText(transcript);
    recognition.stop();
    isRecognizingRef.current = false;
    setListening(false);
    try {
      let finalQuery = transcript;

      if (transcript.toLowerCase().includes('joke')) {
        finalQuery = transcript + '. Tell me a complete joke including punchline.';
      }

      const data = await getGeminiResponse(finalQuery);
      if (data) {
        console.log(' Assistant responded with:', data.response); 
        handleCommand(data);
        setaiText(data.response);
        setuserText('');
      }
    } catch (err) {
      console.error('Error in Gemini response:', err);
    }
  }
};


    restartInterval = setInterval(() => {
      if (!isRecognizingRef.current && !isSpeakingRef.current && isMounted) {
        startRecognition();
      }
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(restartInterval);
      recognition.stop();
      setListening(false);
    };
  }, []);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023a] flex justify-center items-center flex-col gap-4 overflow-hidden'>
      <CgMenuGridR className='lg:hidden text-white absolute top-5 right-5 w-6 h-6' onClick={() => setHam(true)} />
      <div className={`absolute lg:hidden top-0 w-full h-full bg-black/20 backdrop-blur-lg p-5 flex flex-col gap-5 items-start transition-transform ${ham ? 'translate-x-0' : 'translate-x-full'}`}>
        <ImCross className='text-white absolute top-5 right-5 w-6 h-6' onClick={() => setHam(false)} />
        <button onClick={handleLogout} className='bg-white text-black font-semibold rounded-full px-6 py-3'>Logout</button>
        <button onClick={() => navigate('/customize')} className='bg-white text-black font-semibold rounded-full px-6 py-3 mt-3'>Customize Assistant</button>
        <h1 className='text-white font-semibold text-lg mt-3'>History</h1>
        <div className='w-full h-[60%] overflow-auto mt-2 flex flex-col space-y-2 px-1'>
          {userData.history?.map((his, i) => (
            <div key={i} className='text-gray-200 text-base break-words'>{his}</div>
          ))}
        </div>
      </div>

      <div className='hidden lg:flex gap-5 absolute top-5 right-5'>
        <button onClick={handleLogout} className='bg-white text-black font-semibold rounded-full px-6 py-3'>Logout</button>
        <button onClick={() => navigate('/customize')} className='bg-white text-black font-semibold rounded-full px-6 py-3'>Customize Assistant</button>
      </div>

      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg'>
        <img src={userData?.assistantImage} alt='Assistant' className='h-full object-cover' />
      </div>

      <h1 className='text-white text-xl font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt='' className='w-[200px]' />}
      {aiText && <img src={aiImg} alt='' className='w-[200px]' />}
      <h1 className='text-white text-lg font-semibold text-center px-4'>{userText || aiText}</h1>
    </div>
  );
}

export default Home;
