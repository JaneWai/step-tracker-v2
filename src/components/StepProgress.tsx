import React, { useMemo } from 'react'
import { StepEntry } from './StepTracker'

interface StepProgressProps {
  entries: StepEntry[]
}

const StepProgress: React.FC<StepProgressProps> = ({ entries }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    if (entries.length === 0) {
      return {
        totalSteps: 0,
        averageSteps: 0,
        bestDay: null as (StepEntry | null),
        goalAchievement: 0,
        streak: 0
      }
    }
    
    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    const totalSteps = entries.reduce((sum, entry) => sum + entry.achieved, 0)
    const averageSteps = Math.round(totalSteps / entries.length)
    
    // Find the day with most steps
    const bestDay = entries.reduce((best, entry) => 
      !best || entry.achieved > best.achieved ? entry : best
    , entries[0])
    
    // Calculate goal achievement rate
    const achievedGoals = entries.filter(entry => entry.achieved >= entry.goal).length
    const goalAchievement = Math.round((achievedGoals / entries.length) * 100)
    
    // Calculate current streak
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    
    // Check if there's an entry for today
    const hasTodayEntry = sortedEntries.some(entry => entry.date === today)
    
    if (hasTodayEntry) {
      streak = 1
      
      // Start checking from yesterday
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      let currentDate = yesterday
      
      while (true) {
        const dateString = currentDate.toISOString().split('T')[0]
        const hasEntry = sortedEntries.some(entry => entry.date === dateString)
        
        if (hasEntry) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
      }
    }
    
    return {
      totalSteps,
      averageSteps,
      bestDay,
      goalAchievement,
      streak
    }
  }, [entries])
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No step tracking data available yet.</p>
        <p className="text-gray-500 mt-2">Start tracking your steps today!</p>
      </div>
    )
  }
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Your Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Steps */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Total Steps</h3>
          <p className="text-3xl font-bold text-indigo-700">{stats.totalSteps.toLocaleString()}</p>
        </div>
        
        {/* Average Steps */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Average Steps</h3>
          <p className="text-3xl font-bold text-purple-700">{stats.averageSteps.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">per day</p>
        </div>
        
        {/* Best Day */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Best Day</h3>
          {stats.bestDay && (
            <>
              <p className="text-3xl font-bold text-blue-700">{stats.bestDay.achieved.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">on {formatDate(stats.bestDay.date)}</p>
            </>
          )}
        </div>
        
        {/* Goal Achievement */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Goal Achievement</h3>
          <p className="text-3xl font-bold text-green-700">{stats.goalAchievement}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="h-2.5 rounded-full bg-green-600" 
              style={{ width: `${stats.goalAchievement}%` }}
            ></div>
          </div>
        </div>
        
        {/* Current Streak */}
        <div className="md:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Current Streak</h3>
          <p className="text-3xl font-bold text-amber-700">{stats.streak} {stats.streak === 1 ? 'day' : 'days'}</p>
          <p className="text-sm text-gray-500 mt-1">Keep it going!</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Recent Activity</h3>
        
        <div className="space-y-4">
          {entries.slice(0, 5).map(entry => (
            <div key={entry.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{formatDate(entry.date)}</span>
                <span className={`text-sm font-medium ${entry.achieved >= entry.goal ? 'text-green-600' : 'text-gray-500'}`}>
                  {Math.round((entry.achieved / entry.goal) * 100)}% of goal
                </span>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{entry.achieved.toLocaleString()} steps</span>
                  <span>Goal: {entry.goal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${entry.achieved >= entry.goal ? 'bg-green-500' : 'bg-indigo-600'}`} 
                    style={{ width: `${Math.min(Math.round((entry.achieved / entry.goal) * 100), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StepProgress
