"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("What should I do?");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput("What should I do?");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.error || 'Sorry, something went wrong. Please try again.' 
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Master Life Skills - iiskills.cloud</title>
        <meta name="description" content="Get helpful life advice from your AI companion" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary">Learn Companion</h1>
                <p className="text-sm text-gray-600">Your AI Life Advisor - Free</p>
              </div>
              <nav className="flex gap-4 text-sm">
                <Link href="/terms" className="text-gray-600 hover:text-primary transition">
                  Terms
                </Link>
                <Link href="/privacy" className="text-gray-600 hover:text-primary transition">
                  Privacy
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-160px)] flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="text-6xl mb-4">💭</div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Welcome to Learn Companion
                  </h2>
                  <p className="text-gray-600 mb-4">
                    I'm your AI life advisor. Ask me questions starting with "What should I do..." 
                    and I'll provide helpful, actionable advice.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Example questions:</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• What should I do to improve my productivity?</li>
                      <li>• What should I do to stay motivated?</li>
                      <li>• What should I do to build better habits?</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border border-gray-200 shadow-sm rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="animate-bounce">•</div>
                        <div className="animate-bounce delay-100">•</div>
                        <div className="animate-bounce delay-200">•</div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What should I do?"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: All questions should start with "What should I do..."
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
