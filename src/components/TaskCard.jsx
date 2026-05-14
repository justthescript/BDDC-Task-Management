import React from 'react'

const PRIORITY_STYLES = {
  Low: 'bg-slate-700 text-slate-300 border-l-slate-500',
  Medium: 'bg-blue-900/50 text-blue-300 border-l-blue-500',
  High: 'bg-orange-900/50 text-orange-300 border-l-orange-500',
  Urgent: 'bg-red-900/50 text-red-300 border-l-red-500',
}

const PRIORITY_BORDER = {
  Low: 'border-l-slate-500',
  Medium: 'border-l-blue-500',
  High: 'border-l-orange-500',
  Urgent: 'border-l-red-500',
}

const PRIORITY_BADGE = {
  Low: 'bg-slate-700 text-slate-300',
  Medium: 'bg-blue-900/60 text-blue-300',
  High: 'bg-orange-900/60 text-orange-300',
  Urgent: 'bg-red-900/60 text-red-300',
}

function getInitials(name) {
  if (!name || name === 'Unassigned') return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(name) {
  const colors = [
    'bg-purple-600', 'bg-teal-600', 'bg-rose-600',
    'bg-amber-600', 'bg-emerald-600', 'bg-sky-600',
  ]
  if (!name || name === 'Unassigned') return 'bg-slate-600'
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

function isOverdue(dueDate) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TaskCard({ task, onClick }) {
  const overdue = isOverdue(task.dueDate) && task.status !== 'Completed'

  return (
    <div
      onClick={onClick}
      className={`
        bg-slate-800 rounded-lg p-3 cursor-pointer border-l-4
        hover:bg-slate-750 hover:ring-1 hover:ring-slate-600 transition-all
        ${PRIORITY_BORDER[task.priority] || 'border-l-slate-500'}
        group
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-slate-100 leading-snug group-hover:text-white line-clamp-2">
          {task.title}
        </p>
        <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded font-semibold ${PRIORITY_BADGE[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${getAvatarColor(task.assignedTo)}`}>
            {getInitials(task.assignedTo)}
          </div>
          <span className="text-xs text-slate-400 truncate max-w-[80px]">{task.assignedTo}</span>
        </div>

        {task.dueDate && (
          <span className={`text-xs font-medium ${overdue ? 'text-red-400' : 'text-slate-400'}`}>
            {overdue ? '⚠ ' : ''}{formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {task.notes && (
        <div className="mt-2 pt-2 border-t border-slate-700">
          <p className="text-xs text-slate-500 italic line-clamp-1">{task.notes}</p>
        </div>
      )}
    </div>
  )
}
