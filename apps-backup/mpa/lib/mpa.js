/**
 * MPA - My Personal Assistant
 * Core AI Logic Class
 */

export default class MPA {
  constructor() {
    // Handle both browser and server environments
    const storage = typeof localStorage !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {} };
    
    this.userName = storage.getItem('mpaUserName') || 'MPA';
    this.gender = storage.getItem('mpaGender') || 'neutral';
    this.language = storage.getItem('mpaLanguage') || 'en';
    
    this.registeredUser = null;
    this.jokes = [
      "Why did the AI go to therapy? It had too many deep learning issues.",
      "I'd tell you a UDP joke, but you might not get it.",
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "I'm not procrastinating. I'm doing side quests.",
      "Why did the developer go broke? Because he used up all his cache.",
      "My code works, but I don't know why. That's the real mystery.",
      "I told my computer I needed a break. It gave me a KitKat error.",
      "Debugging is like being a detective in a crime movie where you're also the murderer."
    ];

    this.quotes = [
      "\"The obstacle is the way.\" – Marcus Aurelius. Master resistance, become unstoppable.",
      "\"Discipline equals freedom.\" – Jocko Willink. Structure creates possibility.",
      "\"We are what we repeatedly do. Excellence, then, is not an act, but a habit.\" – Aristotle",
      "\"He who has a why to live can bear almost any how.\" – Nietzsche",
      "\"The best time to plant a tree was 20 years ago. The second best time is now.\" – Chinese Proverb",
      "\"Do not pray for an easy life, pray for the strength to endure a difficult one.\" – Bruce Lee",
      "\"The only way to do great work is to love what you do.\" – Steve Jobs",
      "\"In the midst of chaos, there is also opportunity.\" – Sun Tzu"
    ];

    this.motivationalKeywords = ['gym', 'workout', 'exercise', 'run', 'fitness', 'training'];
    
