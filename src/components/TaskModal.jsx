import React, { useState, useEffect } from 'react'
import { CATEGORIES, STATUSES, PRIORITIES } from '../data/store.js'

export default function TaskModal({ task, defaultCategory, team, onSave, onDelete, onClose }) {
  const isEdit = !!task

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: defaultCategory || 'Misc',
    assignedTo: 'Unassigned',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: '',
    notes: '',
  })

  const [newMember, setNewMember] = useState('')
  const [showAddMember, setShowAddMember] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        category: task.category || defaultCategory || 'Misc',
        assignedTo: task.assignedTo || 'Unassigned',
        status: task.status || 'Not Started',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate || '',
        notes: task.notes || '',
      })
    }
  }, [task])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    return errs
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  function handleAddMember() {
    const trimmed = newMember.trim()
    if (trimmed) {
      onSave.__addMember?.(trimmed)
      setNewMember('')
      setShowAddMember(false)
      set('assignedTo', trimmed)
    }
  }

  const STATUS_COLORS = {
    'Not Started': 'text-slate-400',
    'In Progress': 'text-blue-400',
    'Waiting on Info': 'text-yellow-400',
    'Under Review': 'text-purple-400',
    'On Hold': 'text-orange-400',
    'Completed': 'text-emerald-400',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100">
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none">×</button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="What needs to be done?"
              className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition
                ${errors.title ? 'border-red-500' : 'border-slate-700'}`}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Add more details..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition resize-none"
            />
          </div>

          {/* Row: Category + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => set('priority', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Status + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              />
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned To</label>
            <div className="flex gap-2">
              <select
                value={form.assignedTo}
                onChange={e => set('assignedTo', e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              >
                {team.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <button
                type="button"
                onClick={() => setShowAddMember(!showAddMember)}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition"
                title="Add new team member"
              >
                +
              </button>
            </div>
            {showAddMember && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newMember}
                  onChange={e => setNewMember(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddMember()}
                  placeholder="Name (e.g. Alex K.)"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                <button
                  onClick={handleAddMember}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Additional notes, updates, or context..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition resize-none"
            />
          </div>

          {/* Status indicator */}
          {isEdit && (
            <div className="bg-slate-800/50 rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-xs text-slate-500">Current status:</span>
              <span className={`text-sm font-semibold ${STATUS_COLORS[form.status] || 'text-slate-300'}`}>
                {form.status}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-800">
          <div>
            {isEdit && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Delete task
              </button>
            )}
            {confirmDelete && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400">Are you sure?</span>
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-xs px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded transition"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold transition"
            >
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
