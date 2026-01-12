import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

/**
 * AIAssistant Component
 * 
 * A floating chatbot assistant that provides site-aware context
 * based on the current subdomain/domain.
 * 
 * Features:
 * - Floating button that opens chat window
 * - Site-aware responses based on domain
 * - Unobtrusive styling
 * - Accessible everywhere
 */
export default function AIAssistant() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)
  const [domain, setDomain] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.hostname)
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Add welcome message when chat opens
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage(domain)
      setMessages([
        {
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, domain, messages.length])

  const getWelcomeMessage = (hostname) => {
    const domainName = hostname.includes('iiskills.cloud') 
      ? hostname.replace('.iiskills.cloud', '').replace('iiskills.cloud', 'main site')
      : 'iiskills.cloud'
    
    return `👋 Hello! I'm your AI assistant for ${domainName === 'main site' ? 'iiskills.cloud' : domainName}. How can I help you today?`
  }

  const getContextForDomain = (hostname) => {
    const contexts = {
      'learn-ai': 'artificial intelligence and machine learning',
      'learn-math': 'mathematics education',
      'learn-physics': 'physics concepts and problem-solving',
      'learn-chemistry': 'chemistry fundamentals',
      'learn-jee': 'JEE exam preparation',
      'learn-neet': 'NEET exam preparation',
      'learn-ias': 'UPSC Civil Services preparation',
      'learn-apt': 'aptitude and career guidance',
      'learn-data-science': 'data science and analytics',
      'learn-management': 'management and business skills',
      'learn-leadership': 'leadership development',
      'learn-geography': 'geography and world exploration',
      'learn-govt-jobs': 'government job exam preparation',
      'learn-pr': 'public relations and communication',
      'learn-winning': 'success strategies and mindset',
    }

    for (const [key, value] of Object.entries(contexts)) {
      if (hostname.includes(key)) {
        return value
      }
    }
    return 'professional skills development'
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Here you would call your AI API
      // For now, we'll provide a simple response
      const context = getContextForDomain(domain)
      const response = await simulateAIResponse(inputValue, context)

      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate AI response (replace with actual AI API call)
  const simulateAIResponse = async (question, context) => {
    // Wait a bit to simulate network call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple keyword-based responses
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes('help') || lowerQuestion.includes('how')) {
      return `I can help you with ${context}. You can ask me about courses, content, registration, or navigation. What specific topic would you like to know more about?`
    }

    if (lowerQuestion.includes('course') || lowerQuestion.includes('learn')) {
      return `We offer comprehensive courses in ${context}. You can browse our course catalog, track your progress, and access learning materials. Would you like more details about any specific topic?`
    }

    if (lowerQuestion.includes('register') || lowerQuestion.includes('signup') || lowerQuestion.includes('sign up')) {
      return `To register, click the "Register" button in the navigation menu. Create an account once and access all iiskills.cloud apps with the same credentials!`
    }

    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('fee')) {
      return `We offer affordable learning at competitive prices. Visit our pricing page or specific course pages for detailed pricing information. Some courses may have special introductory offers!`
    }

    return `Thanks for your question about ${context}! I'm here to assist you. Could you provide more details so I can give you the most helpful answer?`
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-40"
          aria-label="Open AI Assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col z-40 animate-slide-up">
          {/* Header */}
          <div className="bg-primary text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition"
              aria-label="Close chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-primary hover:bg-blue-700 text-white rounded-full p-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
