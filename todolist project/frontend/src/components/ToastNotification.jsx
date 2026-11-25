import React, { useEffect } from 'react';

export const ToastNotification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: { icon: 'bi-check-circle-fill', bg: 'bg-success text-white' },
    info: { icon: 'bi-info-circle-fill', bg: 'bg-primary text-white' },
    warning: { icon: 'bi-exclamation-triangle-fill', bg: 'bg-warning text-dark' },
    danger: { icon: 'bi-x-circle-fill', bg: 'bg-danger text-white' },
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
      <div className={`toast show align-items-center border-0 shadow-lg rounded-4 p-2 ${config.bg}`} role="alert">
        <div className="d-flex align-items-center">
          <div className="toast-body d-flex align-items-center gap-2 py-1 px-2 fw-medium">
            <i className={`bi ${config.icon} fs-5`}></i>
            <span>{message}</span>
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white me-2 m-auto shadow-none" 
            onClick={onClose}
            aria-label="Close"
          />
        </div>
      </div>
    </div>
  );
};
