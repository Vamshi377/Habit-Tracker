import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { collectReward } from '../features/rewards/rewardSlice';

const MysteryBox = ({ isOpen, onClose, level }) => {
  const [boxOpened, setBoxOpened] = useState(false);
  const [reward, setReward] = useState(null);
  const [collecting, setCollecting] = useState(false);
  const dispatch = useDispatch();

  const rewards = [
    { type: 'avatar', icon: '🧑‍🎨', title: 'New Avatar', description: 'You unlocked a new avatar!' },
    { type: 'xpBoost', icon: '🔥', title: 'XP Boost', description: 'XP Boost Activated: 2x XP for 24h!' },
    { type: 'badge', icon: '🏅', title: 'Rare Badge', description: 'You unlocked a Rare Badge!' },
    { type: 'emoji', icon: '😄', title: 'Unique Emoji Reaction', description: 'You unlocked a new emoji reaction!' }
  ];

  useEffect(() => {
    if (isOpen && !boxOpened) {
      // Reset state when modal is opened
      setBoxOpened(false);
      setReward(null);
      setCollecting(false);

      // Automatically open the box after 2 seconds
      const timer = setTimeout(() => {
        openBox();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const openBox = () => {
    setBoxOpened(true);
    
    // Get random reward
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    setReward(randomReward);
    
    // Trigger confetti animation
    setTimeout(triggerConfetti, 100);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCollect = async () => {
    if (!reward) return;
    
    setCollecting(true);
    try {
      // Dispatch action to add reward to user's collection
      await dispatch(collectReward({
        type: reward.type,
        title: reward.title,
        description: reward.description,
        icon: reward.icon
      })).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Error collecting reward:', error);
    } finally {
      setCollecting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 text-center relative"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Level {level} Reward!
            </h2>

            {!boxOpened ? (
              <motion.div 
                animate={{ 
                  rotate: [0, -5, 5, -5, 5, 0],
                  scale: [1, 1.05, 1, 1.05, 1]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "loop" 
                }}
                className="flex justify-center my-8"
              >
                <div className="relative w-40 h-40">
                  <motion.div
                    animate={{
                      boxShadow: ["0px 0px 0px rgba(59, 130, 246, 0)", "0px 0px 20px rgba(59, 130, 246, 0.7)", "0px 0px 0px rgba(59, 130, 246, 0)"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <span className="text-8xl filter drop-shadow-md">🎁</span>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="py-6"
              >
                <div className="mb-6">
                  <span className="text-7xl filter drop-shadow-lg">{reward?.icon}</span>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-4">
                    {reward?.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {reward?.description}
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleCollect}
                    disabled={collecting}
                    className="px-4 py-2 bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50 rounded-md transition font-medium flex items-center disabled:opacity-50"
                  >
                    {collecting ? (
                      <>
                        <span className="mr-2 animate-spin">⏳</span> Collecting...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">📥</span> Collect
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 rounded-md transition font-medium"
                    disabled={collecting}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MysteryBox;