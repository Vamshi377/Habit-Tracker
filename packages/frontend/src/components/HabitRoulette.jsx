import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, useAnimation } from 'framer-motion';
import { FiRotateCw } from 'react-icons/fi';
import { GiSpinningBlades, GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { completeHabit } from '../features/habits/habitSlice';

const HabitRoulette = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
  const { habits = [] } = useSelector(state => state.habits || { habits: [] });
  const dispatch = useDispatch();
  const controls = useAnimation();
  const wheelRef = useRef(null);
  
  // Filter only active habits
  const activeHabits = habits?.filter(habit => habit?.active && !habit?.completedToday) || [];
  
  const spinWheel = () => {
    if (activeHabits.length === 0) {
      toast.info('No active uncompleted habits to spin for!');
      return;
    }
    
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedHabit(null);
    
    // Calculate a random number of full rotations (2-5) plus a random position
    const rotations = 2 + Math.floor(Math.random() * 3); // 2-4 full rotations
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotations * 360 + randomAngle;
    
    // Calculate which habit will be selected based on the final position
    const segmentSize = 360 / activeHabits.length;
    const selectedIndex = Math.floor(randomAngle / segmentSize);
    const selected = activeHabits[selectedIndex];
    
    // Animate the wheel
    controls.start({
      rotate: totalRotation,
      transition: { 
        duration: 3,
        ease: [0.2, 0.9, 0.1, 1] // Custom easing for a realistic spin effect
      }
    }).then(() => {
      setIsSpinning(false);
      setRotationDegree(totalRotation);
      setSelectedHabit(selected);
      setShowModal(true);
    });
  };
  
  const completeSelectedHabit = () => {
    if (selectedHabit) {
      dispatch(completeHabit(selectedHabit._id));
      toast.success(`Great job completing "${selectedHabit.name}"!`);
      setShowModal(false);
    }
  };
  
  const skipSelectedHabit = () => {
    toast.info(`You'll do "${selectedHabit.name}" later.`);
    setShowModal(false);
  };
  
  // Generate colors for the wheel segments
  const getSegmentColor = (index) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', 
      '#118AB2', '#073B4C', '#84BCDA', '#EF476F',
      '#FFC43D', '#1B9AAA', '#F25F5C', '#50514F'
    ];
    return colors[index % colors.length];
  };
  
  // Create a mini-wheel for the button icon
  const renderMiniWheel = () => {
    return (
      <div className="relative w-5 h-5">
        <div className="absolute inset-0 rounded-full border-2 border-white"></div>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 50%, 0% 0%, 50% 0%)', backgroundColor: '#FF6B6B' }}></div>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%)', backgroundColor: '#4ECDC4' }}></div>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 50%, 100% 0%, 100% 50%)', backgroundColor: '#FFD166' }}></div>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%)', backgroundColor: '#06D6A0' }}></div>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 50%, 100% 100%, 50% 100%)', backgroundColor: '#118AB2' }}></div>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%)', backgroundColor: '#EF476F' }}></div>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 50%, 0% 100%, 0% 50%)', backgroundColor: '#FFC43D' }}></div>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(50% 50%, 0% 50%, 0% 0%)', backgroundColor: '#1B9AAA' }}></div>
        <div className={`absolute inset-0 ${isSpinning ? 'animate-spin' : ''}`} style={{ animationDuration: '0.8s' }}>
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2"></div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <button
        onClick={spinWheel}
        disabled={isSpinning || activeHabits.length === 0}
        className="flex items-center justify-center p-2 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors"
        title="Spin the Habit Roulette"
      >
        {renderMiniWheel()}
        <span className="ml-2 hidden md:inline">Habit Roulette</span>
      </button>
      
      {/* Modal for wheel animation and result */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4">Your Random Habit</h2>
            <div className="text-center mb-6">
              <div className="text-xl font-semibold text-primary mb-2">{selectedHabit?.name}</div>
              <p className="text-gray-600">{selectedHabit?.description}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={completeSelectedHabit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Complete Now
              </button>
              <button
                onClick={skipSelectedHabit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Full Roulette Wheel Modal */}
      {isSpinning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4">Habit Roulette</h2>
            
            {/* Wheel Container */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              {/* Spinning Wheel */}
              <motion.div 
                className="w-full h-full rounded-full relative overflow-hidden"
                animate={controls}
                ref={wheelRef}
                style={{ 
                  transformOrigin: 'center',
                  boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                }}
              >
                {/* Wheel Segments */}
                {activeHabits.map((habit, index) => {
                  const segmentSize = 360 / activeHabits.length;
                  const startAngle = index * segmentSize;
                  const endAngle = (index + 1) * segmentSize;
                  
                  return (
                    <div 
                      key={habit._id}
                      className="absolute top-0 left-0 w-full h-full"
                      style={{
                        clipPath: `path('M 32 32 L 32 0 A 32 32 0 ${startAngle > 180 ? 1 : 0} 1 ${
                          32 + 32 * Math.cos((endAngle * Math.PI) / 180)
                        } ${32 + 32 * Math.sin((endAngle * Math.PI) / 180)} Z')`,
                        backgroundColor: getSegmentColor(index),
                        transform: `rotate(${startAngle}deg)`,
                        transformOrigin: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div 
                        className="text-white font-bold text-xs truncate max-w-[50px] text-center"
                        style={{
                          transform: `rotate(${segmentSize / 2}deg)`,
                          marginLeft: '40px'
                        }}
                      >
                        {habit.name}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
              
              {/* Center Point and Pointer */}
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-md"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-3 h-8 bg-red-500 rounded-t-full"></div>
              </div>
            </div>
            
            <p className="text-center text-gray-600 mb-4">Spinning the wheel of habits...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default HabitRoulette;
