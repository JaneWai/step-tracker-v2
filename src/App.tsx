import React from 'react'
import { Footprints } from 'lucide-react'
import StepTracker from './components/StepTracker'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center">
      <header className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <Footprints className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Step Tracker</h1>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-4xl px-4">
        <StepTracker />
      </main>
      
      <footer className="w-full py-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Step Tracker App. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
