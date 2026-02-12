import { useState, useEffect, useRef } from 'react';
import MPA from '../lib/mpa';
import VoiceManager from '../lib/voiceManager';
import ConversationManager from '../lib/conversationManager';

export default function MPAChat() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [setupName, setSetupName] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [settings, setSettings] = useState({
    userName: 'MPA',
    gender: 'neutral',
    language: 'en',
    voiceEnabled: true,
    autoSpeak: true
  });
  
  const chatContainerRef = useRef(null);
  const mpaRef = useRef(null);
  const voiceManagerRef = useRef(null);
  const conversationManagerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mpaRef.current = new MPA();
      voiceManagerRef.current = new VoiceManager();
      conversationManagerRef.current = new ConversationManager();
      
      const savedUser = localStorage.getItem('mpa_registered_user');
      const savedName = localStorage.getItem('mpaUserName') || 'MPA';
      const savedGender = localStorage.getItem('mpaGender') || 'neutral';
      const savedLanguage = localStorage.getItem('mpaLanguage') || 'en';
      const savedVoiceEnabled = localStorage.getItem('mpaVoiceEnabled') !== 'false';
      const savedAutoSpeak = localStorage.getItem('mpaAutoSpeak') !== 'false';
      
      const loadedSettings = { 
        userName: savedName, 
        gender: savedGender, 
        language: savedLanguage,
        voiceEnabled: savedVoiceEnabled,
        autoSpeak: savedAutoSpeak
      };
      
      setSettings(loadedSettings);
      
      if (savedUser) {
        setCurrentUser(savedUser);
        mpaRef.current.setRegisteredUser(savedUser);
        conversationManagerRef.current.init(savedUser, loadedSettings);
        
        // Load conversation history
        const history = conversationManagerRef.current.messages;
        if (history.length > 0) {
          setMessages(history.map(m => ({
            text: m.content,
            isUser: m.role === 'user',
            timestamp: m.timestamp
          })));
        }
      } else {
        setShowSetup(true);
      }

      // Setup voice recognition callbacks
      if (voiceManagerRef.current.initRecognition(savedLanguage)) {
        voiceManagerRef.current.onResult = (transcript, isFinal) => {
          if (isFinal) {
            setUserInput(transcript);
            setInterimTranscript('');
          } else {
            setInterimTranscript(transcript);
          }
        };

        voiceManagerRef.current.onStart = () => {
          setIsListening(true);
        };

        voiceManagerRef.current.onEnd = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        voiceManagerRef.current.onError = (error) => {
          console.error('Voice recognition error:', error);
          setIsListening(false);
          setInterimTranscript('');
          if (error !== 'no-speech' && error !== 'aborted') {
            setMessages(prev => [...prev, {
              text: 'Sorry, I didn\'t catch that. Please try again or type your message.',
              isUser: false,
              isError: true
            }]);
          }
        };
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

  const handleUserMessage = async () => {
    if (!userInput.trim() || isProcessing) return;

    const messageText = userInput.trim();
    setUserInput('');
    setIsProcessing(true);

    // Add user message to display
    setMessages(prev => [...prev, { text: messageText, isUser: true }]);

    try {
      // Use conversation manager for LLM integration
      const result = await conversationManagerRef.current.sendMessage(messageText);
      
      // Add assistant response
      if (result.message) {
        setMessages(prev => [...prev, { text: result.message, isUser: false }]);
        
        // Speak response if voice enabled
        if (settings.voiceEnabled && settings.autoSpeak && voiceManagerRef.current) {
          await voiceManagerRef.current.speak(result.message, {
            languageCode: settings.language,
            gender: settings.gender
          });
        }
      }

      // Handle skill results
      if (result.skillResults && result.skillResults.length > 0) {
        for (const skillResult of result.skillResults) {
          if (skillResult.success) {
            handleSkillAction(skillResult);
          } else {
            setMessages(prev => [...prev, { 
              text: skillResult.message || 'Action failed',
              isUser: false,
              isError: true 
            }]);
          }
        }
      }

    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, { 
        text: 'I apologize, but I encountered an error. Please try again.',
        isUser: false,
        isError: true 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkillAction = (skillResult) => {
    const { action, data } = skillResult;

    switch (action) {
      case 'SET_REMINDER':
        setReminder(data.datetime, data.task);
        setMessages(prev => [...prev, { 
          text: `✓ ${data.message}`, 
          isAction: true 
        }]);
        break;

      case 'OPEN_WHATSAPP':
        setMessages(prev => [...prev, { 
          text: `✓ ${data.message}`,
          isAction: true,
          link: data.link,
          linkText: '📱 Open WhatsApp'
        }]);
        break;

      case 'DISPLAY_WEATHER':
        setMessages(prev => [...prev, { 
          text: `🌤️ ${data.message}`,
          isAction: true
        }]);
        break;

      case 'DISPLAY_NEWS':
        const newsText = data.headlines.map((h, i) => 
          `${i + 1}. ${h.title}`
        ).join('\n');
        setMessages(prev => [...prev, { 
          text: `📰 Top ${data.category} news:\n${newsText}`,
          isAction: true
        }]);
        break;

      case 'DISPLAY_KNOWLEDGE':
        setMessages(prev => [...prev, { 
          text: `💡 ${data.message}`,
          isAction: true,
          link: data.url,
          linkText: 'Read more'
        }]);
        break;

      default:
        if (data.message) {
          setMessages(prev => [...prev, { 
            text: data.message,
            isAction: true 
          }]);
        }
    }
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
    
    // Initialize conversation manager
    conversationManagerRef.current.init(name, settings);
    
    setShowSetup(false);
    setMessages([{ 
      text: `Welcome, ${name}! I'm ${settings.userName}, your personal AI assistant. I can help you with reminders, weather, news, messages, and much more. How may I assist you today?`, 
      isUser: false 
    }]);
    
    // Speak welcome message if voice enabled
    if (settings.voiceEnabled && voiceManagerRef.current) {
      voiceManagerRef.current.speak(
        `Welcome, ${name}! I'm ${settings.userName}, your personal AI assistant. How may I assist you today?`,
        {
          languageCode: settings.language,
          gender: settings.gender
        }
      );
    }
  };

  const handleSaveSettings = () => {
    mpaRef.current.setUserName(settings.userName);
    mpaRef.current.setGender(settings.gender);
    mpaRef.current.setLanguage(settings.language);
    
    // Update conversation manager settings
    conversationManagerRef.current.updateSettings(settings);
    
    // Update voice language
    if (voiceManagerRef.current) {
      voiceManagerRef.current.setLanguage(settings.language);
    }
    
    setShowSettings(false);
    const confirmMessage = `Settings saved! I'm now ${settings.userName} (${settings.gender} assistant, ${settings.language} language). Voice ${settings.voiceEnabled ? 'enabled' : 'disabled'}.`;
    
    setMessages(prev => [...prev, { 
      text: confirmMessage,
      isUser: false 
    }]);
    
    // Speak confirmation if voice enabled
    if (settings.voiceEnabled && voiceManagerRef.current) {
      voiceManagerRef.current.speak(confirmMessage, {
        languageCode: settings.language,
        gender: settings.gender
      });
    }
  };

  const toggleVoiceRecognition = () => {
    if (!VoiceManager.isSpeechRecognitionSupported()) {
      alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      voiceManagerRef.current.stopListening();
    } else {
      voiceManagerRef.current.startListening();
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking && voiceManagerRef.current) {
      voiceManagerRef.current.stopSpeaking();
      setIsSpeaking(false);
    }
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
    <div className="min-h-screen mpa-gradient flex justify-center items-center p-5 pt-20">{/* pt-20 for header space */}
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
          <div className="bg-white rounded-3xl p-8 max-w-lg w-11/12 max-h-[90vh] overflow-y-auto">
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
            
            <div className="mb-5">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={(e) => setSettings({...settings, voiceEnabled: e.target.checked})}
                  className="mr-3 w-5 h-5"
                />
                <span className="font-semibold">Enable Voice Features</span>
              </label>
              <p className="text-sm text-gray-600 mt-1 ml-8">
                Allows speech-to-text input and text-to-speech output
              </p>
            </div>
            
            {settings.voiceEnabled && (
              <div className="mb-5">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSpeak}
                    onChange={(e) => setSettings({...settings, autoSpeak: e.target.checked})}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="font-semibold">Auto-speak Responses</span>
                </label>
                <p className="text-sm text-gray-600 mt-1 ml-8">
                  Automatically read responses aloud
                </p>
              </div>
            )}
            
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
          <p className="text-sm italic opacity-90">Your Personal AI Assistant</p>
          {isListening && (
            <div className="mt-2 flex items-center justify-center gap-2 text-sm">
              <span className="mpa-pulse">🎤</span>
              <span>Listening...</span>
            </div>
          )}
          {isSpeaking && (
            <div className="mt-2 flex items-center justify-center gap-2 text-sm">
              <span className="mpa-pulse">🔊</span>
              <span>Speaking...</span>
            </div>
          )}
          {isProcessing && !isListening && !isSpeaking && (
            <div className="mt-2 flex items-center justify-center gap-2 text-sm">
              <span className="mpa-pulse">⚙️</span>
              <span>Thinking...</span>
            </div>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-5 right-5 bg-white bg-opacity-20 border-2 border-white border-opacity-40 text-white px-4 py-2 rounded-full text-xl hover:bg-opacity-30 transition-all"
            title="Settings"
          >
            ⚙️
          </button>
        </div>

        <div ref={chatContainerRef} className="mpa-chat-container">
          {messages.length === 0 && (
            <div className="text-center text-gray-600 italic p-5">
              <p>Good day! I'm <span className="font-semibold">{settings.userName}</span>, your personal AI assistant.</p>
              <p className="mt-2 text-sm">Ask me anything - use text or voice! I can help with reminders, weather, news, messages, and more.</p>
            </div>
          )}
          {interimTranscript && (
            <div className="mpa-message">
              <div className="mpa-user-message opacity-60 italic">
                {interimTranscript}...
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className="mpa-message">
              {msg.isAction ? (
                <div className={`mpa-action-notification ${msg.isError ? 'mpa-error-notification' : ''}`}>
                  {msg.text}
                  {msg.link && (
                    <>
                      <br />
                      <a href={msg.link} target="_blank" rel="noopener noreferrer" className="mpa-action-link">
                        {msg.linkText || '📱 Open Link'}
                      </a>
                    </>
                  )}
                </div>
              ) : (
                <div className={`${msg.isUser ? 'mpa-user-message' : 'mpa-ai-message'} ${msg.isError ? 'mpa-error-message' : ''}`}>
                  {msg.text}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mpa-input-container">
          {settings.voiceEnabled && VoiceManager.isSpeechRecognitionSupported() && (
            <button
              onClick={toggleVoiceRecognition}
              className={`p-4 rounded-full transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
              disabled={isProcessing}
            >
              🎤
            </button>
          )}
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
            placeholder={isListening ? "Listening..." : "Ask me anything... (e.g., 'What's the weather?', 'Remind me to...')"}
            className="flex-1 p-4 border-2 border-gray-300 rounded-full outline-none focus:border-purple-600"
            autoComplete="off"
            disabled={isListening || isProcessing}
          />
          <button
            onClick={handleUserMessage}
            disabled={!userInput.trim() || isProcessing}
            className="ml-3 px-8 py-4 mpa-gradient text-white rounded-full font-bold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? '...' : 'Send'}
          </button>
        </div>

        <div className="mpa-quick-actions">
          <button onClick={() => { setUserInput('Tell me a joke'); }} className="mpa-quick-btn">
            😄 Joke
          </button>
          <button onClick={() => { setUserInput('Give me a motivational quote'); }} className="mpa-quick-btn">
            💪 Quote
          </button>
          <button onClick={() => { setUserInput('What\'s the weather?'); }} className="mpa-quick-btn">
            🌤️ Weather
          </button>
          <button onClick={() => { setUserInput('Latest news'); }} className="mpa-quick-btn">
            📰 News
          </button>
        </div>
      </div>
    </div>
  );
}
