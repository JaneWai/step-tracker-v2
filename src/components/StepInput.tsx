import React, { useState, useEffect } from 'react'
import { StepEntry } from './StepTracker'

interface StepInputProps {
  onSubmit: (goal: number, achieved: number) => void
  todayEntry?: StepEntry
}

const StepInput: React.FC<StepInputProps> = ({ onSubmit, todayEntry }) => {
  const [goal, setGoal] = useState(todayEntry?.goal || 10000)
  const [achieved, setAchieved] = useState(todayEntry?.achieved || 0)
  
  // Update form when todayEntry changes
  useEffect(() => {
    if (todayEntry) {
      setGoal(todayEntry.goal)
      setAchieved(todayEntry.achieved)
    }
  }, [todayEntry])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(goal, achieved)
  }
  
  const completion = goal > 0 ? Math.min(Math.round((achieved / goal) * 100), 100) : 0
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Step Tracking</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
            Step Goal
          </label>
          <input
            type="number"
            id="goal"
            min="1"
            value={goal}
            onChange={(e) => setGoal(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your step goal"
            required
          />
        </div>
        
        <div>
          <label htmlFor="achieved" className="block text-sm font-medium text-gray-700 mb-1">
            Steps Achieved
          </label>
          <input
            type="number"
            id="achieved"
            min="0"
            value={achieved}
            onChange={(e) => setAchieved(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter steps achieved"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${completion >= 100 ? 'bg-green-500' : 'bg-indigo-600'}`} 
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {completion >= 100 ? (
              <span className="text-green-600 font-medium">Goal achieved! 🎉</span>
            ) : (
              <span>{goal - achieved} steps remaining</span>
            )}
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {todayEntry ? 'Update Steps' : 'Save Steps'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StepInput
