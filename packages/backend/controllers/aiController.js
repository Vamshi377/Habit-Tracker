const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// @desc    Send message to AI with user habits data
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
  try {
    const { message, habitData, previousMessages } = req.body;
    
    // Validate request
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    // Get Gemini API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ message: 'Gemini API key not configured' });
    }
    
    console.log('Habit data received:', JSON.stringify(habitData, null, 2));
    
    // Set to false to use mock responses, true to use Gemini API
    const useGeminiAPI = true;
    
    if (!useGeminiAPI) {
      console.log('Using mock response for better reliability');
      const mockResponse = generateMockResponse(message, habitData, previousMessages);
      return res.json({ response: mockResponse });
    }
    
    // Prepare the prompt for Gemini with the raw habit data
    const prompt = `
You are a helpful AI assistant for a habit tracking app called "Habit Tracker". The user has the following habits data:
${JSON.stringify(habitData, null, 2)}

The user is asking: "${message}"

Please provide a helpful, personalized response based on their habits and data. Be conversational and friendly.
Some guidelines:
- If they ask about their habits, analyze their data and provide insights
- If they ask for advice, offer suggestions relevant to their specific habits
- If they ask about you, introduce yourself as their habit assistant
- If they ask about the app or "is this app good", talk about how Habit Tracker helps them track ${habitData?.habitCount || 'several'} habits and mention specific features like streak tracking, AI assistance, etc.
- Keep responses concise and focused on helping them with their habits

Respond directly to the user:
`;
    
    console.log('Sending request to Gemini API...');
    
    try {
      // Use the correct Gemini API endpoint
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Gemini API response received');
      
      // Handle the response
      if (response.data && response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
        const aiResponse = response.data.candidates[0].content.parts[0].text;
        return res.json({ response: aiResponse });
      } else {
        console.log('Unexpected Gemini API response format, falling back to mock response');
        const mockResponse = generateMockResponse(message, habitData, previousMessages);
        return res.json({ response: mockResponse });
      }
    } catch (error) {
      console.error('Gemini API error:', error.response?.data || error.message);
      
      // Fall back to mock response on API error
      console.log('Falling back to mock response due to API error');
      const mockResponse = generateMockResponse(message, habitData, previousMessages);
      return res.json({ response: mockResponse });
    }
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      message: 'Server error processing AI chat request', 
      error: error.message 
    });
  }
};

