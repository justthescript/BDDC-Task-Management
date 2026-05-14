import React, { useState } from 'react'
import { useTasks, CATEGORIES } from './data/store.js'
import TabNav from './components/TabNav.jsx'
import KanbanBoard from './components/KanbanBoard.jsx'
import BoardOverview from './components/BoardOverview.jsx'
import TaskModal from './components/TaskModal.jsx'

const TABS = ['Board', ...CATEGORIES]

export default function App() {
  const { tasks, team, addTask, updateTask, deleteTask, addTeamMember, getTasksByCategory } = useTasks()

  const [activeTab, setActiveTab] = useState('Board')
  const [modal, setModal] = useState(null) // null | { mode: 'create' | 'edit', task?, defaultCategory? }

  function openCreate(defaultStatus, defaultCategory) {
    setModal({ mode: 'create', defaultStatus, defaultCategory: defaultCategory || (activeTab !== 'Board' ? activeTab : 'Misc') })
  }

  function openEdit(task) {
    setModal({ mode: 'edit', task })
  }

  function closeModal() {
    setModal(null)
  }

  function handleSave(formData) {
    if (modal.mode === 'create') {
      addTask({
        ...formData,
        status: modal.defaultStatus || formData.status,
      })
    } else {
      updateTask(modal.task.id, formData)
    }
    closeModal()
  }

  // Attach addTeamMember so TaskModal can call it
  handleSave.__addMember = addTeamMember

  function handleDelete(id) {
    deleteTask(id)
    closeModal()
  }

  const taskCounts = {}
  CATEGORIES.forEach(c => {
    taskCounts[c] = getTasksByCategory(c).length
  })
  taskCounts['Board'] = tasks.length

  const currentTasks = activeTab === 'Board' ? tasks : getTasksByCategory(activeTab)
  const defaultCategory = activeTab !== 'Board' ? activeTab : 'Misc'

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-black text-sm">
              BD
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 leading-tight">Big Dogs Don't Cry</h1>
              <p className="text-xs text-slate-500">Task Management</p>
            </div>
          </div>
          <button
            onClick={() => openCreate('Not Started', defaultCategory)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-amber-900/30"
          >
            <span className="text-lg leading-none">+</span>
            New Task
          </button>
        </div>

        <TabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          taskCounts={taskCounts}
        />
      </header>

      {/* Stats bar */}
      <div className="bg-slate-900/50 border-b border-slate-800/50 px-6 py-2 flex items-center gap-6 text-xs text-slate-500">
        <span>
          <span className="font-semibold text-slate-300">{currentTasks.length}</span> tasks
        </span>
        <span>
          <span className="font-semibold text-blue-400">
            {currentTasks.filter(t => t.status === 'In Progress').length}
          </span> in progress
        </span>
        <span>
          <span className="font-semibold text-red-400">
            {currentTasks.filter(t => t.priority === 'Urgent').length}
          </span> urgent
        </span>
        <span>
          <span className="font-semibold text-emerald-400">
            {currentTasks.filter(t => t.status === 'Completed').length}
          </span> completed
        </span>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden p-6">
        {activeTab === 'Board' ? (
          <BoardOverview
            tasks={tasks}
            onTaskClick={openEdit}
            onAddTask={(status) => openCreate(status, 'Misc')}
          />
        ) : (
          <KanbanBoard
            tasks={currentTasks}
            onTaskClick={openEdit}
            onAddTask={(status) => openCreate(status, activeTab)}
          />
        )}
      </main>

      {/* Modal */}
      {modal && (
        <TaskModal
          task={modal.task || null}
          defaultCategory={modal.defaultCategory}
          team={team}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
