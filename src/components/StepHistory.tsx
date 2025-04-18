import React from 'react'
import { Trash2, Edit, Save, X } from 'lucide-react'
import { StepEntry } from './StepTracker'

interface StepHistoryProps {
  entries: StepEntry[]
  onDelete: (id: string) => void
  onEdit: (entry: StepEntry) => void
  editingEntry: StepEntry | null
  onUpdate: (entry: StepEntry) => void
  onCancelEdit: () => void
}

const StepHistory: React.FC<StepHistoryProps> = ({ 
  entries, 
  onDelete, 
  onEdit, 
  editingEntry, 
  onUpdate, 
  onCancelEdit 
}) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No step tracking data available yet.</p>
        <p className="text-gray-500 mt-2">Start tracking your steps today!</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const handleEditChange = (field: 'goal' | 'achieved', value: string) => {
    if (!editingEntry) return
    
    const numValue = parseInt(value) || 0
    const validValue = field === 'goal' ? Math.max(1, numValue) : Math.max(0, numValue)
    
    onUpdate({
      ...editingEntry,
      [field]: validValue
    })
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Step History</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Goal
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Achieved
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completion
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map(entry => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatDate(entry.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingEntry?.id === entry.id ? (
                    <input
                      type="number"
                      min="1"
                      value={editingEntry.goal}
                      onChange={(e) => handleEditChange('goal', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    `${entry.goal.toLocaleString()} steps`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingEntry?.id === entry.id ? (
                    <input
                      type="number"
                      min="0"
                      value={editingEntry.achieved}
                      onChange={(e) => handleEditChange('achieved', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    `${entry.achieved.toLocaleString()} steps`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 w-24">
                      <div 
                        className={`h-2.5 rounded-full ${entry.achieved >= entry.goal ? 'bg-green-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${Math.min(Math.round((entry.achieved / entry.goal) * 100), 100)}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${entry.achieved >= entry.goal ? 'text-green-600' : 'text-gray-500'}`}>
                      {Math.min(Math.round((entry.achieved / entry.goal) * 100), 100)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingEntry?.id === entry.id ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onUpdate(editingEntry)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={onCancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(entry)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StepHistory
