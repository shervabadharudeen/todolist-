import React from 'react';

export const EmptyState = ({ activeFilter, searchTerm, onOpenNewTaskModal, onResetFilters }) => {
  const isSearch = Boolean(searchTerm);

  let title = 'No tasks found';
  let description = 'Start getting organized by adding your first task.';
  let icon = 'bi-clipboard-check';

  if (isSearch) {
    title = `No matches for "${searchTerm}"`;
    description = 'Try searching with different keywords or check your spelling.';
    icon = 'bi-search';
  } else if (activeFilter === 'pending') {
    title = 'All caught up!';
    description = 'You have cleared all pending tasks. Fantastic work!';
    icon = 'bi-sun-fill';
  } else if (activeFilter === 'completed') {
    title = 'No completed tasks yet';
    description = 'Mark tasks as done to see them listed in your completed accomplishments.';
    icon = 'bi-check2-circle';
  }

  return (
    <div className="card border-0 rounded-4 shadow-xs p-5 text-center bg-white empty-state-card my-3">
      <div className="empty-state-icon-wrapper mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center bg-lavender-subtle text-lavender-dark shadow-xs">
        <i className={`bi ${icon} display-5`}></i>
      </div>
      <h4 className="fw-bold text-dark mb-2">{title}</h4>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '420px' }}>
        {description}
      </p>

      <div className="d-flex align-items-center justify-content-center gap-2">
        {isSearch || activeFilter !== 'all' ? (
          <button 
            type="button" 
            className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-medium"
            onClick={onResetFilters}
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i>
            View All Tasks
          </button>
        ) : null}
        
        <button 
          type="button" 
          className="btn btn-lavender-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
          onClick={onOpenNewTaskModal}
        >
          <i className="bi bi-plus-lg me-1"></i>
          Create New Task
        </button>
      </div>
    </div>
  );
};
