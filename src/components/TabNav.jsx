import React from 'react'

const TABS = ['Board', 'Applications', 'Adoptions', 'Foster', 'Events', 'Misc']

export default function TabNav({ activeTab, onTabChange, taskCounts }) {
  return (
    <nav className="flex gap-1 px-6 border-b border-slate-800 bg-slate-900">
      {TABS.map(tab => {
        const count = taskCounts[tab] ?? null
        const isActive = activeTab === tab
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
              ${isActive
                ? 'text-amber-400 border-b-2 border-amber-400 -mb-px'
                : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
              }
            `}
          >
            {tab}
            {count !== null && count > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-semibold
                ${isActive ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
