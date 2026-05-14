import { useState, useEffect } from 'react'

export const CATEGORIES = ['Applications', 'Adoptions', 'Foster', 'Events', 'Misc']

export const STATUSES = [
  'Not Started',
  'In Progress',
  'Waiting on Info',
  'Under Review',
  'On Hold',
  'Completed',
]

export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']

export const DEFAULT_TEAM = [
  'Sarah M.',
  'Jake T.',
  'Maria L.',
  'Tom B.',
  'Unassigned',
]

const SEED_TASKS = [
  {
    id: 'seed-1',
    title: 'Review adoption application — Max (Lab mix)',
    description: 'Applicant submitted complete paperwork. Needs home check scheduled.',
    category: 'Applications',
    assignedTo: 'Sarah M.',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-05-20',
    notes: 'References checked — all positive.',
    createdAt: '2026-05-10T10:00:00Z',
  },
  {
    id: 'seed-2',
    title: 'Follow up on application — Bella (Beagle)',
    description: 'Waiting on vet reference from applicant.',
    category: 'Applications',
    assignedTo: 'Jake T.',
    status: 'Waiting on Info',
    priority: 'Medium',
    dueDate: '2026-05-18',
    notes: '',
    createdAt: '2026-05-11T09:00:00Z',
  },
  {
    id: 'seed-3',
    title: 'Complete adoption paperwork — Rocky',
    description: 'Adoption approved. Finalize contract and coordinate pickup.',
    category: 'Adoptions',
    assignedTo: 'Maria L.',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-05-16',
    notes: 'Adopter prefers Saturday pickup.',
    createdAt: '2026-05-09T14:00:00Z',
  },
  {
    id: 'seed-4',
    title: 'Post-adoption check-in — Luna',
    description: '2-week follow-up call with the Garcia family.',
    category: 'Adoptions',
    assignedTo: 'Sarah M.',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: '2026-05-22',
    notes: '',
    createdAt: '2026-05-12T11:00:00Z',
  },
  {
    id: 'seed-5',
    title: 'Onboard new foster — Daisy (Pit mix)',
    description: 'First-time foster. Schedule orientation and supply drop-off.',
    category: 'Foster',
    assignedTo: 'Tom B.',
    status: 'Not Started',
    priority: 'High',
    dueDate: '2026-05-17',
    notes: 'Foster has a fenced yard.',
    createdAt: '2026-05-13T08:00:00Z',
  },
  {
    id: 'seed-6',
    title: 'Vet appointment — foster dog Bruno',
    description: 'Bruno needs heartworm test and vaccines updated.',
    category: 'Foster',
    assignedTo: 'Maria L.',
    status: 'Waiting on Info',
    priority: 'Urgent',
    dueDate: '2026-05-15',
    notes: 'Call Happy Tails Vet to confirm availability.',
    createdAt: '2026-05-12T15:00:00Z',
  },
  {
    id: 'seed-7',
    title: 'Organize Spring Adoption Fair',
    description: 'Venue secured. Need volunteers, signage, and dog handlers.',
    category: 'Events',
    assignedTo: 'Jake T.',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-06-01',
    notes: 'Target 10 dogs available for meet & greet.',
    createdAt: '2026-05-01T09:00:00Z',
  },
  {
    id: 'seed-8',
    title: 'Fundraiser social media posts',
    description: 'Create 5 posts for the June fundraising campaign.',
    category: 'Events',
    assignedTo: 'Sarah M.',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: '2026-05-25',
    notes: '',
    createdAt: '2026-05-13T10:00:00Z',
  },
  {
    id: 'seed-9',
    title: 'Restock supply closet',
    description: 'Need leashes, collars (S/M/L), food bowls, and flea treatment.',
    category: 'Misc',
    assignedTo: 'Tom B.',
    status: 'Not Started',
    priority: 'Low',
    dueDate: '',
    notes: '',
    createdAt: '2026-05-10T12:00:00Z',
  },
  {
    id: 'seed-10',
    title: 'Update website dog profiles',
    description: 'Add 4 new dogs to the Available Dogs page with photos and bios.',
    category: 'Misc',
    assignedTo: 'Unassigned',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: '2026-05-19',
    notes: 'Photos from last weekend shoot are in the shared drive.',
    createdAt: '2026-05-12T09:00:00Z',
  },
]

function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem('bddc-tasks')
      return stored ? JSON.parse(stored) : SEED_TASKS
    } catch {
      return SEED_TASKS
    }
  })

  const [team, setTeam] = useState(() => {
    try {
      const stored = localStorage.getItem('bddc-team')
      return stored ? JSON.parse(stored) : DEFAULT_TEAM
    } catch {
      return DEFAULT_TEAM
    }
  })

  useEffect(() => {
    localStorage.setItem('bddc-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('bddc-team', JSON.stringify(team))
  }, [team])

  function addTask(taskData) {
    const task = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      notes: '',
      ...taskData,
    }
    setTasks(prev => [task, ...prev])
    return task
  }

  function updateTask(id, updates) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function addTeamMember(name) {
    const trimmed = name.trim()
    if (trimmed && !team.includes(trimmed)) {
      setTeam(prev => [...prev.slice(0, -1), trimmed, 'Unassigned'])
    }
  }

  function getTasksByCategory(category) {
    return tasks.filter(t => t.category === category)
  }

  return { tasks, team, addTask, updateTask, deleteTask, addTeamMember, getTasksByCategory }
}
