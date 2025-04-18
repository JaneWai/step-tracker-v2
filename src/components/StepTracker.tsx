import React, { useState, useEffect } from 'react'
import { 
  Target, 
  TrendingUp, 
  Award, 
  Calendar, 
  BarChart3, 
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react'
import StepInput from './StepInput'
import StepHistory from './StepHistory'
import StepProgress from './StepProgress'
import CalendarView from './CalendarView'

export interface StepEntry {
  id: string
  date: string
  goal: number
  achieved: number
}

const StepTracker: React.FC = () => {
  const [entries, setEntries] = useState<StepEntry[]>(() => {
    const savedEntries = localStorage.getItem('stepEntries')
    return savedEntries ? JSON.parse(savedEntries) : []
  })
  
  const [activeTab, setActiveTab] = useState<'input' | 'history' | 'progress' | 'calendar'>('input')
  const [editingEntry, setEditingEntry] = useState<StepEntry | null>(null)

  useEffect(() => {
    localStorage.setItem('stepEntries', JSON.stringify(entries))
  }, [entries])

  const addEntry = (goal: number, achieved: number) => {
    const today = new Date().toISOString().split('T')[0]
    
    // Check if an entry for today already exists
    const existingEntryIndex = entries.findIndex(entry => entry.date === today)
    
    if (existingEntryIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...entries]
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        goal,
        achieved
      }
      setEntries(updatedEntries)
    } else {
      // Add new entry
      const newEntry: StepEntry = {
        id: crypto.randomUUID(),
        date: today,
        goal,
        achieved
      }
      setEntries([newEntry, ...entries])
    }
  }

  const updateEntry = (updatedEntry: StepEntry) => {
    setEntries(entries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ))
    setEditingEntry(null)
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  const startEditing = (entry: StepEntry) => {
    setEditingEntry({...entry})
  }

  const cancelEditing = () => {
    setEditingEntry(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex border-b overflow-x-auto">
        <button 
          className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'input' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('input')}
        >
          <Target size={18} />
          <span>Today's Steps</span>
        </button>
        <button 
          className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('history')}
        >
          <Calendar size={18} />
          <span>History</span>
        </button>
        <button 
          className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'calendar' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('calendar')}
        >
          <TrendingUp size={18} />
          <span>Calendar</span>
        </button>
        <button 
          className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'progress' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('progress')}
        >
          <BarChart3 size={18} />
          <span>Progress</span>
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'input' && (
          <StepInput 
            onSubmit={addEntry} 
            todayEntry={entries.find(entry => entry.date === new Date().toISOString().split('T')[0])}
          />
        )}
        
        {activeTab === 'history' && (
          <StepHistory 
            entries={entries} 
            onDelete={deleteEntry} 
            onEdit={startEditing}
            editingEntry={editingEntry}
            onUpdate={updateEntry}
            onCancelEdit={cancelEditing}
          />
        )}
        
        {activeTab === 'calendar' && (
          <CalendarView entries={entries} />
        )}
        
        {activeTab === 'progress' && (
          <StepProgress entries={entries} />
        )}
      </div>
    </div>
  )
}

export default StepTracker
