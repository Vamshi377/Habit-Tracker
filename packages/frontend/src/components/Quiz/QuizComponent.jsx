import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import { drawHand, countFingers } from './handUtils';
import { quizQuestions } from './quizData';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaHandPaper, FaTimes } from 'react-icons/fa';

const QuizComponent = ({ onClose }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [model, setModel] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectionTimer, setSelectionTimer] = useState(null);
  const [countdownTime, setCountdownTime] = useState(2);
  const [fingerCount, setFingerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Load the handpose model
  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      try {
        // Set device and environment for tensorflow
        await tf.setBackend('webgl');
        
        // Load the model
        const handModel = await handpose.load();
        setModel(handModel);
        
        setIsLoading(false);
        toast.success('Hand detection ready!', {
          position: "top-center",
          autoClose: 2000
        });
      } catch (error) {
        console.error('Error loading handpose model:', error);
        toast.error('Failed to load hand detection model', {
          position: "top-center"
        });
        setIsLoading(false);
      }
    };
    
    loadModel();
    
    // Cleanup function
    return () => {
      // Stop any running intervals or timeouts
      if (selectionTimer) clearTimeout(selectionTimer);
    };
  }, []);
  
  // Detect hand and count fingers
  useEffect(() => {
    if (!model || isFinished || isTransitioning) return;
    
    let intervalId;
    let lastFingerCount = 0;
    let lastCountTime = Date.now();
    
    const detect = async () => {
      if (webcamRef.current?.video?.readyState === 4) {
        // Get video properties
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        // Set video dimensions
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        
        // Set canvas dimensions
        if (canvasRef.current) {
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
        }
        
        // Make detections
        try {
          const hand = await model.estimateHands(video);
          
          // Draw hand if detected
          if (hand.length > 0) {
            // Count fingers
            const count = countFingers(hand);
            setFingerCount(count);
            
            // Only process if finger count is between 1 and 5
            if (count >= 1 && count <= 5) {
              // If the finger count is stable for 2 seconds, select the option
              if (count === lastFingerCount) {
                const elapsedTime = Date.now() - lastCountTime;
                
                // Calculate the percentage of time passed for the countdown (0-100%)
                const timePercentage = Math.min((elapsedTime / 2000) * 100, 100);
                setCountdownTime(Math.max(2 - (elapsedTime / 1000), 0).toFixed(1));
                
                if (elapsedTime >= 2000 && !isTransitioning) {
                  // Select the option based on finger count (1 = A, 2 = B, etc.)
                  const currentQuestion = quizQuestions[currentQuestionIndex];
                  if (currentQuestion && currentQuestion.options.length >= count) {
                    handleSelect(currentQuestion.options[count - 1].value);
                  }
                }
              } else {
                // Reset timer if finger count changes
                lastFingerCount = count;
                lastCountTime = Date.now();
              }
            } else {
              // Reset if hand is detected but no valid finger count
              lastFingerCount = 0;
            }
            
            // Draw hand landmarks on canvas
            const ctx = canvasRef.current.getContext("2d");
            drawHand(hand, ctx);
          } else {
            // No hand detected, reset
            setFingerCount(0);
            lastFingerCount = 0;
          }
        } catch (error) {
          console.error('Hand detection error:', error);
        }
      }
      
      // Continue detection loop with animation frame
      intervalId = requestAnimationFrame(detect);
    };
    
    intervalId = requestAnimationFrame(detect);
    
    // Cleanup function
    return () => {
      if (intervalId) {
        cancelAnimationFrame(intervalId);
      }
    };
  }, [model, currentQuestionIndex, isTransitioning, isFinished]);
  
  const handleSelect = (optionValue) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedOption(optionValue);
    
    // Add answer to results
    const newAnswers = [...answers, { 
      question: currentQuestionIndex + 1,
      answer: optionValue 
    }];
    setAnswers(newAnswers);
    
    // Delay before moving to the next question
    setTimeout(() => {
      // Move to next question or finish
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
      }
      setIsTransitioning(false);
    }, 1000);
  };
  
  // Get the current question
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  // Calculate the score
  const calculateScore = () => {
    // Here we're just showing how many questions they answered
    // You could implement any scoring system you want
    return `${answers.length}/${quizQuestions.length}`;
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-lg w-full text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Loading Hand Detection Model
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we set up the quiz...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes size={24} />
        </button>
        
        {isFinished ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Quiz Completed!
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Thank you for taking the habit quiz!
            </p>
            <div className="mb-6">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Score: {calculateScore()}
              </span>
            </div>
            <div className="space-y-4 max-w-md mx-auto text-left mb-8">
              <h3 className="font-medium text-lg text-gray-800 dark:text-white">Your Answers:</h3>
              {answers.map((answer, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="font-medium text-gray-800 dark:text-white">
                    Question {answer.question}: {quizQuestions[answer.question-1].question}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your answer: {quizQuestions[answer.question-1].options.find(opt => opt.value === answer.answer)?.text}
                  </p>
                </div>
              ))}
            </div>
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Finish
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Webcam view */}
              <div className="md:w-1/2">
                <div className="relative">
                  <Webcam
                    ref={webcamRef}
                    muted={true}
                    className="w-full rounded-lg"
                    style={{
                      transform: 'scaleX(-1)'  // Mirror the webcam
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      transform: 'scaleX(-1)'  // Mirror the canvas as well
                    }}
                  />
                  
                  {/* Finger count indicator */}
                  {fingerCount > 0 && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold">
                      {fingerCount}
                    </div>
                  )}
                  
                  {/* Countdown indicator */}
                  {fingerCount > 0 && fingerCount <= 5 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gray-800 bg-opacity-75 text-white px-4 py-2 rounded-full">
                        Selecting in {countdownTime}s
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mt-4">
                  <div className="flex items-center text-blue-700 dark:text-blue-300 mb-2">
                    <FaHandPaper className="mr-2" />
                    <h3 className="font-medium">How to Answer:</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Show 1-5 fingers to the camera to select your answer. Hold the pose for 2 seconds to confirm your choice.
                  </p>
                </div>
              </div>
              
              {/* Question and options */}
              <div className="md:w-1/2">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Question {currentQuestion.id} of {quizQuestions.length}
                  </h2>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(currentQuestion.id / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {currentQuestion.question}
                  </p>
                </div>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer
                        ${selectedOption === option.value ? 
                          'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 
                          'border-gray-300 dark:border-gray-600'}`}
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-medium mr-3">
                        {index + 1}
                      </div>
                      <span className="text-gray-800 dark:text-white">
                        {option.text}
                      </span>
                      
                      {/* Selection indicator */}
                      {fingerCount === index + 1 && (
                        <div className="ml-auto">
                          <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;