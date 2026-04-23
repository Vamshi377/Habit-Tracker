import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiSend, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { sendMessage, reset, getHabitData } from '../features/ai/aiSlice';

const AIChat = () => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [hasLimitedData, setHasLimitedData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { habitData, isError, message } = useSelector(state => state.ai);
  
  useEffect(() => {
    if (isError) {
      toast.error('Error: ' + message);
      // Reset error state after showing toast
      dispatch(reset());
    }

    // Attempt to load habit data when component mounts
    const loadHabitData = async () => {
      try {
        console.log('Fetching habit data for AI chat...');
        setIsLoading(true);
        await dispatch(getHabitData());
        console.log('Habit data loaded successfully');
        
        // Add initial greeting message
        setTimeout(() => {
          setMessages([
            { 
              sender: 'ai', 
              text: "Hello! I'm your Habit Assistant AI. I can analyze your habits and provide personalized advice to help you build better routines and achieve your goals. How can I help you today?"
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to load habit data:', error);
        toast.warning('Limited habit data available. The AI assistant will provide general advice rather than personalized insights.');
        setHasLimitedData(true);
        setIsLoading(false);
        
        // Add fallback greeting
        setMessages([
          { 
            sender: 'ai', 
            text: "Hello! I'm your Habit Assistant AI. I'm currently working with limited data, but I'll do my best to provide helpful advice about habit formation and maintenance. How can I help you today?"
          }
        ]);
      }
    };

    loadHabitData();
  }, [dispatch, isError, message]);

  // Scroll to bottom of chat on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message to the AI
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    const newUserMessage = { sender: 'user', text: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    
    // Clear input and show typing indicator
    setUserMessage('');
    setIsAiTyping(true);
    
    try {
      const response = await dispatch(sendMessage({ 
        message: userMessage,
        previousMessages: messages 
      })).unwrap();
      
      // Add AI response to chat
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: response.response 
      }]);
      
      setIsAiTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsAiTyping(false);
      
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'Sorry, I encountered an error processing your request. Please try again later.',
        isError: true
      }]);
      
      toast.error('Failed to get AI response. Please try again later.');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const clearChat = () => {
    setMessages([]);
    toast.info('Chat history cleared');
  };

  const handlePresetQuestion = (question) => {
    setUserMessage(question);
    handleSendMessage();
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-primary text-black flex justify-between items-center">
          <h2 className="text-xl font-bold">AI Habit Assistant</h2>
          <button 
            onClick={clearChat}
            className="p-2 rounded-full hover:bg-primary-dark transition-colors"
            title="Clear chat history"
          >
            <FiRefreshCw />
          </button>
        </div>
        
        {hasLimitedData && (
          <div className="bg-yellow-50 p-3 flex items-center text-yellow-800 text-sm">
            <FiAlertTriangle className="mr-2" />
            <p>Limited habit data available. The AI assistant will provide general advice rather than personalized insights.</p>
          </div>
        )}
        
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-pulse text-gray-400">Loading conversation...</div>
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p className="mb-2">No messages yet</p>
                  <p className="text-sm">Start a conversation with the AI assistant</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3/4 p-3 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-black rounded-br-none' 
                          : msg.isError 
                            ? 'bg-red-50 text-red-700 rounded-bl-none' 
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </motion.div>
                ))
              )}
              
              {isAiTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        <div className="p-4 border-t">
          <form className="flex" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Type your message..."
              rows="2"
            ></textarea>
            <button
              type="submit"
              disabled={isLoading || !userMessage.trim()}
              className={`px-4 rounded-r-lg flex items-center justify-center ${
                isLoading || !userMessage.trim() 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              <FiSend />
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for a new line
          </p>
          <div className="flex flex-wrap justify-center mt-4">
            <button 
              onClick={() => handlePresetQuestion('Analyze my habits - what am I doing well and what could I improve?')}
              className="bg-gray-200 p-2 rounded-lg mx-2 my-1 hover:bg-gray-300 transition-colors text-sm"
            >
              Analyze My Habits
            </button>
            <button 
              onClick={() => handlePresetQuestion('Judging by my habits and consistency, what kind of person am I?')}
              className="bg-gray-200 p-2 rounded-lg mx-2 my-1 hover:bg-gray-300 transition-colors text-sm"
            >
              My Personality
            </button>
            <button 
              onClick={() => handlePresetQuestion('How can I improve my current habits and build better consistency?')}
              className="bg-gray-200 p-2 rounded-lg mx-2 my-1 hover:bg-gray-300 transition-colors text-sm"
            >
              Improvement Tips
            </button>
            <button 
              onClick={() => handlePresetQuestion('What new habits would complement my current ones?')}
              className="bg-gray-200 p-2 rounded-lg mx-2 my-1 hover:bg-gray-300 transition-colors text-sm"
            >
              Suggest New Habits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
