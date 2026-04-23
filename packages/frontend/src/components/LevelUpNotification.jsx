import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LevelUpNotification = ({ show, onClick }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-20 left-4 z-50" // Changed from right-4 to left-4
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
          >
            <span className="text-2xl mr-2">🎁</span>
            <div className="text-left">
              <div className="font-bold">Open the Magical Box</div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpNotification;