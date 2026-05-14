import React, { useState } from 'react'
import { CATEGORIES } from '../data/store.js'
import KanbanBoard from './KanbanBoard.jsx'

const FILTERS = ['All', ...CATEGORIES]

export default function BoardOverview({ tasks, onTaskClick, onAddTask }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? tasks
    : tasks.filter(t => t.category === activeFilter)

  const countByCategory = {}
  CATEGORIES.forEach(c => {
    countByCategory[c] = tasks.filter(t => t.category === c).length
  })

  return (
    <div className="flex flex-col h-full">
      {/* Filter Chips */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => {
          const count = f === 'All' ? tasks.length : countByCategory[f] || 0
          const isActive = activeFilter === f
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                ${isActive
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                }`}
            >
              {f}
              <span className={`ml-1.5 ${isActive ? 'text-slate-900/70' : 'text-slate-500'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <KanbanBoard
        tasks={filtered}
        onTaskClick={onTaskClick}
        onAddTask={onAddTask}
      />
    </div>
  )
}