// Helper function to generate mock responses
const generateMockResponse = (message, habitData, previousMessages) => {
  // Extract habit data for personalized responses
  const habitCount = habitData?.habitCount || 'several';
  const completedToday = habitData?.completedToday || 'some';
  const activeHabits = habitData?.activeHabits || 'a few';
  const habits = habitData?.habits || [];
  const habitNames = habits.map(h => h.name || 'unnamed habit').join(', ') || 'various habits';
  
  // Check if this is a follow-up question
  const isFollowUp = previousMessages && previousMessages.length > 0;
  const lastMessage = isFollowUp ? previousMessages[previousMessages.length - 1] : null;
  
  // Get specific habit categories
  const learningHabits = habits.filter(h => h.category?.toLowerCase() === 'learning');
  const healthHabits = habits.filter(h => 
    h.category?.toLowerCase() === 'health' || 
    h.name?.toLowerCase().includes('exercise') || 
    h.name?.toLowerCase().includes('diet')
  );
  
  // User level and experience
  const userLevel = habitData?.user?.level || 1;
  const userExperience = habitData?.user?.experience || 0;
  
  // Check message type and generate appropriate response
  if (message.toLowerCase().includes('introduce yourself')) {
    return "Hello! I'm your Habit Assistant AI. I can analyze your habits and provide personalized advice to help you build better routines and achieve your goals. How can I help you today?";
  } else if (message.toLowerCase().includes('how are my habits') || 
             message.toLowerCase().includes('what about my habits') ||
             message.toLowerCase().includes('analyze my habits')) {
    let response = `Based on your data, you're tracking ${habitCount} habits (${habitNames}), with ${completedToday} completed today. `;
    
    if (learningHabits.length > 0) {
      response += `I notice you have ${learningHabits.length} learning-related habits: ${learningHabits.map(h => h.name).join(', ')}. This shows you value personal growth and skill development. `;
    }
    
    if (healthHabits.length > 0) {
      response += `You also have ${healthHabits.length} health-related habits: ${healthHabits.map(h => h.name).join(', ')}. This demonstrates your commitment to physical wellbeing. `;
    }
    
    response += `You're currently at level ${userLevel} with ${userExperience} experience points. `;
    response += `Overall, you're making good progress with your habit tracking. Would you like specific advice on any particular habit?`;
    
    return response;
  } else if (message.toLowerCase().includes('what about me') || 
             message.toLowerCase().includes('what do you think of me') || 
             message.toLowerCase().includes('what do u think of my habits') ||
             message.toLowerCase().includes('what kind of person') ||
             message.toLowerCase().includes('who am i')) {
    let response = `Based on your habit data, I can see you're tracking ${habitCount} habits (${habitNames}). `;
    
    if (habits.some(h => h.name?.toLowerCase().includes('mern') || h.name?.toLowerCase().includes('programming'))) {
      response += `Your focus on tech skills like MERN stack and competitive programming suggests you're a developer or aspiring to be one. `;
    }
    
    if (habits.some(h => h.name?.toLowerCase().includes('exercise') || h.name?.toLowerCase().includes('diet'))) {
      response += `You also value physical health with habits like exercise and balanced diet. `;
    }
    
    response += `Your habits suggest you're a person who values self-improvement and personal growth. `;
    response += `You have ${activeHabits} active habits, which shows commitment and discipline. `;
    response += `I think you're doing well in building consistent routines and working towards becoming your best self. `;
    response += `Would you like some specific advice on how to optimize your current habits or suggestions for new ones to add?`;
    
    return response;
  } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('advice')) {
    let response = "I'd be happy to help! Based on your habits, here are some personalized suggestions:\n\n";
    
    if (habits.some(h => h.name?.toLowerCase().includes('mern'))) {
      response += "1. For learning MERN stack, try the 'project-based learning' approach - build small applications that use all parts of the stack\n";
    }
    
    if (habits.some(h => h.name?.toLowerCase().includes('programming'))) {
      response += "2. For competitive programming, set aside specific practice times and focus on one algorithm type per week\n";
    }
    
    if (habits.some(h => h.name?.toLowerCase().includes('exercise'))) {
      response += "3. For exercise, try to complete it early in the day when your motivation is highest\n";
    }
    
    if (habits.some(h => h.name?.toLowerCase().includes('diet'))) {
      response += "4. For maintaining a balanced diet, meal prep on weekends can help ensure you have healthy options ready\n";
    }
    
    response += "\nWould you like more specific advice about any of your habits?";
    return response;
  } else if (message.toLowerCase().includes('improve') || 
             (isFollowUp && message.toLowerCase().includes('how') && 
              (message.toLowerCase().includes('improve') || message.toLowerCase().includes('better')))) {
    
    // Specific advice for improving habits
    let response = "Here are personalized tips for improving each of your habits:\n\n";
    
    // Learning MERN stack
    if (habits.some(h => h.name?.toLowerCase().includes('mern'))) {
      response += "📚 **MERN Stack Learning**:\n";
      response += "1. Set specific sub-goals (e.g., 'Build a simple API with Express this week')\n";
      response += "2. Follow structured courses on platforms like Udemy or freeCodeCamp\n";
      response += "3. Build a personal project that uses all parts of the stack\n";
      response += "4. Join MERN stack communities on Discord or Reddit for support\n\n";
    }
    
    // Competitive Programming
    if (habits.some(h => h.name?.toLowerCase().includes('programming'))) {
      response += "💻 **Competitive Programming**:\n";
      response += "1. Practice on platforms like LeetCode, HackerRank, or Codeforces daily\n";
      response += "2. Study one algorithm or data structure deeply each week\n";
      response += "3. Participate in weekly coding contests\n";
      response += "4. Review others' solutions after completing problems\n\n";
    }
    
    // Exercise
    if (habits.some(h => h.name?.toLowerCase().includes('exercise'))) {
      response += "🏃 **Exercise**:\n";
      response += "1. Schedule workouts at the same time each day to build consistency\n";
      response += "2. Start with shorter, more frequent sessions if you're struggling\n";
      response += "3. Find an accountability partner or join a fitness class\n";
      response += "4. Track progress with specific metrics (reps, distance, time)\n\n";
    }
    
    // Balanced Diet
    if (habits.some(h => h.name?.toLowerCase().includes('diet'))) {
      response += "🥗 **Balanced Diet**:\n";
      response += "1. Meal prep on weekends to ensure healthy options are always available\n";
      response += "2. Use the plate method: half vegetables, quarter protein, quarter carbs\n";
      response += "3. Keep a food journal to identify patterns and triggers\n";
      response += "4. Allow occasional treats to avoid feeling deprived\n\n";
    }
    
    // Mathematics
    if (habits.some(h => h.name?.toLowerCase().includes('math'))) {
      response += "🔢 **Mathematics Practice**:\n";
      response += "1. Use spaced repetition to review concepts regularly\n";
      response += "2. Practice with increasingly difficult problems\n";
      response += "3. Teach concepts to others to solidify understanding\n";
      response += "4. Connect math concepts to real-world applications\n\n";
    }
    
    response += "The key to improvement is consistency and deliberate practice. Focus on making small, sustainable changes rather than trying to transform everything at once. Would you like more specific advice on any particular habit?";
    
    return response;
  } else if (message.toLowerCase().includes('streak') || message.toLowerCase().includes('consistent')) {
    return "Consistency is key to habit formation! Here are some tips to maintain your streaks:\n\n" +
      "1. Never miss twice - if you break a streak, get back on track immediately\n" +
      "2. Use visual reminders like calendar markings or the app's streak counter\n" +
      "3. Create accountability by sharing your goals with others\n" +
      "4. Reward yourself for milestone streaks (7 days, 30 days, etc.)\n\n" +
      "Remember, it's not about being perfect, but about being consistent over time.";
  } else if (message.toLowerCase().includes('motivation') || message.toLowerCase().includes('struggle')) {
    return "It's normal to struggle with motivation sometimes. Here are some strategies that might help:\n\n" +
      "1. Make your habits smaller and easier to accomplish\n" +
      "2. Connect your habits to your deeper values and goals\n" +
      "3. Create environmental triggers that remind you to perform your habits\n" +
      "4. Find an accountability partner or join a community with similar goals\n\n" +
      "Remember that motivation often follows action, not the other way around. Sometimes you need to start the habit even when you don't feel like it.";
  } else if (message.toLowerCase().includes('morning') || message.toLowerCase().includes('routine')) {
    return "Morning routines are powerful for setting up your day for success! Here's a suggested routine:\n\n" +
      "1. Wake up at the same time each day (even weekends)\n" +
      "2. Drink a glass of water first thing\n" +
      "3. Get some natural light exposure\n" +
      "4. Do a brief movement or exercise session\n" +
      "5. Spend 5-10 minutes on mindfulness or planning your day\n\n" +
      "Would you like help incorporating any of these into your existing habits?";
  } else if (message.toLowerCase().includes('evening') || message.toLowerCase().includes('night')) {
    return "Evening routines help signal to your body it's time to wind down. Consider:\n\n" +
      "1. Setting a technology cut-off time (1-2 hours before bed)\n" +
      "2. Doing a brief tidying session to wake up to a clean space\n" +
      "3. Reflecting on 3 good things from your day\n" +
      "4. Reading or journaling\n" +
      "5. Consistent sleep and wake times\n\n" +
      "Which of these would you like to incorporate into your routine?";
  } else if (message.toLowerCase().includes('thank')) {
    return "You're welcome! I'm here to support your habit-building journey. Remember that consistency is more important than perfection. Is there anything else I can help you with today?";
  } else if (message.toLowerCase().includes('hi') || 
             message.toLowerCase().includes('hello') || 
             message.toLowerCase().includes('hey')) {
    return `Hello! I'm your habit assistant. I see you're tracking ${habitCount} habits including ${habitNames}. How can I help you with your habit journey today?`;
  } else if (message.toLowerCase().includes('app') || 
             message.toLowerCase().includes('this app good') ||
             message.toLowerCase().includes('habit tracker')) {
    return `Based on what I can see, Habit Tracker is helping you manage ${habitCount} different habits including ${habitNames}. The app offers several useful features like streak tracking (your current streak is ${habitData?.user?.streakCount || 0} days), experience points (you're at level ${userLevel} with ${userExperience} XP), and AI assistance to provide personalized advice. 
    
The app's strength is in helping you build consistency with daily habit tracking and providing motivation through gamification elements. It also gives you insights into your progress over time. Is there a specific feature you'd like to know more about or something you'd like to see improved?`;
  } else {
    // Default response
    let response = "Thank you for your message. As your habit assistant, I'm here to help you build better routines and achieve your goals. ";
    response += `I notice you have ${habitCount} habits tracked (${habitNames}), with ${completedToday} completed today. `;
    
    if (habits.length > 0) {
      const randomHabit = habits[Math.floor(Math.random() * habits.length)];
      response += `For your "${randomHabit.name}" habit, remember that consistency is key. `;
    }
    
    response += "Would you like some specific advice about your habits, or general tips for building consistent routines?";
    return response;
  }
};

module.exports = {
  chatWithAI
};
