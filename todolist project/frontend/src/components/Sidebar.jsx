import React from 'react';

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  stats, 
  isMobileOpen, 
  setIsMobileOpen, 
  onOpenNewTaskModal 
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', badge: null },
    { id: 'all', label: 'My Tasks', icon: 'bi-check2-square', badge: stats.total },
    { id: 'pending', label: 'Pending', icon: 'bi-hourglass-split', badge: stats.pending, badgeClass: 'bg-warning-subtle text-warning-emphasis' },
    { id: 'completed', label: 'Completed', icon: 'bi-check-circle-fill', badge: stats.completed, badgeClass: 'bg-success-subtle text-success' },
  ];

  const toolNavItems = [
    { id: 'analytics', label: 'Analytics', icon: 'bi-graph-up-arrow', badge: 'Stats' },
    { id: 'notes', label: 'Scratchpad', icon: 'bi-sticky-fill', badge: null },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="sidebar-backdrop d-lg-none"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar bg-white border-end d-flex flex-column ${isMobileOpen ? 'show' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header p-4 border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="brand-icon-wrapper rounded-3 d-flex align-items-center justify-content-center shadow-sm">
              <i className="bi bi-check2-all text-white fs-4"></i>
            </div>
            <div>
              <h5 className="mb-0 fw-bold brand-text">ZenTask</h5>
              <span className="text-muted small">Workspace</span>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            type="button" 
            className="btn btn-sm btn-light d-lg-none rounded-circle"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="px-3 pt-3 pb-2">
          <button 
            className="btn btn-lavender-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm rounded-3 fw-semibold"
            onClick={onOpenNewTaskModal}
          >
            <i className="bi bi-plus-lg fs-6"></i>
            <span>Add New Task</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="sidebar-nav px-3 py-2 flex-grow-1 overflow-y-auto">
          {/* Core Menu */}
          <div className="nav-section-title text-uppercase px-2 mb-2 text-muted fw-bold">Menu</div>
          <ul className="nav nav-pills flex-column gap-1 mb-3">
            {mainNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li className="nav-item" key={item.id}>
                  <button
                    className={`nav-link w-100 d-flex align-items-center justify-content-between px-3 py-2 rounded-3 text-start border-0 ${
                      isActive ? 'active-nav-link fw-semibold' : 'text-secondary hover-nav-link'
                    }`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${item.icon} fs-5 ${isActive ? 'text-lavender-dark' : 'text-muted'}`}></i>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span className={`badge rounded-pill ${item.badgeClass || (isActive ? 'bg-white text-lavender-dark shadow-xs' : 'bg-light text-secondary')}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Tools & Insights Section */}
          <div className="nav-section-title text-uppercase px-2 mb-2 text-muted fw-bold">Productivity Tools</div>
          <ul className="nav nav-pills flex-column gap-1 mb-3">
            {toolNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li className="nav-item" key={item.id}>
                  <button
                    className={`nav-link w-100 d-flex align-items-center justify-content-between px-3 py-2 rounded-3 text-start border-0 ${
                      isActive ? 'active-nav-link fw-semibold' : 'text-secondary hover-nav-link'
                    }`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${item.icon} fs-5 ${isActive ? 'text-lavender-dark' : 'text-muted'}`}></i>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span className="badge rounded-pill bg-light text-secondary border small" style={{ fontSize: '0.68rem' }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Quick Priorities Category */}
          <div className="nav-section-title text-uppercase px-2 mt-3 mb-2 text-muted fw-bold">Priority Tiers</div>
          <div className="px-2 d-flex flex-column gap-2 small">
            <div className="d-flex align-items-center justify-content-between text-secondary py-1 px-2 rounded-2 hover-bg-subtle">
              <span className="d-flex align-items-center gap-2">
                <span className="priority-dot bg-danger"></span>
                High Priority
              </span>
              <span className="badge bg-danger-subtle text-danger rounded-pill">{stats.highPriorityCount}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between text-secondary py-1 px-2 rounded-2 hover-bg-subtle">
              <span className="d-flex align-items-center gap-2">
                <span className="priority-dot bg-warning"></span>
                Medium Priority
              </span>
              <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill">{stats.mediumPriorityCount}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between text-secondary py-1 px-2 rounded-2 hover-bg-subtle">
              <span className="d-flex align-items-center gap-2">
                <span className="priority-dot bg-success"></span>
                Low Priority
              </span>
              <span className="badge bg-success-subtle text-success rounded-pill">{stats.lowPriorityCount}</span>
            </div>
          </div>
        </div>

        {/* Motivational / Mini Progress Footer */}
        <div className="p-3 border-top mt-auto">
          <div className="productivity-card p-3 rounded-4 bg-lavender-subtle text-dark position-relative overflow-hidden">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-semibold small text-lavender-dark">Today's Progress</span>
              <span className="badge bg-white text-lavender-dark fw-bold rounded-pill shadow-xs">
                {stats.completionRate}%
              </span>
            </div>
            <div className="progress progress-sm rounded-pill bg-white mb-2" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-lavender-gradient rounded-pill" 
                role="progressbar" 
                style={{ width: `${stats.completionRate}%` }}
                aria-valuenow={stats.completionRate} 
                aria-valuemin="0" 
                aria-valuemax="100"
              />
            </div>
            <p className="mb-0 text-muted small" style={{ fontSize: '0.78rem' }}>
              {stats.pending === 0 && stats.total > 0
                ? '🎉 Amazing! All tasks completed!'
                : `${stats.pending} task${stats.pending === 1 ? '' : 's'} remaining to tackle.`}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
