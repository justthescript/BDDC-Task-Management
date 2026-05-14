import React from 'react'
import { STATUSES } from '../data/store.js'
import TaskCard from './TaskCard.jsx'

const STATUS_COLORS = {
  'Not Started': 'text-slate-400 bg-slate-700/50',
  'In Progress': 'text-blue-400 bg-blue-900/30',
  'Waiting on Info': 'text-yellow-400 bg-yellow-900/30',
  'Under Review': 'text-purple-400 bg-purple-900/30',
  'On Hold': 'text-orange-400 bg-orange-900/30',
  'Completed': 'text-emerald-400 bg-emerald-900/30',
}

const STATUS_DOT = {
  'Not Started': 'bg-slate-400',
  'In Progress': 'bg-blue-400',
  'Waiting on Info': 'bg-yellow-400',
  'Under Review': 'bg-purple-400',
  'On Hold': 'bg-orange-400',
  'Completed': 'bg-emerald-400',
}

export default function KanbanBoard({ tasks, onTaskClick, onAddTask }) {
  const byStatus = {}
  STATUSES.forEach(s => { byStatus[s] = [] })
  tasks.forEach(t => {
    if (byStatus[t.status]) byStatus[t.status].push(t)
    else byStatus['Not Started'].push(t)
  })

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4 scrollbar-hide">
      {STATUSES.map(status => {
        const columnTasks = byStatus[status]
        const colorClass = STATUS_COLORS[status] || 'text-slate-400 bg-slate-700/50'
        const dotClass = STATUS_DOT[status] || 'bg-slate-400'

        return (
          <div
            key={status}
            className="flex-shrink-0 w-72 flex flex-col"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dotClass}`} />
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {status}
                </h3>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colorClass}`}>
                {columnTasks.length}
              </span>
            </div>

            {/* Task List */}
            <div className="flex-1 space-y-2 min-h-[80px]">
              {columnTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task)}
                />
              ))}
              {columnTasks.length === 0 && (
                <div className="border border-dashed border-slate-700 rounded-lg p-4 text-center">
                  <p className="text-xs text-slate-600">No tasks</p>
                </div>
              )}
            </div>

            {/* Add to this column */}
            {status === 'Not Started' && (
              <button
                onClick={() => onAddTask(status)}
                className="mt-2 w-full py-2 text-xs text-slate-500 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg border border-dashed border-slate-700 hover:border-amber-500/50 transition-all"
              >
                + Add task
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
