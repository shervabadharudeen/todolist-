import React, { useEffect } from 'react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      role="dialog"
      aria-modal="true"
      style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.7)', 
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={(e) => {
        // Close only when clicking outside dialog
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-md w-100 px-3" 
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 100000, maxWidth: '480px' }}
      >
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden position-relative">
          
          {/* Top Warning Accent Bar */}
          <div className="bg-danger" style={{ height: '5px' }} />

          <div className="modal-body p-4 text-center">
            
            {/* Warning Icon Badge */}
            <div 
              className="delete-icon-wrapper rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 bg-danger-subtle text-danger shadow-xs"
              style={{ width: '64px', height: '64px' }}
            >
              <i className="bi bi-exclamation-triangle-fill fs-2"></i>
            </div>

            <h4 className="modal-title fw-bold text-dark mb-2">Confirm Deletion</h4>
            
            <p className="text-secondary small mb-3">
              Are you sure you want to permanently delete this task?
            </p>

            {/* Highlighted task name card */}
            <div className="card bg-light border rounded-3 p-3 mb-3 text-start">
              <div className="small text-muted mb-1 fw-medium">Task to delete:</div>
              <div className="fw-semibold text-dark text-break fs-6">
                <i className="bi bi-file-earmark-x text-danger me-2"></i>
                {taskTitle || 'Untitled Task'}
              </div>
            </div>

            <div className="alert alert-danger-subtle text-danger border-danger-subtle rounded-3 py-2 px-3 small text-start mb-4 d-flex align-items-center gap-2">
              <i className="bi bi-info-circle-fill fs-6 flex-shrink-0"></i>
              <span>This task and all its progress will be permanently removed.</span>
            </div>

            {/* Action Buttons */}
            <div className="d-flex align-items-center justify-content-center gap-2">
              <button 
                type="button" 
                className="btn btn-light rounded-pill px-4 py-2.5 fw-semibold border"
                onClick={onClose}
              >
                No, Keep Task
              </button>
              <button 
                type="button" 
                className="btn btn-danger rounded-pill px-4 py-2.5 fw-bold shadow-sm d-flex align-items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
                autoFocus
              >
                <i className="bi bi-trash3-fill"></i>
                <span>Yes, Delete Task</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
