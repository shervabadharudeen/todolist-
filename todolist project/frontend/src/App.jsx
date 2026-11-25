import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { QuickTaskAdd } from './components/QuickTaskAdd';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastNotification } from './components/ToastNotification';
import { ProductivityAnalytics } from './components/ProductivityAnalytics';
import { QuickNotes } from './components/QuickNotes';
import { DailyQuote } from './components/DailyQuote';
import { loadTasksFromStorage, saveTasksToStorage } from './utils/storage';
import { getTodayDateString } from './utils/dateUtils';
import * as todoApi from './services/todoApi';

export default function App() {
  // Tasks state initialized from localStorage
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [backendStatus, setBackendStatus] = useState('connecting'); // 'connecting' | 'connected' | 'offline'
  const [isLoading, setIsLoading] = useState(true);

  // UI & Filter states
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'all', 'pending', 'completed', 'timer', 'analytics', 'notes'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & responsive drawer states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [highlightedTaskId, setHighlightedTaskId] = useState(null);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Check backend health & fetch remote todos on mount
  useEffect(() => {
    let isMounted = true;
    const initBackend = async () => {
      try {
        const isHealthy = await todoApi.checkBackendHealth();
        if (!isMounted) return;
        if (isHealthy) {
          const remoteTodos = await todoApi.fetchTodos();
          if (isMounted) {
            if (Array.isArray(remoteTodos) && remoteTodos.length > 0) {
              setTasks(remoteTodos);
              saveTasksToStorage(remoteTodos);
            }
            setBackendStatus('connected');
            setIsLoading(false);
            return;
          }
        } else {
          if (isMounted) {
            setBackendStatus('offline');
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.warn('Backend not reachable, defaulting to local persistence:', err);
        if (isMounted) {
          setBackendStatus('offline');
          setIsLoading(false);
        }
      }
    };

    initBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync tasks to localStorage whenever tasks change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Sync activeTab with statusFilter when in task views
  useEffect(() => {
    if (activeTab === 'pending') {
      setStatusFilter('pending');
    } else if (activeTab === 'completed') {
      setStatusFilter('completed');
    } else if (activeTab === 'all') {
      setStatusFilter('all');
    }
  }, [activeTab]);

  // Clear highlight after 3.5 seconds
  useEffect(() => {
    if (!highlightedTaskId) return;
    const timer = setTimeout(() => {
      setHighlightedTaskId(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [highlightedTaskId]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    const highPriorityCount = tasks.filter(t => t.priority === 'High' && !t.completed).length;
    const mediumPriorityCount = tasks.filter(t => t.priority === 'Medium' && !t.completed).length;
    const lowPriorityCount = tasks.filter(t => t.priority === 'Low' && !t.completed).length;

    return {
      total,
      completed,
      pending,
      completionRate,
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount,
    };
  }, [tasks]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // Search term filter (matches title, description, category)
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description ? task.description.toLowerCase().includes(query) : false;
          const matchCategory = task.category ? task.category.toLowerCase().includes(query) : false;
          if (!matchTitle && !matchDesc && !matchCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'dueSoon') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          const aKey = `${a.dueDate} ${a.dueTime || '23:59'}`;
          const bKey = `${b.dueDate} ${b.dueTime || '23:59'}`;
          return aKey.localeCompare(bKey);
        }
        if (sortBy === 'dueLate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          const aKey = `${a.dueDate} ${a.dueTime || '00:00'}`;
          const bKey = `${b.dueDate} ${b.dueTime || '00:00'}`;
          return bKey.localeCompare(aKey);
        }
        if (sortBy === 'priority') {
          const weights = { High: 3, Medium: 2, Low: 1 };
          return (weights[b.priority] || 0) - (weights[a.priority] || 0);
        }
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, statusFilter, priorityFilter, sortBy, searchTerm]);

  // Handlers for task mutations
  const handleCreateOrUpdateTask = async (taskData) => {
    if (editingTask) {
      // Update existing
      const updatedId = editingTask.id;
      if (backendStatus === 'connected') {
        try {
          const updated = await todoApi.updateTodo(updatedId, taskData);
          setTasks((prev) => {
            const next = prev.map((t) => (t.id === updatedId ? updated : t));
            saveTasksToStorage(next);
            return next;
          });
          showToast(`Task "${taskData.title}" updated successfully!`, 'success');
        } catch (err) {
          console.error('Failed to update task via API:', err);
          setTasks((prev) => {
            const next = prev.map((t) => (t.id === updatedId ? { ...t, ...taskData, updatedAt: new Date().toISOString() } : t));
            saveTasksToStorage(next);
            return next;
          });
          showToast(`Task updated locally (${err.message})`, 'warning');
        }
      } else {
        setTasks((prev) => {
          const next = prev.map((t) => (t.id === updatedId ? { ...t, ...taskData, updatedAt: new Date().toISOString() } : t));
          saveTasksToStorage(next);
          return next;
        });
        showToast(`Task "${taskData.title}" updated successfully!`, 'success');
      }

      setEditingTask(null);
      setHighlightedTaskId(updatedId);

      // Ensure updated task is not accidentally hidden
      if (priorityFilter !== 'all' && priorityFilter !== taskData.priority) {
        setPriorityFilter('all');
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        if (!taskData.title.toLowerCase().includes(query)) {
          setSearchTerm('');
        }
      }
    } else {
      // Create new task
      if (backendStatus === 'connected') {
        try {
          const created = await todoApi.createTodo(taskData);
          setTasks((prev) => {
            const next = [created, ...prev.filter((t) => t.id !== created.id)];
            saveTasksToStorage(next);
            return next;
          });
          showToast(`Task "${taskData.title}" added to your list!`, 'success');
          setHighlightedTaskId(created.id);
        } catch (err) {
          console.error('Failed to create task via API:', err);
          const newId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
          const newTask = {
            id: newId,
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString(),
          };
          setTasks((prev) => {
            const next = [newTask, ...prev];
            saveTasksToStorage(next);
            return next;
          });
          showToast(`Task saved locally (${err.message})`, 'warning');
          setHighlightedTaskId(newId);
        }
      } else {
        const newId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const newTask = {
          id: newId,
          ...taskData,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        setTasks((prev) => {
          const next = [newTask, ...prev];
          saveTasksToStorage(next);
          return next;
        });
        showToast(`Task "${taskData.title}" added to your list!`, 'success');
        setHighlightedTaskId(newId);
      }

      // Ensure the newly created task immediately appears on screen
      if (statusFilter === 'completed') {
        setStatusFilter('all');
        if (activeTab === 'completed') setActiveTab('all');
      }
      if (priorityFilter !== 'all' && priorityFilter !== taskData.priority) {
        setPriorityFilter('all');
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        if (!taskData.title.toLowerCase().includes(query)) {
          setSearchTerm('');
        }
      }
      setSortBy('newest');
    }
  };

  const handleToggleComplete = async (taskId) => {
    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask) return;
    const willBeCompleted = !currentTask.completed;

    if (backendStatus === 'connected') {
      try {
        const updated = await todoApi.updateTodoStatus(taskId, willBeCompleted);
        setTasks((prev) => {
          const next = prev.map((t) => (t.id === taskId ? updated : t));
          saveTasksToStorage(next);
          return next;
        });
        showToast(
          willBeCompleted ? 'Task marked as completed! 🎯' : 'Task restored to pending',
          willBeCompleted ? 'success' : 'info'
        );
      } catch (err) {
        console.error('Failed to update status via API:', err);
        setTasks((prev) => {
          const next = prev.map((t) => (t.id === taskId ? { ...t, completed: willBeCompleted, completedAt: willBeCompleted ? new Date().toISOString() : null } : t));
          saveTasksToStorage(next);
          return next;
        });
        showToast(
          willBeCompleted ? 'Task marked as completed! 🎯' : 'Task restored to pending',
          willBeCompleted ? 'success' : 'info'
        );
      }
    } else {
      setTasks((prev) => {
        const updated = prev.map((t) => {
          if (t.id === taskId) {
            showToast(
              willBeCompleted ? 'Task marked as completed! 🎯' : 'Task restored to pending',
              willBeCompleted ? 'success' : 'info'
            );
            return {
              ...t,
              completed: willBeCompleted,
              completedAt: willBeCompleted ? new Date().toISOString() : null,
            };
          }
          return t;
        });
        saveTasksToStorage(updated);
        return updated;
      });
    }
  };

  const handleCyclePriority = async (taskId) => {
    const cycle = { Low: 'Medium', Medium: 'High', High: 'Low' };
    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask) return;
    const nextPriority = cycle[currentTask.priority] || 'Medium';

    if (backendStatus === 'connected') {
      try {
        const updated = await todoApi.updateTodo(taskId, { priority: nextPriority });
        setTasks((prev) => {
          const next = prev.map((t) => (t.id === taskId ? updated : t));
          saveTasksToStorage(next);
          return next;
        });
        showToast(`Priority updated to ${nextPriority}`, 'info');
      } catch (err) {
        setTasks((prev) => {
          const next = prev.map((t) => (t.id === taskId ? { ...t, priority: nextPriority, updatedAt: new Date().toISOString() } : t));
          saveTasksToStorage(next);
          return next;
        });
        showToast(`Priority updated to ${nextPriority}`, 'info');
      }
    } else {
      setTasks((prev) => {
        const updated = prev.map((t) => {
          if (t.id === taskId) {
            showToast(`Priority updated to ${nextPriority}`, 'info');
            return { ...t, priority: nextPriority, updatedAt: new Date().toISOString() };
          }
          return t;
        });
        saveTasksToStorage(updated);
        return updated;
      });
    }
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenDelete = (task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    const title = taskToDelete.title;
    const targetId = taskToDelete.id;

    if (backendStatus === 'connected') {
      try {
        await todoApi.deleteTodo(targetId);
      } catch (err) {
        console.error('Failed to delete task via API:', err);
      }
    }

    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== targetId);
      saveTasksToStorage(updated);
      return updated;
    });
    setTaskToDelete(null);
    showToast(`Task "${title}" deleted`, 'warning');
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('newest');
    setSearchTerm('');
    if (activeTab === 'pending' || activeTab === 'completed') {
      setActiveTab('all');
    }
  };

  const handleFilterChange = (filterId) => {
    setStatusFilter(filterId);
    if (filterId === 'pending') {
      setActiveTab('pending');
    } else if (filterId === 'completed') {
      setActiveTab('completed');
    } else {
      if (activeTab === 'pending' || activeTab === 'completed') {
        setActiveTab('all');
      }
    }
  };

  // Convert Scratchpad Note into Task
  const handleConvertNoteToTask = (noteContent) => {
    handleCreateOrUpdateTask({
      title: noteContent.slice(0, 80),
      description: noteContent.length > 80 ? noteContent : '',
      dueDate: getTodayDateString(),
      priority: 'Medium',
      category: 'Work',
    });
    showToast('Converted note into a new task!', 'success');
  };

  return (
    <div className="app-container d-flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onOpenNewTaskModal={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className="main-wrapper flex-grow-1 d-flex flex-column min-vh-100">
        {/* Top Header with Live Search Results Dropdown */}
        <Header 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          tasks={tasks}
          onSelectTask={handleOpenEdit}
          onToggleComplete={handleToggleComplete}
          onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onOpenNewTaskModal={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          onQuickCreateFromSearch={(title) => {
            handleCreateOrUpdateTask({
              title,
              description: '',
              dueDate: getTodayDateString(),
              priority: 'Medium',
              category: 'Work',
            });
            setSearchTerm('');
          }}
          totalTasks={stats.total}
          backendStatus={backendStatus}
        />

        {/* Dashboard Main Body */}
        <main className="content-container flex-grow-1 p-3 p-md-4 p-xl-5">
          <div className="container-fluid px-0" style={{ maxWidth: '1280px' }}>
            
            {/* Quick Hero Banner for Dashboard view */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-welcome-banner rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden text-white shadow-sm">
                <div className="position-relative z-1" style={{ maxWidth: '640px' }}>
                  <div className="badge bg-white bg-opacity-25 text-white rounded-pill px-3 py-1.5 mb-2 small fw-medium">
                    <i className="bi bi-stars me-1.5"></i> Productivity Focus
                  </div>
                  <h2 className="fw-bold mb-2 display-6">Achieve your goals with clarity.</h2>
                  <p className="opacity-90 mb-4 lead fs-6">
                    Organize your priorities, track completion momentum, and streamline your everyday workflow effortlessly.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button 
                      className="btn btn-light rounded-pill px-4 py-2 fw-semibold text-lavender-dark shadow-xs"
                      onClick={() => {
                        setEditingTask(null);
                        setIsTaskModalOpen(true);
                      }}
                    >
                      <i className="bi bi-plus-circle-fill me-1.5 text-lavender-primary"></i>
                      Create a Task
                    </button>
                    <button 
                      className="btn btn-outline-light rounded-pill px-4 py-2 fw-medium"
                      onClick={() => setActiveTab('all')}
                    >
                      <i className="bi bi-list-check me-1.5"></i>
                      View All ({stats.total})
                    </button>
                  </div>
                </div>
                <div className="banner-circle-1" />
                <div className="banner-circle-2" />
              </div>
            )}

            {/* Dashboard Summary Cards & Progress Bar (Always present on Dashboard/Task views) */}
            {(activeTab === 'dashboard' || activeTab === 'all' || activeTab === 'pending' || activeTab === 'completed') && (
              <DashboardStats 
                stats={stats} 
                activeFilter={statusFilter}
                onFilterChange={handleFilterChange}
              />
            )}

            {/* VIEW 1: DASHBOARD (Rich Multi-Widget Grid) */}
            {activeTab === 'dashboard' && (
              <div className="row g-4">
                {/* Left Column: Tasks & Management */}
                <div className="col-12 col-xl-8">
                  {/* Quick Task Input Bar */}
                  <QuickTaskAdd onAddTask={handleCreateOrUpdateTask} />

                  {/* Section Title & View Header */}
                  <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-3 mt-4">
                    <div>
                      <h4 className="fw-bold text-dark mb-0">Active Tasks &amp; Roadmap</h4>
                      <p className="text-muted small mb-0">Manage, prioritize, and track your daily tasks</p>
                    </div>
                    <span className="badge bg-white text-secondary border rounded-pill px-3 py-2 shadow-xs">
                      <i className="bi bi-list-task me-1 text-lavender-dark"></i>
                      {filteredAndSortedTasks.length} {filteredAndSortedTasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>

                  {/* Task Filters */}
                  <TaskFilters 
                    activeFilter={statusFilter}
                    onFilterChange={handleFilterChange}
                    priorityFilter={priorityFilter}
                    onPriorityFilterChange={setPriorityFilter}
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                    filteredCount={filteredAndSortedTasks.length}
                    totalCount={stats.total}
                    onResetFilters={handleResetFilters}
                  />

                  {/* Task List */}
                  <TaskList 
                    tasks={filteredAndSortedTasks}
                    activeFilter={statusFilter}
                    searchTerm={searchTerm}
                    highlightedTaskId={highlightedTaskId}
                    onToggleComplete={handleToggleComplete}
                    onEditTask={handleOpenEdit}
                    onDeleteTask={handleOpenDelete}
                    onCyclePriority={handleCyclePriority}
                    onOpenNewTaskModal={() => {
                      setEditingTask(null);
                      setIsTaskModalOpen(true);
                    }}
                    onResetFilters={handleResetFilters}
                  />
                </div>

                {/* Right Column: Productivity Tools Rail */}
                <div className="col-12 col-xl-4">
                  {/* Daily Spark Inspiration */}
                  <DailyQuote />

                  {/* Weekly Productivity & Activity Analytics */}
                  <ProductivityAnalytics tasks={tasks} />

                  {/* Quick Scratchpad / Notes */}
                  <QuickNotes onConvertNoteToTask={handleConvertNoteToTask} />
                </div>
              </div>
            )}

            {/* VIEW 2: DEDICATED TASKS (All, Pending, Completed) */}
            {(activeTab === 'all' || activeTab === 'pending' || activeTab === 'completed') && (
              <div className="task-full-view">
                <QuickTaskAdd onAddTask={handleCreateOrUpdateTask} />

                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-3 mt-4">
                  <div>
                    <h4 className="fw-bold text-dark mb-0">
                      {activeTab === 'all' && 'All Registered Tasks'}
                      {activeTab === 'pending' && 'Pending Work Items'}
                      {activeTab === 'completed' && 'Completed Tasks'}
                    </h4>
                    <p className="text-muted small mb-0">
                      {activeTab === 'pending' 
                        ? 'Tasks awaiting your execution and delivery'
                        : activeTab === 'completed' 
                        ? 'Accomplished items delivered successfully' 
                        : 'Complete roadmap of all your organized tasks'}
                    </p>
                  </div>
                  <span className="badge bg-white text-secondary border rounded-pill px-3 py-2 shadow-xs">
                    <i className="bi bi-list-task me-1 text-lavender-dark"></i>
                    {filteredAndSortedTasks.length} {filteredAndSortedTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>

                <TaskFilters 
                  activeFilter={statusFilter}
                  onFilterChange={handleFilterChange}
                  priorityFilter={priorityFilter}
                  onPriorityFilterChange={setPriorityFilter}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                  filteredCount={filteredAndSortedTasks.length}
                  totalCount={stats.total}
                  onResetFilters={handleResetFilters}
                />

                <TaskList 
                  tasks={filteredAndSortedTasks}
                  activeFilter={statusFilter}
                  searchTerm={searchTerm}
                  highlightedTaskId={highlightedTaskId}
                  onToggleComplete={handleToggleComplete}
                  onEditTask={handleOpenEdit}
                  onDeleteTask={handleOpenDelete}
                  onCyclePriority={handleCyclePriority}
                  onOpenNewTaskModal={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                  onResetFilters={handleResetFilters}
                />
              </div>
            )}

            {/* VIEW 3: DEDICATED ANALYTICS VIEW */}
            {activeTab === 'analytics' && (
              <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-8">
                  <div className="text-center mb-4">
                    <h3 className="fw-bold text-dark mb-1">Productivity Insights &amp; Analytics</h3>
                    <p className="text-muted small">Track your completion trends, activity distribution, and consistency.</p>
                  </div>
                  <ProductivityAnalytics tasks={tasks} />
                </div>
              </div>
            )}

            {/* VIEW 5: DEDICATED SCRATCHPAD VIEW */}
            {activeTab === 'notes' && (
              <div className="row justify-content-center">
                <div className="col-12 col-lg-10 col-xl-8">
                  <div className="text-center mb-4">
                    <h3 className="fw-bold text-dark mb-1">Quick Scratchpad &amp; Ideas</h3>
                    <p className="text-muted small">Capture thoughts instantly and convert them to tasks with one click.</p>
                  </div>
                  <QuickNotes onConvertNoteToTask={handleConvertNoteToTask} />
                </div>
              </div>
            )}

          </div>
        </main>

        {/* Footer */}
        <footer className="footer bg-white border-top py-3 px-4 text-center text-muted small mt-auto">
          <div className="container-fluid d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
            <span>© 2026 ZenTask. Crafted with React, Vite &amp; Bootstrap.</span>
            <span className="d-flex align-items-center gap-1.5 text-secondary">
              {backendStatus === 'connected' ? (
                <>
                  <i className="bi bi-cloud-check-fill text-success"></i>
                  <span>MongoDB REST API Synced</span>
                </>
              ) : (
                <>
                  <i className="bi bi-shield-check text-primary"></i>
                  <span>LocalStorage Mode (Offline)</span>
                </>
              )}
            </span>
          </div>
        </footer>
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskForm 
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        editingTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete ? taskToDelete.title : ''}
      />

      {/* Toast Notification */}
      {toast && (
        <ToastNotification 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
