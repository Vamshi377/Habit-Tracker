import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

const QuizButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md hover:from-purple-700 hover:to-blue-600 transition shadow-md"
    >
      <FaQuestionCircle className="mr-2" />
      Take Habit Quiz
    </button>
  );
};

export default QuizButton;