import React from 'react';

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaTrophy, 
  FaUsers, 
  FaBell, 
  FaChartLine, 
  FaRocket, 
  FaMobileAlt, 
  FaLock
} from 'react-icons/fa';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Features data
  const features = [
    {
      icon: <FaCheckCircle className="h-6 w-6 text-blue-500" />,
      title: "Easy Habit Tracking",
      description: "Create and track daily habits with a simple, intuitive interface. Mark completions with a single click."
    },
    {
      icon: <FaTrophy className="h-6 w-6 text-amber-500" />,
      title: "Gamified Experience",
      description: "Earn XP, level up, and unlock achievements as you build consistent habits."
    },
    {
      icon: <FaChartLine className="h-6 w-6 text-green-500" />,
      title: "Visual Progress",
      description: "See your progress with detailed statistics, streaks, and completion history."
    },
    {
      icon: <FaBell className="h-6 w-6 text-purple-500" />,
      title: "Smart Reminders",
      description: "Set customized reminders to keep you on track with your habit goals."
    },
    {
      icon: <FaUsers className="h-6 w-6 text-indigo-500" />,
      title: "Community Support",
      description: "Share progress with others, gain inspiration, and celebrate achievements."
    },
    {
      icon: <FaMobileAlt className="h-6 w-6 text-orange-500" />,
      title: "Mobile Friendly",
      description: "Access your habit tracker anywhere, on any device with our responsive design."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Fitness Enthusiast",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
      quote: "HabitQuest turned my sporadic workout routine into a daily habit. The streaks and achievements keep me motivated like nothing else!"
    },
    {
      name: "Sarah Williams",
      role: "Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
      quote: "As a busy student, I needed something to help me build better study habits. The rewards system makes it feel like a game, not a chore."
    },
    {
      name: "Michael Chen",
      role: "Software Developer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80",
      quote: "I've tried many habit trackers but this one actually sticks. The community feature helps me stay accountable and share tips with others."
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Transform Your Habits, Level Up Your Life
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                The gamified habit tracker that helps you build consistent habits through rewards, achievements, and community support.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/register" 
                  className="inline-flex justify-center items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex justify-center items-center px-6 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 transition border border-blue-400"
                >
                  Log In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://placehold.co/600x400/2563eb/FFFFFF/png?text=HabitQuest+Dashboard&font=Montserrat" 
                alt="HabitQuest App Screenshot" 
                className="rounded-lg shadow-2xl max-w-full h-auto border-4 border-white/20" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Powerful Features to Build Better Habits</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to develop consistent habits and achieve your goals, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="mb-4 inline-block p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">How HabitQuest Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A simple process to help you build habits that stick.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Create Your Habits</h3>
              <p className="text-gray-600 dark:text-gray-400">Define the habits you want to build, set frequency, and customize reminders.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Track Your Progress</h3>
              <p className="text-gray-600 dark:text-gray-400">Check in daily to mark habits complete and build streaks that motivate you to continue.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Earn Rewards</h3>
              <p className="text-gray-600 dark:text-gray-400">Level up, earn badges, and unlock achievements as you maintain consistency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands who are transforming their habits with HabitQuest.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover" 
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="flex-1 text-gray-600 dark:text-gray-400 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Habits?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join HabitQuest today and start building the habits that will help you achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/register" 
              className="inline-flex justify-center items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition shadow-lg"
            >
              <FaRocket className="mr-2" /> Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="inline-flex justify-center items-center px-6 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 transition border border-blue-400"
            >
              Already have an account? Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-8 px-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            <div className="flex items-center">
              <FaLock className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Secure & Private</span>
            </div>
            <div className="flex items-center">
              <FaMobileAlt className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Works on All Devices</span>
            </div>
            <div className="flex items-center">
              <FaUsers className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">5,000+ Active Users</span>
            </div>
            <div className="flex items-center">
              <FaTrophy className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">100+ Achievements to Earn</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;