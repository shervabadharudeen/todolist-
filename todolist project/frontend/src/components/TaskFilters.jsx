import React from 'react';

export const TaskFilters = ({ 
  activeFilter, 
  onFilterChange, 
  priorityFilter, 
  onPriorityFilterChange, 
  sortBy, 
  onSortByChange,
  filteredCount,
  totalCount,
  onResetFilters 
}) => {
  const isFiltered = activeFilter !== 'all' || priorityFilter !== 'all' || sortBy !== 'newest';

  return (
    <div className="task-filters card border-0 rounded-4 shadow-xs p-3 mb-4 bg-white">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        
        {/* Status Filter Tabs (All, Pending, Completed) */}
        <div className="d-flex align-items-center gap-1 overflow-x-auto pb-1 pb-lg-0 filter-tabs">
          <button 
            type="button" 
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold text-nowrap transition-all ${
              activeFilter === 'all' 
                ? 'btn-lavender-primary shadow-xs' 
                : 'btn-light text-secondary hover-bg-subtle'
            }`}
            onClick={() => onFilterChange('all')}
          >
            <i className="bi bi-stack me-1"></i>
            All Tasks
          </button>

          <button 
            type="button" 
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold text-nowrap transition-all ${
              activeFilter === 'pending' 
                ? 'btn-warning-emphasis bg-warning-subtle border-warning shadow-xs' 
                : 'btn-light text-secondary hover-bg-subtle'
            }`}
            onClick={() => onFilterChange('pending')}
          >
            <i className="bi bi-hourglass me-1"></i>
            Pending
          </button>

          <button 
            type="button" 
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold text-nowrap transition-all ${
              activeFilter === 'completed' 
                ? 'btn-success-subtle text-success border-success fw-bold shadow-xs' 
                : 'btn-light text-secondary hover-bg-subtle'
            }`}
            onClick={() => onFilterChange('completed')}
          >
            <i className="bi bi-check-circle me-1"></i>
            Completed
          </button>
        </div>

        {/* Secondary Filters: Priority, Sort, and Reset */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          
          {/* Priority Filter */}
          <div className="d-flex align-items-center gap-1">
            <label htmlFor="priority-select" className="text-muted small fw-medium text-nowrap me-1">
              Priority:
            </label>
            <select 
              id="priority-select"
              className="form-select form-select-sm rounded-3 border-light-subtle shadow-none py-1.5"
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              style={{ width: 'auto', minWidth: '110px' }}
            >
              <option value="all">All Priorities</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="d-flex align-items-center gap-1">
            <label htmlFor="sort-select" className="text-muted small fw-medium text-nowrap me-1">
              Sort:
            </label>
            <select 
              id="sort-select"
              className="form-select form-select-sm rounded-3 border-light-subtle shadow-none py-1.5"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              style={{ width: 'auto', minWidth: '140px' }}
            >
              <option value="newest">Newest First</option>
              <option value="dueSoon">Due Date (Earliest)</option>
              <option value="dueLate">Due Date (Latest)</option>
              <option value="priority">Priority (High to Low)</option>
              <option value="alphabetical">Title (A - Z)</option>
            </select>
          </div>

          {/* Reset Filters CTA if any filter is active */}
          {isFiltered && (
            <button 
              type="button" 
              className="btn btn-outline-secondary btn-sm rounded-pill px-2.5 py-1 text-nowrap"
              onClick={onResetFilters}
              title="Reset all filters"
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i>
              Reset
            </button>
          )}

          {/* Result Count Indicator */}
          <div className="ms-auto ms-lg-2">
            <span className="badge bg-light text-secondary border rounded-pill py-1.5 px-2.5">
              Showing {filteredCount} of {totalCount}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
