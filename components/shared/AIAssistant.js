"use client"; // This component uses React hooks and browser APIs - must run on client side

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [domain, setDomain] = useState("");
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDomain(window.location.hostname);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Add welcome message when chat opens
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage(domain);
      setMessages([
        {
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, domain, messages.length]);

  const getWelcomeMessage = (hostname) => {
    const domainName = hostname.includes("iiskills.cloud")
      ? hostname.replace(".iiskills.cloud", "").replace("iiskills.cloud", "main site")
      : "iiskills.cloud";

    return `👋 Hello! I'm your AI assistant for ${domainName === "main site" ? "iiskills.cloud" : domainName}. How can I help you today?`;
  };

  const getContextForDomain = (hostname) => {
    const contexts = {
      "learn-ai": "artificial intelligence and machine learning",
      "learn-math": "mathematics education",
      "learn-physics": "physics concepts and problem-solving",
      "learn-chemistry": "chemistry fundamentals",
      "learn-jee": "JEE exam preparation",
      "learn-neet": "NEET exam preparation",
      "learn-ias": "UPSC Civil Services preparation",
      "learn-apt": "aptitude testing and career guidance",
      "learn-data-science": "data science and analytics",
      "learn-management": "management and business skills",
      "learn-leadership": "leadership development",
      "learn-geography": "geography and world exploration",
      "learn-govt-jobs": "government job exam preparation",
      "learn-pr": "public relations and communication",
      "learn-winning": "success strategies and mindset",
    };

    for (const [key, value] of Object.entries(contexts)) {
      if (hostname.includes(key)) {
        return value;
      }
    }
    return "professional skills development";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Here you would call your AI API
      // For now, we'll provide a simple response
      const context = getContextForDomain(domain);
      const response = await simulateAIResponse(inputValue, context);

      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate AI response (replace with actual AI API call)
  const simulateAIResponse = async (question, context) => {
    // Wait a bit to simulate network call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple keyword-based responses with expanded knowledge base
    const lowerQuestion = question.toLowerCase();

    // Course and Learning Related
    if (lowerQuestion.includes("course") || lowerQuestion.includes("learn")) {
      setConsecutiveFailures(0);
      return `We offer comprehensive courses in ${context}. You can browse our course catalog, track your progress, and access learning materials. Would you like more details about any specific topic?`;
    }

    // OPEN ACCESS: Registration and login removed - all content is publicly accessible
    // Registration and Authentication - DISABLED
    if (
      lowerQuestion.includes("register") ||
      lowerQuestion.includes("signup") ||
      lowerQuestion.includes("sign up") ||
      lowerQuestion.includes("create account")
    ) {
      setConsecutiveFailures(0);
      return `All content on iiskills.cloud is now freely accessible - no registration required! You can explore all courses, modules, and learning materials without creating an account. Just browse and learn!`;
    }

    if (
      lowerQuestion.includes("login") ||
      lowerQuestion.includes("sign in") ||
      lowerQuestion.includes("log in")
    ) {
      setConsecutiveFailures(0);
      return `No login required! All content on iiskills.cloud is now freely accessible. You can access all courses, modules, and learning materials without signing in. Just browse and start learning!`;
    }

    // Pricing and Payment
    if (
      lowerQuestion.includes("price") ||
      lowerQuestion.includes("cost") ||
      lowerQuestion.includes("fee") ||
      lowerQuestion.includes("payment") ||
      lowerQuestion.includes("subscription")
    ) {
      setConsecutiveFailures(0);
      return `We offer affordable learning at competitive prices. Visit our pricing page or specific course pages for detailed pricing information. Some courses may have special introductory offers! You can make payments through our secure payment gateway.`;
    }

    // Newsletter
    if (
      lowerQuestion.includes("newsletter") ||
      lowerQuestion.includes("subscribe") ||
      lowerQuestion.includes("email update")
    ) {
      setConsecutiveFailures(0);
      return `You can subscribe to our newsletter to stay updated with new courses, features, and learning resources! Visit the /newsletter page or use the newsletter signup form. We send weekly updates and never spam.`;
    }

    // Navigation and Features
    if (
      lowerQuestion.includes("navigate") ||
      lowerQuestion.includes("menu") ||
      lowerQuestion.includes("page") ||
      lowerQuestion.includes("where")
    ) {
      setConsecutiveFailures(0);
      return `You can navigate using the menu at the top of the page. Key sections include Home, Learning Content, Login, and Register. The footer also has links to important pages like Terms, Privacy, and About. You can also access our newsletter and other learning modules from the main site.`;
    }

    // About the platform
    if (
      lowerQuestion.includes("about") ||
      lowerQuestion.includes("what is") ||
      lowerQuestion.includes("iiskills")
    ) {
      setConsecutiveFailures(0);
      return `iiskills.cloud is a professional skills development platform offering courses across multiple domains including AI, Mathematics, Physics, Chemistry, JEE/NEET preparation, Management, Leadership, and more. We provide comprehensive learning materials, certification, and career guidance.`;
    }

    // Certification
    if (
      lowerQuestion.includes("certificate") ||
      lowerQuestion.includes("certification") ||
      lowerQuestion.includes("credential")
    ) {
      setConsecutiveFailures(0);
      return `We offer certification upon successful completion of courses. Certificates are recognized credentials that validate your skills and knowledge. Visit the Certification section in the main navigation to learn more about our certification programs.`;
    }

    // Contact and Support
    if (
      lowerQuestion.includes("contact") ||
      lowerQuestion.includes("support") ||
      lowerQuestion.includes("help desk") ||
      lowerQuestion.includes("email")
    ) {
      setConsecutiveFailures(0);
      return `For support, you can reach us at info@iiskills.cloud. We're here to help with any questions about courses, registration, payments, or technical issues. You can also check the About page for more contact information.`;
    }

    // Privacy and Terms
    if (
      lowerQuestion.includes("privacy") ||
      lowerQuestion.includes("terms") ||
      lowerQuestion.includes("policy") ||
      lowerQuestion.includes("data")
    ) {
      setConsecutiveFailures(0);
      return `Our Privacy Policy and Terms & Conditions are available in the footer of every page. We take your privacy seriously and follow industry best practices for data protection. Your personal information is secure with us.`;
    }

    // Progress Tracking
    if (
      lowerQuestion.includes("progress") ||
      lowerQuestion.includes("track") ||
      lowerQuestion.includes("dashboard")
    ) {
      setConsecutiveFailures(0);
      return `You can track your learning progress through your personal dashboard. After logging in, you'll see your enrolled courses, completed lessons, and upcoming content. Your progress is saved automatically across all devices.`;
    }

    // Mobile App / PWA
    if (
      lowerQuestion.includes("app") ||
      lowerQuestion.includes("mobile") ||
      lowerQuestion.includes("install") ||
      lowerQuestion.includes("download")
    ) {
      setConsecutiveFailures(0);
      return `You can install iiskills.cloud as a Progressive Web App (PWA) on your device for a native app-like experience! Look for the "Install App" button or add to home screen option in your browser. This works on both mobile and desktop.`;
    }

    // General help
    if (lowerQuestion.includes("help") || lowerQuestion.includes("how")) {
      setConsecutiveFailures(0);
      return `I can help you with ${context}. You can ask me about courses, content, pricing, certificates, navigation, newsletter subscription, progress tracking, or general platform features. All content is freely accessible without registration or login! What would you like to know?`;
    }

    // If no match found - handle as failure with specific responses
    const currentFailures = consecutiveFailures;
    setConsecutiveFailures(prev => prev + 1);
    
    if (currentFailures === 0) {
      // First failure
      return "I am sorry, I cannot understand the question. Could you rephrase it.";
    } else if (currentFailures === 1) {
      // Second consecutive failure
      return "I am sorry. Try again please.";
    } else {
      // Third+ failure - reset and give generic help
      setConsecutiveFailures(0);
      return "I am sorry. Try again please.";
    }
  };

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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-800"
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
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
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
  );
}
