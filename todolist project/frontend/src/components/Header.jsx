import React, { useState, useRef, useEffect } from 'react';
import { getGreeting, getFormattedCurrentDate, getDateStatus } from '../utils/dateUtils';

export const Header = ({
  searchTerm,
  setSearchTerm,
  tasks = [],
  onSelectTask,
  onToggleComplete,
  onToggleSidebar,
  onOpenNewTaskModal,
  onQuickCreateFromSearch,
  totalTasks,
  backendStatus = 'connecting'
}) => {
  const greeting = getGreeting();
  const currentDate = getFormattedCurrentDate();
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tasks matching search term
  const matchedTasks = tasks.filter((task) => {
    if (!searchTerm.trim()) return false;
    const q = searchTerm.toLowerCase();
    const titleMatch = task.title.toLowerCase().includes(q);
    const descMatch = task.description ? task.description.toLowerCase().includes(q) : false;
    const catMatch = task.category ? task.category.toLowerCase().includes(q) : false;
    return titleMatch || descMatch || catMatch;
  });

  const priorityBadgeClasses = {
    High: 'badge-priority-high',
    Medium: 'badge-priority-medium',
    Low: 'badge-priority-low',
  };

  return (
    <header className="main-header bg-white border-bottom px-3 px-md-4 py-3 sticky-top">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">

        {/* Left Side: Mobile Menu Toggle & Welcome Message */}
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-lg-none rounded-3 border-light-subtle d-flex align-items-center justify-content-center p-2"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <i className="bi bi-list fs-5"></i>
          </button>

          <div>
            <div className="d-flex align-items-center gap-2">
              <h1 className="h4 mb-0 fw-bold text-dark header-greeting">
                {greeting}, Sherva <span className="greeting-wave">👋</span>
              </h1>
            </div>
            <div className="text-muted small mt-1 d-flex flex-wrap align-items-center gap-2">
              <span className="d-flex align-items-center gap-1">
                <i className="bi bi-calendar3 text-lavender-dark"></i>
                <span>{currentDate}</span>
              </span>
              <span className="text-secondary opacity-50">•</span>
              <span className="badge bg-light text-secondary border rounded-pill">
                {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'} recorded
              </span>
              <span className="text-secondary opacity-50">•</span>
              {backendStatus === 'connected' ? (
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill d-inline-flex align-items-center gap-1.5" title="Connected to Node.js & MongoDB Backend">
                  <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '6px', height: '6px' }} role="status"></span>
                  MongoDB API Live
                </span>
              ) : backendStatus === 'connecting' ? (
                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill small">
                  Connecting API...
                </span>
              ) : (
                <span className="badge bg-light text-secondary border rounded-pill d-inline-flex align-items-center gap-1" title="Backend server offline - running with local persistence">
                  <i className="bi bi-hdd-network text-muted"></i>
                  Local Mode
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Search Bar with Live Results Dropdown & Add Task CTA */}
        <div className="d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0 header-actions">

          {/* Search Container */}
          <div
            ref={searchContainerRef}
            className="position-relative flex-grow-1"
            style={{ minWidth: '240px', maxWidth: '380px' }}
          >
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="text"
              className="form-control form-control-sm search-input rounded-pill ps-5 pe-4 py-2 border-light-subtle shadow-none"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                if (searchTerm.trim()) setIsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsOpen(false);
              }}
              aria-label="Search tasks"
            />

            {searchTerm && (
              <button
                type="button"
                className="btn btn-link btn-sm position-absolute top-50 end-0 translate-middle-y text-muted p-0 me-2 text-decoration-none"
                onClick={() => {
                  setSearchTerm('');
                  setIsOpen(false);
                }}
                title="Clear search"
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}

            {/* LIVE SEARCH RESULTS DROPDOWN DIRECTLY UNDER SEARCH BAR */}
            {isOpen && searchTerm.trim() && (
              <div
                className="search-results-dropdown position-absolute start-0 end-0 bg-white rounded-4 shadow-lg border mt-2 overflow-hidden"
                style={{ zIndex: 1080, top: '100%', minWidth: '320px', maxHeight: '420px', overflowY: 'auto' }}
              >
                {/* Dropdown Header */}
                <div className="px-3 py-2 bg-light border-bottom d-flex align-items-center justify-content-between">
                  <span className="small text-muted fw-bold text-uppercase" style={{ fontSize: '0.72rem' }}>
                    Results for "{searchTerm}"
                  </span>
                  <span className="badge bg-white text-secondary border rounded-pill small">
                    {matchedTasks.length} found
                  </span>
                </div>

                {/* Dropdown Items List */}
                <div className="p-1">
                  {matchedTasks.length === 0 ? (
                    <div className="p-3 text-center">
                      <div className="text-muted small mb-2">No matching tasks found</div>
                      {onQuickCreateFromSearch && (
                        <button
                          type="button"
                          className="btn btn-lavender-primary btn-sm rounded-pill px-3 py-1.5 fw-semibold small"
                          onClick={() => {
                            onQuickCreateFromSearch(searchTerm.trim());
                            setIsOpen(false);
                          }}
                        >
                          <i className="bi bi-plus-lg me-1"></i>
                          Create task: "{searchTerm.slice(0, 20)}"
                        </button>
                      )}
                    </div>
                  ) : (
                    matchedTasks.map((task) => {
                      const { label: dateLabel } = getDateStatus(task.dueDate, task.completed, task.dueTime);
                      return (
                        <div
                          key={task.id}
                          className="search-result-item p-2.5 rounded-3 d-flex align-items-center justify-content-between gap-2 transition-all cursor-pointer"
                          onClick={() => {
                            if (onSelectTask) {
                              onSelectTask(task);
                            }
                            setIsOpen(false);
                          }}
                          title="Click to view/edit task details"
                        >
                          <div className="d-flex align-items-center gap-2 min-w-0 flex-grow-1">
                            {/* Checkbox */}
                            <button
                              type="button"
                              className={`task-checkbox-btn rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center ${task.completed ? 'task-checkbox-checked' : 'task-checkbox-unchecked'
                                }`}
                              style={{ width: '20px', height: '20px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onToggleComplete) onToggleComplete(task.id);
                              }}
                              title={task.completed ? 'Mark pending' : 'Mark done'}
                            >
                              {task.completed && <i className="bi bi-check text-white" style={{ fontSize: '0.8rem' }}></i>}
                            </button>

                            {/* Title & Info */}
                            <div className="min-w-0">
                              <div className={`fw-semibold text-truncate small ${task.completed ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                                {task.title}
                              </div>
                              <div className="text-muted small d-flex align-items-center gap-1.5" style={{ fontSize: '0.72rem' }}>
                                <span>{dateLabel}</span>
                                {task.category && <span>• {task.category}</span>}
                              </div>
                            </div>
                          </div>

                          {/* Priority Badge */}
                          <div className="flex-shrink-0">
                            <span className={`badge rounded-pill py-0.5 px-2 small ${priorityBadgeClasses[task.priority] || 'badge-priority-medium'}`} style={{ fontSize: '0.7rem' }}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Dropdown Footer */}
                {matchedTasks.length > 0 && (
                  <div className="px-3 py-1.5 bg-light border-top text-center text-muted small" style={{ fontSize: '0.7rem' }}>
                    Click any task to edit • Press <kbd className="text-secondary border rounded px-1 py-0.5">Esc</kbd> to close
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Add CTA */}
          <button
            type="button"
            className="btn btn-lavender-primary btn-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2 fw-semibold text-nowrap shadow-sm"
            onClick={onOpenNewTaskModal}
          >
            <i className="bi bi-plus-circle-fill fs-6"></i>
            <span className="d-none d-sm-inline">New Task</span>
          </button>
        </div>

      </div>
    </header>
  );
};
