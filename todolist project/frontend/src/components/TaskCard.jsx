import React from 'react';
import { getDateStatus } from '../utils/dateUtils';

export const TaskCard = ({ task, isHighlighted, onToggleComplete, onEdit, onDelete, onCyclePriority }) => {
  const { status, label, badgeClass } = getDateStatus(task.dueDate, task.completed, task.dueTime);

  // Priority styles mapping
  const priorityConfig = {
    High: {
      label: 'High Priority',
      badgeClass: 'badge-priority-high',
      icon: 'bi-exclamation-triangle-fill',
    },
    Medium: {
      label: 'Medium Priority',
      badgeClass: 'badge-priority-medium',
      icon: 'bi-dash-circle-fill',
    },
    Low: {
      label: 'Low Priority',
      badgeClass: 'badge-priority-low',
      icon: 'bi-arrow-down-circle-fill',
    },
  };

  const priorityInfo = priorityConfig[task.priority] || priorityConfig['Medium'];

  return (
    <div
      className={`card task-card border-0 rounded-4 mb-3 transition-all ${task.completed ? 'task-card-completed bg-light-subtle' : 'bg-white shadow-xs'
        } ${isHighlighted ? 'task-card-highlighted' : ''}`}
    >
      <div className="card-body p-3 p-md-4">
        <div className="d-flex align-items-start gap-3">

          {/* Aesthetic Checkbox */}
          <div className="pt-1 flex-shrink-0">
            <button
              type="button"
              className={`task-checkbox-btn rounded-circle d-flex align-items-center justify-content-center transition-all ${task.completed ? 'task-checkbox-checked' : 'task-checkbox-unchecked'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(task.id);
              }}
              aria-label={task.completed ? 'Mark task as pending' : 'Mark task as complete'}
              title={task.completed ? 'Mark as pending' : 'Mark as complete'}
            >
              {task.completed ? (
                <i className="bi bi-check-lg text-white fs-6"></i>
              ) : (
                <i className="bi bi-circle text-muted fs-6 check-hover-icon"></i>
              )}
            </button>
          </div>

          {/* Task Main Content */}
          <div className="flex-grow-1 min-w-0">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
              {/* Task Title */}
              <h5
                className={`task-title mb-0 fw-semibold text-break cursor-pointer ${task.completed ? 'text-decoration-line-through text-muted' : 'text-dark'
                  }`}
                onClick={() => onToggleComplete(task.id)}
                title="Click to toggle status"
              >
                {task.title}
                {isHighlighted && (
                  <span className="badge bg-lavender-subtle text-lavender-dark ms-2 rounded-pill small fw-normal py-0.5 px-2">
                    Updated Just Now
                  </span>
                )}
              </h5>

              {/* Action Buttons: Edit & Delete */}
              <div className="task-actions d-flex align-items-center gap-1 ms-auto">
                <button
                  type="button"
                  className="btn btn-sm btn-icon-action btn-light text-primary rounded-3 border-0 shadow-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  aria-label="Edit task"
                  title="Edit task"
                >
                  <i className="bi bi-pencil-square text-lavender-dark fs-6"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-icon-action btn-light text-danger rounded-3 border-0 shadow-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task);
                  }}
                  aria-label="Delete task"
                  title="Delete task"
                >
                  <i className="bi bi-trash3 text-danger fs-6"></i>
                </button>
              </div>
            </div>

            {/* Task Description */}
            {task.description && (
              <p className={`task-description mb-3 small text-break ${task.completed ? 'text-muted opacity-75' : 'text-secondary'
                }`}>
                {task.description}
              </p>
            )}

            {/* Task Meta Badges: Due Date & Time, Priority, Category, Status */}
            <div className="d-flex flex-wrap align-items-center gap-2 pt-1 border-top border-light-subtle mt-2">

              {/* Interactive Priority Badge */}
              <button
                type="button"
                className={`badge rounded-pill d-inline-flex align-items-center gap-1.5 py-1 px-2.5 ${priorityInfo.badgeClass} cursor-pointer priority-badge-btn`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onCyclePriority) {
                    onCyclePriority(task.id);
                  }
                }}
                title="Click to change priority: Low ➔ Medium ➔ High"
              >
                <i className={`bi ${priorityInfo.icon} small`}></i>
                <span>{task.priority} Priority</span>
                <i className="bi bi-arrow-repeat small opacity-75 ms-1"></i>
              </button>

              {/* Due Date & Time Badge */}
              {task.dueDate && (
                <span className={`badge rounded-pill d-inline-flex align-items-center gap-1.5 py-1 px-2.5 ${badgeClass || 'bg-light text-secondary border'}`}>
                  <i className={task.dueTime ? "bi bi-clock-fill small" : "bi bi-calendar-event small"}></i>
                  <span>{label}</span>
                </span>
              )}

              {/* Category / Tag Badge */}
              {task.category && (
                <span className="badge rounded-pill bg-lavender-subtle text-lavender-dark py-1 px-2.5">
                  <i className="bi bi-tag-fill me-1 small"></i>
                  {task.category}
                </span>
              )}

              {/* Status Badge */}
              <span className={`badge rounded-pill py-1 px-2.5 ms-auto ${task.completed ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'
                }`}>
                {task.completed ? (
                  <span className="d-flex align-items-center gap-1">
                    <i className="bi bi-check-all"></i> Completed
                  </span>
                ) : (
                  <span className="d-flex align-items-center gap-1">
                    <i className="bi bi-circle-half"></i> Pending
                  </span>
                )}
              </span>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
