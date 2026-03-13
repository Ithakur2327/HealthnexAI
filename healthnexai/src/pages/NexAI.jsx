import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { chatAPI, assessmentAPI } from '../services/api';

function NexAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [allAssessments, setAllAssessments] = useState([]);
  const [loadingAssessment, setLoadingAssessment] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    loadLatestAssessment();
  }, []);

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }
  };

  const loadChatHistory = async () => {
    try {
      const data = await chatAPI.getHistory();
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setMessages([]);
    }
  };

  const loadLatestAssessment = async () => {
    setLoadingAssessment(true);
    try {
      const response = await assessmentAPI.getAll();
      
      let assessments = null;
      if (response.assessments && Array.isArray(response.assessments)) {
        assessments = response.assessments;
      } else if (Array.isArray(response)) {
        assessments = response;
      } else if (response.data && Array.isArray(response.data)) {
        assessments = response.data;
      }
      
      if (assessments && assessments.length > 0) {
        setLatestAssessment(assessments[0]);
        setAllAssessments(assessments);
      } else {
        setLatestAssessment(null);
        setAllAssessments([]);
      }
    } catch (error) {
      console.error('Failed to load assessment:', error);
      setLatestAssessment(null);
      setAllAssessments([]);
    } finally {
      setLoadingAssessment(false);
    }
  };

  const handleNewChat = () => {
    if (window.confirm('Start a new conversation? (Previous chats are saved)')) {
      setMessages([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const messageText = input.trim();
    if (!messageText || loading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => scrollToBottom(), 100);

    try {
      const response = await chatAPI.sendMessage(messageText);
      const aiReply = response.reply || response.message || 'I received your message.';
      
      const aiMessage = {
        role: 'assistant',
        content: aiReply,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (percentage) => {
    const num = Number(percentage);
    if (num < 30) return {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-400',
      bar: 'from-emerald-500 to-emerald-600'
    };
    if (num < 60) return {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-500',
      text: 'text-yellow-700 dark:text-yellow-400',
      bar: 'from-yellow-500 to-yellow-600'
    };
    return {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-500',
      text: 'text-red-700 dark:text-red-400',
      bar: 'from-red-500 to-red-600'
    };
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Chat Panel - Full width on mobile, flex-1 on desktop */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
          
          {/* Chat Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">NexAI Chat</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{messages.length} messages</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleNewChat}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-lg text-sm font-semibold transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Chat</span>
              </button>

              {/* Mobile: New Chat Icon Only */}
              <button
                onClick={handleNewChat}
                className="sm:hidden p-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              {/* Mobile Sidebar Toggle */}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showSidebar ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
            
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to NexAI
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your personal AI health assistant. Ask me about your health risks and get personalized recommendations.
                  </p>
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
                      className={`max-w-[85%] sm:max-w-2xl px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-tr-none shadow-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">NexAI</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-5 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 bg-white dark:bg-gray-900">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your health..."
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Desktop Sidebar - Always visible on large screens */}
        <div className="hidden lg:flex w-96 bg-gray-50 dark:bg-gray-800 flex-col border-l border-gray-200 dark:border-gray-700">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Previous Assessments Dropdown */}
            {allAssessments.length > 1 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Previous Assessments</h2>
                <select
                  onChange={(e) => {
                    const selected = allAssessments[parseInt(e.target.value)];
                    setLatestAssessment(selected);
                  }}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                >
                  {allAssessments.map((assessment, index) => (
                    <option key={index} value={index}>
                      {new Date(assessment.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Assessment Results */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {allAssessments.length > 1 ? 'Selected Assessment' : 'Latest Assessment'}
                </h2>
                <Link
                  to="/assessment"
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  New +
                </Link>
              </div>

              {loadingAssessment ? (
                <div className="text-center py-8">
                  <svg className="w-10 h-10 mx-auto text-cyan-600 animate-spin mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
              ) : latestAssessment && latestAssessment.results ? (
                <div className="space-y-3">
                  {/* Risk Cards */}
                  {[
                    { name: 'Diabetes', key: 'diabetesRisk' },
                    { name: 'Heart Disease', key: 'heartDiseaseRisk' },
                    { name: 'Blood Pressure', key: 'bloodPressureRisk' },
                    { name: 'Obesity', key: 'obesityRisk' },
                    { name: 'Mental Health', key: 'mentalHealthRisk' }
                  ].map((risk) => {
                    const value = latestAssessment.results[risk.key];
                    if (value === undefined) return null;
                    const colors = getRiskColor(value);
                    
                    return (
                      <div key={risk.key} className={`p-3 ${colors.bg} border-l-4 ${colors.border} rounded-lg`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{risk.name}</span>
                          <span className={`text-lg font-bold ${colors.text}`}>
                            {value}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-500`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-3">
                    <Link
                      to="/results"
                      className="block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-center text-sm hover:border-cyan-500 transition-all"
                    >
                      View Full Results
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-white dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    No assessment yet
                  </p>
                  <Link
                    to="/assessment"
                    className="inline-block px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                  >
                    Take Assessment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar - Slide from right */}
        {showSidebar && (
          <>
            {/* Overlay */}
            <div 
              onClick={() => setShowSidebar(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Sidebar */}
            <div className="lg:hidden fixed right-0 top-0 bottom-0 w-full max-w-sm bg-gray-50 dark:bg-gray-800 z-50 shadow-2xl overflow-y-auto">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Assessment Results</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Previous Assessments Dropdown */}
                {allAssessments.length > 1 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Previous Assessments</h2>
                    <select
                      onChange={(e) => {
                        const selected = allAssessments[parseInt(e.target.value)];
                        setLatestAssessment(selected);
                      }}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                    >
                      {allAssessments.map((assessment, index) => (
                        <option key={index} value={index}>
                          {new Date(assessment.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Assessment Results */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {allAssessments.length > 1 ? 'Selected Assessment' : 'Latest Assessment'}
                    </h2>
                    <Link
                      to="/assessment"
                      onClick={() => setShowSidebar(false)}
                      className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                    >
                      New +
                    </Link>
                  </div>

                  {loadingAssessment ? (
                    <div className="text-center py-8">
                      <svg className="w-10 h-10 mx-auto text-cyan-600 animate-spin mb-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Loading...</p>
                    </div>
                  ) : latestAssessment && latestAssessment.results ? (
                    <div className="space-y-3">
                      {[
                        { name: 'Diabetes', key: 'diabetesRisk' },
                        { name: 'Heart Disease', key: 'heartDiseaseRisk' },
                        { name: 'Blood Pressure', key: 'bloodPressureRisk' },
                        { name: 'Obesity', key: 'obesityRisk' },
                        { name: 'Mental Health', key: 'mentalHealthRisk' }
                      ].map((risk) => {
                        const value = latestAssessment.results[risk.key];
                        if (value === undefined) return null;
                        const colors = getRiskColor(value);
                        
                        return (
                          <div key={risk.key} className={`p-3 ${colors.bg} border-l-4 ${colors.border} rounded-lg`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{risk.name}</span>
                              <span className={`text-lg font-bold ${colors.text}`}>
                                {value}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-500`}
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="pt-3">
                        <Link
                          to="/results"
                          onClick={() => setShowSidebar(false)}
                          className="block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-center text-sm hover:border-cyan-500 transition-all"
                        >
                          View Full Results
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        No assessment yet
                      </p>
                      <Link
                        to="/assessment"
                        onClick={() => setShowSidebar(false)}
                        className="inline-block px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                      >
                        Take Assessment
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NexAI;