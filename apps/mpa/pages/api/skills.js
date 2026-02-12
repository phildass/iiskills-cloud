/**
 * Skills/Tools API - Executes function calls from LLM
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { skill, parameters } = req.body;

    if (!skill) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    let result;
    switch (skill) {
      case 'set_reminder':
        result = await setReminder(parameters);
        break;
      case 'get_weather':
        result = await getWeather(parameters);
        break;
      case 'get_news':
        result = await getNews(parameters);
        break;
      case 'send_message':
        result = await sendMessage(parameters);
        break;
      case 'search_knowledge':
        result = await searchKnowledge(parameters);
        break;
      case 'get_calendar':
        result = await getCalendar(parameters);
        break;
      default:
        return res.status(400).json({ error: 'Unknown skill' });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Skills API error:', error);
    return res.status(500).json({ 
      error: 'Failed to execute skill',
      message: error.message
    });
  }
}

async function setReminder(params) {
  const { task, datetime } = params;
  
  // In a real implementation, this would store in Supabase
  // For now, return success with instructions for frontend
  return {
    success: true,
    action: 'SET_REMINDER',
    data: {
      task,
      datetime,
      message: `Reminder set for ${new Date(datetime).toLocaleString()}: ${task}`
    }
  };
}

async function getWeather(params) {
  const { location } = params;
  
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        message: `Weather service is currently unavailable. Please check ${location} weather manually.`
      };
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Weather API error');
    }

    const data = await response.json();

    return {
      success: true,
      action: 'DISPLAY_WEATHER',
      data: {
        location: data.name,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        message: `Weather in ${data.name}: ${Math.round(data.main.temp)}°C, ${data.weather[0].description}. Humidity: ${data.main.humidity}%`
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Unable to fetch weather for ${location}. Please try again.`
    };
  }
}

async function getNews(params) {
  const { category = 'general' } = params;
  
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        message: 'News service is currently unavailable.'
      };
    }

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${apiKey}&pageSize=5`
    );

    if (!response.ok) {
      throw new Error('News API error');
    }

    const data = await response.json();

    const headlines = data.articles.slice(0, 5).map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name
    }));

    return {
      success: true,
      action: 'DISPLAY_NEWS',
      data: {
        category,
        headlines,
        message: `Top ${category} headlines: ${headlines.map((h, i) => `${i + 1}. ${h.title}`).join(' | ')}`
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Unable to fetch news. Please try again.'
    };
  }
}

async function sendMessage(params) {
  const { recipient, message, phone } = params;
  
  // Generate WhatsApp link
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  
  if (!cleanPhone) {
    return {
      success: false,
      message: `I need a phone number to message ${recipient}.`
    };
  }

  const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  
  return {
    success: true,
    action: 'OPEN_WHATSAPP',
    data: {
      recipient,
      message,
      phone: cleanPhone,
      link: whatsappLink,
      message: `WhatsApp message to ${recipient} ready: "${message}"`
    }
  };
}

async function searchKnowledge(params) {
  const { query } = params;
  
  try {
    // Use DuckDuckGo Instant Answer API (free, no key needed)
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    );

    if (!response.ok) {
      throw new Error('Search API error');
    }

    const data = await response.json();

    let answer = data.AbstractText || data.Answer;
    
    if (!answer && data.RelatedTopics && data.RelatedTopics.length > 0) {
      answer = data.RelatedTopics[0].Text;
    }

    if (!answer) {
      return {
        success: false,
        message: `I couldn't find information about "${query}". Would you like me to search the web?`
      };
    }

    return {
      success: true,
      action: 'DISPLAY_KNOWLEDGE',
      data: {
        query,
        answer: answer.substring(0, 300) + (answer.length > 300 ? '...' : ''),
        source: data.AbstractSource || 'DuckDuckGo',
        url: data.AbstractURL,
        message: answer.substring(0, 200) + (answer.length > 200 ? '...' : '')
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Unable to search for "${query}". Please try again.`
    };
  }
}

async function getCalendar(params) {
  const { date, action = 'view' } = params;
  
  // This would integrate with Google Calendar, Microsoft Calendar, etc.
  // For now, return a placeholder
  return {
    success: true,
    action: 'DISPLAY_CALENDAR',
    data: {
      date: date || new Date().toISOString(),
      events: [],
      message: 'Calendar integration coming soon. You can add events manually for now.'
    }
  };
}
