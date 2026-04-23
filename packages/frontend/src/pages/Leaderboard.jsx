import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaTrophy, FaMedal } from 'react-icons/fa';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
const API_URL=import.meta.env.VITE_BACKEND_URL
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/leaderboard`);
        console.log('Leaderboard API response:', response.data);

        // Adjust based on actual response format
        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        setLeaderboardData(data);
        console.log("data",leaderboardData)
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FaTrophy className="text-yellow-500" size={24} />;
      case 1:
        return <FaMedal className="text-gray-400" size={24} />;
      case 2:
        return <FaMedal className="text-amber-700" size={24} />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center font-bold">{index + 1}</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Leaderboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          See how you stack up against other players in the community
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Streak
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Longest Streak
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {leaderboardData.map((userData, index) => (
              <tr
                key={userData._id}
                className={`${
                  userData._id === user?._id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } hover:bg-gray-50 dark:hover:bg-gray-700/50`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center">{getRankIcon(index)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {userData.username}
                      {userData._id === user?._id ? (
                        <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(You)</span>
                      ) : (
                        <span className="ml-2 text-xs text-gray-500">{userData.username}</span>
                      )}
                    </div>

                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white font-semibold">
                    {userData.totalExperience || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {userData.level || 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {userData.experience || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {userData.streakCount || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {userData.longestStreak || 0}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Leaderboard;
