import React from 'react';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';

export const TaskList = ({ 
  tasks, 
  activeFilter, 
  searchTerm, 
  highlightedTaskId,
  onToggleComplete, 
  onEditTask, 
  onDeleteTask, 
  onCyclePriority,
  onOpenNewTaskModal,
  onResetFilters
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyState 
        activeFilter={activeFilter}
        searchTerm={searchTerm}
        onOpenNewTaskModal={onOpenNewTaskModal}
        onResetFilters={onResetFilters}
      />
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id}
          task={task}
          isHighlighted={highlightedTaskId === task.id}
          onToggleComplete={onToggleComplete}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onCyclePriority={onCyclePriority}
        />
      ))}
    </div>
  );
};
