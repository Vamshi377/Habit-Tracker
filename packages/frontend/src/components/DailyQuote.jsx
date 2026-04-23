import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const DailyQuote = () => {
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback quotes in case API fails
  const fallbackQuotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It's not about perfect. It's about effort.", author: "Jillian Michaels" },
    { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
    { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
    { text: "Your habits will determine your future.", author: "Jack Canfield" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" }
  ];

  useEffect(() => {
    // Try to load quote from localStorage first
    const savedQuote = localStorage.getItem('habit-tracker-daily-quote');
    const savedDate = localStorage.getItem('habit-tracker-quote-date');
    const today = new Date().toDateString();
    
    // Check if we have a quote saved for today
    if (savedQuote && savedDate === today) {
      try {
        const quoteData = JSON.parse(savedQuote);
        setQuote(quoteData.text);
        setAuthor(quoteData.author);
      } catch (err) {
        console.error('Error parsing saved quote:', err);
        fetchNewQuote();
      }
    } else {
      // If no quote for today, fetch a new one
      fetchNewQuote();
    }
  }, []);

  const fetchNewQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to get a quote from the API
      const response = await axios.get('/api/ai/daily-quote');
      
      if (response.data && response.data.quote) {
        setQuote(response.data.quote.text);
        setAuthor(response.data.quote.author || 'Unknown');
        
        // Save to localStorage
        localStorage.setItem('habit-tracker-daily-quote', JSON.stringify({
          text: response.data.quote.text,
          author: response.data.quote.author || 'Unknown'
        }));
        localStorage.setItem('habit-tracker-quote-date', new Date().toDateString());
      } else {
        useRandomFallbackQuote();
      }
    } catch (err) {
      console.error('Error fetching quote:', err);
      useRandomFallbackQuote();
    } finally {
      setLoading(false);
    }
  };

  const useRandomFallbackQuote = () => {
    // Use a fallback quote if API fails
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    const fallbackQuote = fallbackQuotes[randomIndex];
    
    setQuote(fallbackQuote.text);
    setAuthor(fallbackQuote.author);
    
    // Save to localStorage
    localStorage.setItem('habit-tracker-daily-quote', JSON.stringify(fallbackQuote));
    localStorage.setItem('habit-tracker-quote-date', new Date().toDateString());
  };

  const toggleQuote = () => {
    setShowQuote(!showQuote);
  };

  return (
    <>
      <button
        onClick={toggleQuote}
        className="flex items-center justify-center p-2 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors border border-white"
        title="Daily Motivational Quote"
      >
        <FaQuoteLeft className="text-xl" />
        <span className="ml-2 hidden md:inline text-black">Quote</span>
      </button>

      <AnimatePresence>
        {showQuote && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQuote(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Daily Motivation
                  </h2>
                  <button
                    onClick={() => setShowQuote(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-4">
                    <p className="text-red-500 dark:text-red-400 mb-2">
                      {error}
                    </p>
                    <button
                      onClick={fetchNewQuote}
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-5xl text-primary mb-4">
                      <FaQuoteLeft />
                    </div>
                    <blockquote className="text-xl italic text-gray-700 dark:text-gray-300 mb-4">
                      {quote}
                    </blockquote>
                    <cite className="text-lg font-medium text-gray-600 dark:text-gray-400">
                      — {author}
                    </cite>
                    <div className="mt-6">
                      <button
                        onClick={fetchNewQuote}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                      >
                        New Quote
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DailyQuote;
