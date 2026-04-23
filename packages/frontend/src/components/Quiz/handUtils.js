import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

// Draw hand landmarks on canvas
export const drawHand = (predictions, ctx) => {
  // Check if we have predictions
  if (predictions.length > 0) {
    // Loop through each prediction
    predictions.forEach((prediction) => {
      // Extract landmarks
      const landmarks = prediction.landmarks;

      // Loop through fingers
      for (let j = 0; j < landmarks.length; j++) {
        const point = landmarks[j];
        // Draw point
        ctx.beginPath();
        ctx.arc(point[0], point[1], 5, 0, 3 * Math.PI);
        
        // Set line color
        ctx.fillStyle = j === 0 ? "purple" : "gold";
        ctx.fill();
      }
      
      // Draw skeleton
      const fingers = Object.keys(fingerJoints);
      for (let i = 0; i < fingers.length; i++) {
        const finger = fingers[i];
        const points = fingerJoints[finger];
        
        for (let j = 0; j < points.length - 1; j++) {
          const firstIdx = points[j];
          const secondIdx = points[j + 1];
          
          // Draw path
          ctx.beginPath();
          ctx.moveTo(landmarks[firstIdx][0], landmarks[firstIdx][1]);
          ctx.lineTo(landmarks[secondIdx][0], landmarks[secondIdx][1]);
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });
  }
};

// Finger joints
const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// Count fingers based on hand landmarks
export const countFingers = (predictions) => {
  if (!predictions || predictions.length === 0) return 0;
  
  const prediction = predictions[0]; // Get the first hand detected
  const landmarks = prediction.landmarks;
  
  // Finger tips are at indices: 4 (thumb), 8 (index), 12 (middle), 16 (ring), 20 (pinky)
  // Their bases are at 2, 5, 9, 13, 17
  
  // We'll detect a raised finger if its tip's y position is significantly higher than its base
  let fingerCount = 0;
  
  // Thumb (different detection logic because thumb moves laterally)
  const thumbTip = landmarks[4];
  const thumbBase = landmarks[2];
  
  // For thumb, compare x positions based on which hand is detected (left or right)
  // If the thumb tip is significantly to the side of the thumb base, it's extended
  if (Math.abs(thumbTip[0] - thumbBase[0]) > 30) {
    fingerCount++;
  }
  
  // Other fingers
  const fingerTips = [8, 12, 16, 20]; // index, middle, ring, pinky tips
  const fingerBases = [5, 9, 13, 17]; // corresponding bases
  
  for (let i = 0; i < fingerTips.length; i++) {
    const tipY = landmarks[fingerTips[i]][1];
    const baseY = landmarks[fingerBases[i]][1];
    
    // If tip is higher than base, finger is extended
    if (tipY < baseY - 30) { // 30 pixel threshold for noise reduction
      fingerCount++;
    }
  }
  
  return fingerCount;
};