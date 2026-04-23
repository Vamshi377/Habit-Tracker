import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAchievements } from '../features/achievements/achievementSlice'
import AchievementCard from '../components/AchievementCard'
import { FaTrophy } from 'react-icons/fa'

const Achievements = () => {
  const dispatch = useDispatch()
  const { achievements, isLoading } = useSelector((state) => state.achievements)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getAchievements())
  }, [dispatch])

  const groupedAchievements = Array.isArray(achievements)
    ? achievements.reduce((acc, achievement) => {
        if (!acc[achievement.type]) acc[achievement.type] = []
        acc[achievement.type].push(achievement)
        return acc
      }, {})
    : {}

  const isAchievementUnlocked = (achievementId) => {
    return user?.achievements?.some((a) => a === achievementId || a._id === achievementId)
  }

  const totalAchievements = Array.isArray(achievements) ? achievements.length : 0
  const unlockedAchievements = user?.achievements?.length || 0
  const completionPercentage =
    totalAchievements > 0 ? Math.round((unlockedAchievements / totalAchievements) * 100) : 0

  const achievementTypes = {
    streak: {
      name: 'Streak Achievements',
      description: 'Maintain consistent streaks of habit completion'
    },
    completion: {
      name: 'Completion Achievements',
      description: 'Complete habits a certain number of times'
    },
    level: {
      name: 'Level Achievements',
      description: 'Reach specific levels in your journey'
    },
    community: {
      name: 'Community Achievements',
      description: 'Engage with the community and share your progress'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Achievements</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your progress and earn badges by maintaining streaks and completing habits
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
            <FaTrophy className="mr-2 text-amber-500" />
            Your Achievement Progress
          </h2>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {unlockedAchievements} of {totalAchievements} achievements unlocked
        </div>
      </div>

      {Object.entries(achievementTypes).map(([type, { name, description }]) => (
        <div key={type} className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedAchievements[type]?.length > 0 ? (
              groupedAchievements[type].map((achievement) => (
                <AchievementCard
                  key={achievement._id}
                  achievement={achievement}
                  unlocked={isAchievementUnlocked(achievement._id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-500 dark:text-gray-400">
                  No {name.toLowerCase()} available yet
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

export default Achievements


