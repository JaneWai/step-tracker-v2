import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { StepEntry } from './StepTracker'

interface CalendarViewProps {
  entries: StepEntry[]
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Get first day of the month and total days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  // Previous and next month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }
  
  // Format month name
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  
  // Create calendar days array
  const calendarDays = []
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }
  
  // Get entries for the current month
  const entriesMap = entries.reduce((acc, entry) => {
    const entryDate = new Date(entry.date)
    if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
      acc[entryDate.getDate()] = entry
    }
    return acc
  }, {} as Record<number, StepEntry>)
  
  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {monthName} {currentYear}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {/* Day names */}
        {dayNames.map(day => (
          <div key={day} className="text-center font-medium text-gray-500 text-sm py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-24 p-2 border border-gray-100 bg-gray-50"></div>
          }
          
          const entry = entriesMap[day]
          const today = new Date()
          const isToday = day === today.getDate() && 
                          currentMonth === today.getMonth() && 
                          currentYear === today.getFullYear()
          
          return (
            <div 
              key={`day-${day}`} 
              className={`h-24 p-2 border border-gray-200 overflow-hidden ${
                isToday ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                  {day}
                </span>
                {entry && (
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      entry.achieved >= entry.goal ? 'bg-green-500' : 'bg-indigo-500'
                    }`}
                  ></div>
                )}
              </div>
              
              {entry && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-600">
                    Goal: {entry.goal.toLocaleString()}
                  </div>
                  <div className="text-xs font-medium text-gray-600">
                    Achieved: {entry.achieved.toLocaleString()}
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        entry.achieved >= entry.goal ? 'bg-green-500' : 'bg-indigo-600'
                      }`} 
                      style={{ width: `${Math.min(Math.round((entry.achieved / entry.goal) * 100), 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarView
