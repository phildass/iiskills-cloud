import { useState, useEffect, useRef } from 'react';
import MPA from '../lib/mpa';

export default function MPAChat() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [setupName, setSetupName] = useState('');
  const [settings, setSettings] = useState({
    userName: 'MPA',
    gender: 'neutral',
    language: 'en'
  });
  
  const chatContainerRef = useRef(null);
  const mpaRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mpaRef.current = new MPA();
      const savedUser = localStorage.getItem('mpa_registered_user');
      const savedName = localStorage.getItem('mpaUserName') || 'MPA';
      const savedGender = localStorage.getItem('mpaGender') || 'neutral';
      const savedLanguage = localStorage.getItem('mpaLanguage') || 'en';
      
      setSettings({ userName: savedName, gender: savedGender, language: savedLanguage });
      
      if (savedUser) {
        setCurrentUser(savedUser);
        mpaRef.current.setRegisteredUser(savedUser);
      } else {
        setShowSetup(true);
      }

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserMessage = () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { text: userInput, isUser: true }];
    setMessages(newMessages);

    const response = mpaRef.current.processMessage(userInput, currentUser);
    const actions = mpaRef.current.parseActionCodes(response);
    const cleanedResponse = mpaRef.current.cleanResponse(response);

    setTimeout(() => {
      setMessages(prev => [...prev, { text: cleanedResponse, isUser: false }]);
      
      actions.forEach(action => {
        if (action.type === 'SET_REMINDER') {
          setReminder(action.datetime, userInput);
          setMessages(prev => [...prev, { text: action.text, isAction: true }]);
        } else if (action.type === 'WHATSAPP_LINK') {
          setMessages(prev => [...prev, { 
            text: `WhatsApp message ready for ${action.phone}`, 
            isAction: true, 
            link: action.link 
          }]);
        } else if (action.type === 'TRANSLATE') {
          setMessages(prev => [...prev, { text: action.displayText, isAction: true }]);
        } else if (action.type === 'CALL') {
          setMessages(prev => [...prev, { text: action.text, isAction: true }]);
        } else if (action.type === 'PLAY_VIDEO') {
          const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(action.videoName + ' public domain')}`;
          setMessages(prev => [...prev, { 
            text: `Search for "${action.videoName}"`, 
            isAction: true, 
            link: searchUrl 
          }]);
        } else if (action.type === 'PLAY_SONG') {
          const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(action.songName)}`;
          setMessages(prev => [...prev, { 
            text: `Search for "${action.songName}"`, 
            isAction: true, 
            link: searchUrl 
          }]);
        }
      });
    }, 300);

    setUserInput('');
  };

  const setReminder = (datetime, task) => {
    const reminderTime = new Date(datetime);
    const now = new Date();
    const delay = reminderTime - now;
    
    if (delay > 0) {
      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('MPA Reminder', { body: task });
        } else {
          alert(`MPA Reminder: ${task}`);
        }
      }, delay);
    }
  };

  const handleSetup = () => {
    const name = setupName.trim();
    
    if (!name || name.length < 2 || name.length > 50) {
      alert('Name must be between 2 and 50 characters.');
      return;
    }
    
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      alert('Name can only contain letters, spaces, hyphens, and apostrophes.');
      return;
    }
    
    setCurrentUser(name);
    mpaRef.current.setRegisteredUser(name);
    localStorage.setItem('mpa_registered_user', name);
    setShowSetup(false);
    setMessages([{ 
      text: `Welcome, ${name}! I'm MPA, your personal assistant. How may I be of service?`, 
      isUser: false 
    }]);
  };

  const handleSaveSettings = () => {
    mpaRef.current.setUserName(settings.userName);
    mpaRef.current.setGender(settings.gender);
    mpaRef.current.setLanguage(settings.language);
    setShowSettings(false);
    setMessages(prev => [...prev, { 
      text: `Settings saved! I'm now ${settings.userName} (${settings.gender} assistant, ${settings.language} language).`, 
      isUser: false 
    }]);
  };

  const handleQuickAction = (action) => {
    if (action === 'joke') {
      setUserInput('Tell me a joke');
    } else if (action === 'quote') {
      setUserInput('Give me a quote');
    }
    setTimeout(handleUserMessage, 100);
  };

  return (
    <div className="min-h-screen mpa-gradient flex justify-center items-center p-5">
      {/* Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-10 max-w-md w-11/12 text-center">
            <h2 className="text-4xl font-bold mb-3" style={{ color: '#667eea' }}>Welcome to MPA</h2>
            <p className="text-gray-600 mb-2">Your Personal Digital Butler</p>
            <p className="text-sm text-gray-500 mb-6">Please register your name. MPA will respond only to you.</p>
            <input
              type="text"
              value={setupName}
              onChange={(e) => setSetupName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSetup()}
              placeholder="Enter your name"
              className="w-full p-4 border-2 border-gray-300 rounded-lg mb-5 outline-none focus:border-purple-600"
              autoComplete="off"
            />
            <button
              onClick={handleSetup}
              className="w-full p-4 mpa-gradient text-white rounded-lg font-bold text-lg hover:opacity-90"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-11/12">
            <h2 className="text-2xl font-bold mb-5" style={{ color: '#667eea' }}>⚙️ MPA Settings</h2>
            
            <div className="mb-5">
              <label className="block mb-2 font-semibold">Assistant Name:</label>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) => setSettings({...settings, userName: e.target.value})}
                placeholder="e.g., Nina, Alex, MPA"
                className="w-full p-3 border-2 border-gray-300 rounded-lg outline-none focus:border-purple-600"
              />
            </div>
            
            <div className="mb-5">
              <label className="block mb-2 font-semibold">Assistant Gender:</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={settings.gender === 'male'}
                    onChange={(e) => setSettings({...settings, gender: e.target.value})}
                    className="mr-2"
                  />
                  Male
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={settings.gender === 'female'}
                    onChange={(e) => setSettings({...settings, gender: e.target.value})}
                    className="mr-2"
                  />
                  Female
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="neutral"
                    checked={settings.gender === 'neutral'}
                    onChange={(e) => setSettings({...settings, gender: e.target.value})}
                    className="mr-2"
                  />
                  Neutral
                </label>
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block mb-2 font-semibold">Preferred Language:</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg outline-none focus:border-purple-600"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ml">Malayalam (മലയാളം)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="gu">Gujarati (ગુજરાતી)</option>
                <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveSettings}
                className="flex-1 p-3 mpa-gradient text-white rounded-lg font-semibold hover:opacity-90"
              >
                Save Settings
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 p-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <div className="mpa-container">
        <div className="mpa-header">
          <h1 className="text-4xl font-bold mb-2">🎩 MPA</h1>
          <p className="text-sm italic opacity-90">Your Personal Digital Butler</p>
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-5 right-5 bg-white bg-opacity-20 border-2 border-white border-opacity-40 text-white px-4 py-2 rounded-full text-xl hover:bg-opacity-30 transition-all"
          >
            ⚙️
          </button>
        </div>

        <div ref={chatContainerRef} className="mpa-chat-container">
          {messages.length === 0 && (
            <div className="text-center text-gray-600 italic p-5">
              <p>Good day! I'm <span className="font-semibold">{settings.userName}</span>, your personal assistant. How may I be of service?</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className="mpa-message">
              {msg.isAction ? (
                <div className="mpa-action-notification">
                  ✓ {msg.text}
                  {msg.link && (
                    <>
                      <br />
                      <a href={msg.link} target="_blank" rel="noopener noreferrer" className="mpa-whatsapp-link">
                        📱 Open Link
                      </a>
                    </>
                  )}
                </div>
              ) : (
                <div className={msg.isUser ? 'mpa-user-message' : 'mpa-ai-message'}>
                  {msg.text}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mpa-input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
            placeholder="Ask me anything... (e.g., 'Remind me to call the dentist tomorrow at 10 AM')"
            className="flex-1 p-4 border-2 border-gray-300 rounded-full outline-none focus:border-purple-600"
            autoComplete="off"
          />
          <button
            onClick={handleUserMessage}
            className="ml-3 px-8 py-4 mpa-gradient text-white rounded-full font-bold hover:scale-105 active:scale-95 transition-transform"
          >
            Send
          </button>
        </div>

        <div className="mpa-quick-actions">
          <button onClick={() => handleQuickAction('joke')} className="mpa-quick-btn">
            Tell me a joke
          </button>
          <button onClick={() => handleQuickAction('quote')} className="mpa-quick-btn">
            Give me a quote
          </button>
        </div>
      </div>
    </div>
  );
}
