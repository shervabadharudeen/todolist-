import { getTodayDateString, getOffsetDateString } from './dateUtils';

const STORAGE_KEY = 'taskflow_tasks_v1';

export const SEED_TASKS = [
  {
    id: 'task-1',
    title: 'Complete project proposal draft',
    description: 'Finalize scope, timeline milestones, and deliverable list for the client review meeting.',
    priority: 'High',
    dueDate: getTodayDateString(),
    dueTime: '14:30',
    completed: false,
    category: 'Work',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Review React 18 & Bootstrap 5 design components',
    description: 'Ensure color scheme, responsive sidebar layout, and accessible contrast levels are polished.',
    priority: 'Medium',
    dueDate: getOffsetDateString(1),
    dueTime: '10:00',
    completed: false,
    category: 'Design',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Weekly grocery shopping and meal prep',
    description: 'Buy fresh vegetables, fruits, almond milk, and organize weekly dinner ingredients.',
    priority: 'Low',
    dueDate: getOffsetDateString(2),
    dueTime: '18:00',
    completed: false,
    category: 'Personal',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Update team backlog & sprint planning',
    description: 'Refined user stories, aligned on priority tasks, and updated Jira boards.',
    priority: 'High',
    dueDate: getTodayDateString(),
    dueTime: '11:00',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    category: 'Work',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Set up automated database backup routine',
    description: 'Configured daily cron backups with S3 encryption and test restoration verification.',
    priority: 'Medium',
    dueDate: getOffsetDateString(-1),
    dueTime: '16:00',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    category: 'DevOps',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  }
];

export const loadTasksFromStorage = () => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TASKS));
      return SEED_TASKS;
    }
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return SEED_TASKS;
  } catch (error) {
    console.error('Failed to parse tasks from localStorage:', error);
    return SEED_TASKS;
  }
};

export const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};