    this.obsceneKeywords = [
      'porn', 'pornographic', 'xxx', 'nude', 'naked', 'sex', 'sexual',
      'erotic', 'nsfw', 'adult content', 'explicit'
    ];
  }

  setUserName(name) {
    this.userName = name;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mpaUserName', name);
    }
  }

  setGender(gender) {
    this.gender = gender;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mpaGender', gender);
    }
  }

  setLanguage(language) {
    this.language = language;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mpaLanguage', language);
    }
  }

  setRegisteredUser(username) {
    this.registeredUser = username;
  }

  getRegisteredUser() {
    return this.registeredUser;
  }

  isUserAuthorized(currentUser) {
    if (!this.registeredUser) {
      return true;
    }
    return currentUser === this.registeredUser;
  }

  getUnauthorizedResponse() {
    const userName = this.registeredUser || 'my registered user';
    return `Sorry, I am only available for ${userName}.`;
  }

  processMessage(userMessage, currentUser = null) {
    if (!this.isUserAuthorized(currentUser)) {
      return this.getUnauthorizedResponse();
    }
    const lowerMessage = userMessage.toLowerCase();

    if (this.containsObsceneContent(lowerMessage)) {
      return "I am sorry. I cannot be of help.";
    }

    if (lowerMessage.includes('joke')) {
      return this.getJoke();
    }

    if (lowerMessage.includes('quote')) {
      return this.getQuote();
    }

    if (lowerMessage.includes('remind')) {
      return this.handleReminderRequest(userMessage);
    }

    if (lowerMessage.includes('translate')) {
      return this.handleTranslationRequest(userMessage);
    }

    if (lowerMessage.includes('call ')) {
      return this.handleCallRequest(userMessage);
    }

    if (lowerMessage.includes('play video') || lowerMessage.includes('show video')) {
      return this.handleVideoRequest(userMessage);
    }

    if (lowerMessage.includes('play song') || lowerMessage.includes('play music')) {
      return this.handleSongRequest(userMessage);
    }

    if (lowerMessage.includes('message') || lowerMessage.includes('whatsapp') || lowerMessage.includes('text')) {
      return this.handleWhatsAppRequest(userMessage);
    }

    return this.getGeneralResponse(userMessage);
  }

  containsObsceneContent(message) {
    return this.obsceneKeywords.some(keyword => message.includes(keyword));
  }

  getJoke() {
    const joke = this.jokes[Math.floor(Math.random() * this.jokes.length)];
    return `${joke} Anything else I can assist with?`;
  }

  getQuote() {
    const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    return `${quote}\n\nShall we put this wisdom into action today?`;
  }

  handleReminderRequest(message) {
    const reminderInfo = this.extractReminderInfo(message);
    
    if (!reminderInfo.task || !reminderInfo.time) {
      return "I'd be delighted to set a reminder. Could you specify what and when?";
    }

    const isoDateTime = this.parseTimeToISO(reminderInfo.time);
    let response = `Done. I've logged your ${reminderInfo.task} for ${reminderInfo.time}.`;
    
    const needsMotivation = this.motivationalKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (needsMotivation) {
      const motivationalQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
      response += ` Here's some motivation: ${motivationalQuote}`;
    } else {
      response += " Anything else?";
    }

    response += `\n[SET_REMINDER: ${isoDateTime}]`;
    
    return response;
  }

  extractReminderInfo(message) {
    const timePatterns = [
      /at (\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
      /(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i,
      /(tomorrow|today|tonight)/i,
      /on (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i
    ];

    let time = '';

    for (const pattern of timePatterns) {
      const match = message.match(pattern);
      if (match) {
        time = match[1] || match[0];
        break;
      }
    }

    let task = '';
    const remindPattern = /remind me to (.+?)(?:\s+at|\s+tomorrow|\s+today|\s+on|\s+\d)/i;
    const taskMatch = message.match(remindPattern);
    
    if (taskMatch) {
      task = taskMatch[1].trim();
    } else {
      const simplePattern = /remind me to (.+)/i;
      const simpleMatch = message.match(simplePattern);
      if (simpleMatch) {
        task = simpleMatch[1].replace(new RegExp(time, 'i'), '').trim();
      }
    }

    return { task, time };
  }

  parseTimeToISO(timeStr) {
    const now = new Date();
    let targetDate = new Date();

    if (timeStr.toLowerCase().includes('tomorrow')) {
      targetDate.setDate(now.getDate() + 1);
    }

    const timeMatch = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2] || '0');
      const meridiem = timeMatch[3];

      if (meridiem) {
        if (meridiem.toLowerCase() === 'pm' && hour < 12) {
          hour += 12;
        } else if (meridiem.toLowerCase() === 'am' && hour === 12) {
          hour = 0;
        }
      }

      targetDate.setHours(hour, minute, 0, 0);
      
      if (!timeStr.toLowerCase().includes('tomorrow') && targetDate < now) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
    }

    return targetDate.toISOString();
  }

  handleWhatsAppRequest(message) {
    const phoneMatch = message.match(/(\+?\d{10,15})/);
    const nameMatch = message.match(/(?:message|text|whatsapp)\s+([a-zA-Z]+)/i);
    
    let contact = nameMatch ? nameMatch[1] : 'contact';
    let phone = phoneMatch ? phoneMatch[1] : '';

    const msgMatch = message.match(/(?:say|tell|message).*?["'](.+?)["']/i) ||
                    message.match(/message:?\s*(.+)/i);
    
    let messageText = msgMatch ? msgMatch[1] : 'Hello!';

    if (!phone) {
      return `I'd be happy to draft a WhatsApp message to ${contact}. Could you provide their phone number?`;
    }

    return `Drafted your message to ${contact}: "${messageText}"\n[WHATSAPP_LINK: ${phone}|${messageText}]`;
  }

  generateWhatsAppLink(phone, message) {
    phone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  }

  getGeneralResponse(message) {
    const responses = [
      "I'm here to help. Could you be more specific?",
      "Interesting. How may I assist with that?",
      "Noted. What would you like me to do?",
      "I'm at your service. What's the task?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  handleTranslationRequest(message) {
    const patterns = [
      /translate\s+["'](.+?)["']\s+to\s+(\w+)/i,
      /translate\s+(.+?)\s+to\s+(\w+)/i,
      /translate\s+to\s+(\w+):?\s*(.+)/i
    ];

    let textToTranslate = '';
    let targetLanguage = '';

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        if (pattern.toString().includes('to\\s+(\\w+):?\\s*(.+)')) {
          targetLanguage = match[1];
          textToTranslate = match[2];
        } else {
          textToTranslate = match[1];
          targetLanguage = match[2];
        }
        break;
      }
    }

    if (!textToTranslate || !targetLanguage) {
      return "I'd be happy to translate. Please specify the text and target language (e.g., 'Translate Hello to Tamil').";
    }

    const oral = message.toLowerCase().includes('orally') || message.toLowerCase().includes('oral');
    
    return `Translating "${textToTranslate}" to ${targetLanguage}${oral ? ' (orally)' : ''}.\n[TRANSLATE: ${targetLanguage}|${textToTranslate}${oral ? '|oral' : ''}]`;
  }

  handleCallRequest(message) {
    const phonePattern = /call\s+(\+?\d[\d\s-]+)/i;
    const namePattern = /call\s+([a-zA-Z][a-zA-Z\s]+?)(?:\s+at|\s+on|$)/i;
    
    let contact = '';
    let phone = '';

    const phoneMatch = message.match(phonePattern);
    if (phoneMatch) {
      phone = phoneMatch[1].replace(/\s/g, '');
      contact = phone;
    } else {
      const nameMatch = message.match(namePattern);
      if (nameMatch) {
        contact = nameMatch[1].trim();
      }
    }

    if (!contact) {
      return "Who would you like me to call?";
    }

    return `Calling ${contact} now. Setting to speaker mode.\n[CALL: ${phone || contact}|${contact}]`;
  }

  handleVideoRequest(message) {
    const patterns = [
      /play video\s+["'](.+?)["']/i,
      /play video\s+(.+)/i,
      /show video\s+["'](.+?)["']/i,
      /show video\s+(.+)/i
    ];

    let videoName = '';

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        videoName = match[1].trim();
        break;
      }
    }

    if (!videoName) {
      return "Which video would you like to watch?";
    }

    return `Playing "${videoName}" from public domain.\n[PLAY_VIDEO: ${videoName}]`;
  }

  handleSongRequest(message) {
    const patterns = [
      /play\s+(?:song|music)\s+["'](.+?)["']/i,
      /play\s+["'](.+?)["']/i,
      /play\s+(?:song|music)\s+(.+)/i,
      /play\s+(.+)/i
    ];

    let songName = '';

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        songName = match[1].trim();
        if (!['video', 'videos', 'a song', 'music', 'something'].includes(songName.toLowerCase())) {
          break;
        }
      }
    }

    if (!songName || songName.length < 2) {
      return "Which song would you like to hear?";
    }

    return `Playing "${songName}" from public domain.\n[PLAY_SONG: ${songName}]`;
  }

  parseActionCodes(response) {
    const actions = [];
    
    const reminderPattern = /\[SET_REMINDER:\s*([^\]]+)\]/g;
    let match;
    while ((match = reminderPattern.exec(response)) !== null) {
      const datetime = match[1].trim();
      const date = new Date(datetime);
      const dateText = isNaN(date.getTime()) ? 'the specified time' : date.toLocaleString();
      actions.push({
        type: 'SET_REMINDER',
        datetime: datetime,
        text: `Reminder set for ${dateText}`
      });
    }

    const whatsappPattern = /\[WHATSAPP_LINK:\s*([^|]+)\|([^\]]+)\]/g;
    while ((match = whatsappPattern.exec(response)) !== null) {
      const phone = match[1].trim();
      const message = match[2].trim();
      const link = this.generateWhatsAppLink(phone, message);
      actions.push({
        type: 'WHATSAPP_LINK',
        phone: phone,
        message: message,
        link: link,
        text: 'Open WhatsApp'
      });
    }

    const translatePattern = /\[TRANSLATE:\s*([^|]+)\|([^|\]]+)(?:\|([^\]]+))?\]/g;
    while ((match = translatePattern.exec(response)) !== null) {
      const language = match[1].trim();
      const text = match[2].trim();
      const oral = match[3] ? match[3].trim() : '';
      actions.push({
        type: 'TRANSLATE',
        language: language,
        text: text,
        oral: oral === 'oral',
        displayText: `Translate to ${language}`
      });
    }

    const callPattern = /\[CALL:\s*([^|]+)\|([^\]]+)\]/g;
    while ((match = callPattern.exec(response)) !== null) {
      const phone = match[1].trim();
      const contact = match[2].trim();
      actions.push({
        type: 'CALL',
        phone: phone,
        contact: contact,
        text: `Call ${contact}`
      });
    }

    const videoPattern = /\[PLAY_VIDEO:\s*([^\]]+)\]/g;
    while ((match = videoPattern.exec(response)) !== null) {
      const videoName = match[1].trim();
      actions.push({
        type: 'PLAY_VIDEO',
        videoName: videoName,
        text: `Play video: ${videoName}`
      });
    }

    const songPattern = /\[PLAY_SONG:\s*([^\]]+)\]/g;
    while ((match = songPattern.exec(response)) !== null) {
      const songName = match[1].trim();
      actions.push({
        type: 'PLAY_SONG',
        songName: songName,
        text: `Play song: ${songName}`
      });
    }

    return actions;
  }

  cleanResponse(response) {
    return response
      .replace(/\[SET_REMINDER:[^\]]+\]/g, '')
      .replace(/\[WHATSAPP_LINK:[^\]]+\]/g, '')
      .replace(/\[TRANSLATE:[^\]]+\]/g, '')
      .replace(/\[CALL:[^\]]+\]/g, '')
      .replace(/\[PLAY_VIDEO:[^\]]+\]/g, '')
      .replace(/\[PLAY_SONG:[^\]]+\]/g, '')
      .trim();
  }
}
