# 🎯 Gamified Habit Tracker

A full-stack web application that helps users build and maintain habits through gamification, AI assistance, and community engagement. Track your daily habits, earn rewards, unlock achievements, and compete on leaderboards while receiving personalized insights from an AI coach.

[![GitHub](https://img.shields.io/badge/GitHub-Vamshi377%2FHabit--Tracker-blue?logo=github)](https://github.com/Vamshi377/Habit-Tracker)
[![License](https://img.shields.io/badge/License-ISC-green)](#license)

## 🌟 Features

### 🎮 Gamification System
- **Experience & Leveling**: Earn XP for completing habits and progress through levels
- **Achievements**: Unlock badges for various milestones and accomplishments
- **Rewards**: Redeem points for special rewards and unlocks
- **Streaks**: Track continuous habit completion and maintain momentum
- **Leaderboard**: Compete with other users and see where you rank

### 📊 Habit Management
- Create, edit, and delete custom habits
- Set frequency (daily, weekly, monthly)
- Track habit completion history
- Detailed habit statistics and analytics
- Visual progress charts and performance metrics
- Deadline calendar view

### 🤖 AI Integration
- **AI Coach**: Get personalized advice and motivation from Gemini AI
- AI-powered habit recommendations
- Smart notifications and reminders
- Natural language habit creation

### 👥 Community Features
- **Community Posts**: Share your progress and celebrate wins
- Comment and interact with other users' posts
- Discover trending habits and best practices
- Build habits together as a community

### ⏰ Productivity Tools
- **Pomodoro Timer**: Built-in focus timer for productive work sessions
- **Quiz System**: Educational content to reinforce positive habits
- **Habit Roulette**: Gamified habit suggestion system

### 🎁 Additional Features
- **Dark/Light Theme**: Toggle between themes
- **Notifications**: Real-time notifications for achievements and community activity
- **Mystery Box**: Random reward generator for engagement
- **Daily Quotes**: Motivational quotes to inspire users
- **User Profiles**: Personalized profile pages with stats
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern UI library with hooks
- **Vite**: Lightning-fast build tool
- **Redux Toolkit**: State management
- **TailwindCSS**: Utility-first CSS framework
- **Chart.js**: Data visualization
- **Framer Motion**: Smooth animations
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **TensorFlow.js + HandPose**: Hand gesture detection for interactivity
- **React Webcam**: Webcam integration

### Backend
- **Express.js**: RESTful API server
- **MongoDB + Mongoose**: NoSQL database
- **JWT**: Authentication & authorization
- **bcryptjs**: Password hashing
- **Google Generative AI**: AI-powered features
- **CORS**: Cross-Origin Resource Sharing

## 📁 Project Structure

```
Gamified-Habit-Tracker/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   ├── pages/                   # Page components
│   │   ├── features/                # Redux slices & services
│   │   │   ├── achievements/
│   │   │   ├── ai/
│   │   │   ├── auth/
│   │   │   ├── habits/
│   │   │   ├── notifications/
│   │   │   └── rewards/
│   │   ├── app/                     # Redux store configuration
│   │   ├── context/                 # React context (theme)
│   │   ├── utils/                   # Utility functions
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                          # Express backend
│   ├── controllers/                 # Business logic
│   ├── models/                      # MongoDB schemas
│   ├── routes/                      # API endpoints
│   ├── middleware/                  # Express middleware
│   ├── server.js                    # Entry point
│   └── package.json
│
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Google Generative AI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Vamshi377/Habit-Tracker.git
cd Gamified-Habit-Tracker
```

2. **Set up Backend**
```bash
cd server
npm install
```

3. **Set up Frontend**
```bash
cd ../client
npm install
```

### Environment Configuration

**Backend (.env file in `server/` directory)**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_API_KEY=your_google_generative_ai_api_key
PORT=5000
```

**Frontend (.env file in `client/` directory)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Running the Application

### Start Backend Server
```bash
cd server
npm start
```
The API server will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd client
npm run dev
```
The frontend will be available at `http://localhost:5173` (or the port shown in terminal)

### Build for Production
```bash
# Frontend
cd client
npm run build

# Backend can be deployed as-is or built depending on your hosting
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Habits
- `GET /api/habits` - Get all user habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `GET /api/habits/:id` - Get habit details

### Achievements
- `GET /api/achievements` - Get user achievements
- `POST /api/achievements` - Create achievement

### Rewards
- `GET /api/rewards` - Get available rewards
- `POST /api/rewards/redeem` - Redeem reward

### Community
- `GET /api/community/posts` - Get all community posts
- `POST /api/community/posts` - Create post
- `POST /api/community/posts/:id/comments` - Add comment

### AI
- `POST /api/ai/chat` - Chat with AI coach
- `POST /api/ai/recommendations` - Get habit recommendations

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id` - Mark notification as read

## 🎮 How to Use

1. **Register/Login**: Create an account or sign in
2. **Create Habits**: Add habits you want to track
3. **Complete Habits**: Mark habits as complete daily to maintain streaks
4. **Earn Rewards**: Complete habits and achieve milestones to earn points
5. **Chat with AI**: Get personalized advice from the AI coach
6. **Engage Community**: Share your progress and see what others are doing
7. **Check Achievements**: Track your accomplishments and unlock badges

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.


## �👤 Author

**Vamshi**
- GitHub: [@Vamshi377](https://github.com/Vamshi377)
- Repository: [Habit-Tracker](https://github.com/Vamshi377/Habit-Tracker)

## 📞 Support

For support, open an issue on [GitHub Issues](https://github.com/Vamshi377/Habit-Tracker/issues).

## 🙏 Acknowledgments

- Google Generative AI API for AI capabilities
- TensorFlow.js for hand pose detection
- React ecosystem and community
- All contributors who have helped with this project

---

**Happy tracking! 🚀 Build better habits, one day at a time.** 🎯
