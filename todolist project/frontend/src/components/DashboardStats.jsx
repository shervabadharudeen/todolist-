import React from 'react';

export const DashboardStats = ({ stats, activeFilter, onFilterChange }) => {
  const cards = [
    {
      id: 'all',
      title: 'Total Tasks',
      value: stats.total,
      icon: 'bi-kanban-fill',
      color: 'lavender',
      subtext: 'All registered tasks',
      badge: 'Total'
    },
    {
      id: 'completed',
      title: 'Completed',
      value: stats.completed,
      icon: 'bi-check-circle-fill',
      color: 'success',
      subtext: `${stats.completionRate}% completion`,
      badge: 'Done'
    },
    {
      id: 'pending',
      title: 'Pending Tasks',
      value: stats.pending,
      icon: 'bi-clock-history',
      color: 'warning',
      subtext: stats.pending === 0 ? 'All caught up' : 'Needs attention',
      badge: 'In Progress'
    },
    {
      id: 'rate',
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: 'bi-pie-chart-fill',
      color: 'info',
      subtext: `${stats.completed} of ${stats.total} tasks`,
      badge: stats.completionRate >= 80 ? 'Excellent' : stats.completionRate >= 50 ? 'Steady' : 'Starting'
    }
  ];

  return (
    <section className="dashboard-stats mb-4">
      {/* 4 Summary Cards */}
      <div className="row g-3 mb-4">
        {cards.map((card) => {
          const isFilterActive = activeFilter === card.id;
          return (
            <div className="col-12 col-sm-6 col-xl-3" key={card.id}>
              <div 
                className={`card stat-card border-0 rounded-4 shadow-xs h-100 transition-all ${
                  card.id !== 'rate' ? 'cursor-pointer' : ''
                } ${isFilterActive ? 'stat-card-active' : ''}`}
                onClick={() => {
                  if (card.id !== 'rate' && onFilterChange) {
                    onFilterChange(card.id);
                  }
                }}
              >
                <div className="card-body p-3 p-xl-4 d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="text-secondary fw-semibold small">{card.title}</span>
                    <div className={`stat-icon-wrapper rounded-3 bg-${card.color}-subtle text-${card.color} d-flex align-items-center justify-content-center`}>
                      <i className={`bi ${card.icon} fs-5`}></i>
                    </div>
                  </div>

                  <div>
                    <h2 className="display-6 fw-bold mb-1 text-dark stat-value">
                      {card.value}
                    </h2>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted small">{card.subtext}</span>
                      <span className={`badge rounded-pill bg-${card.color}-subtle text-${card.color} small`}>
                        {card.badge}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Progress Bar Section */}
      <div className="card border-0 rounded-4 shadow-xs p-3 p-md-4 bg-white">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-lavender-subtle text-lavender-dark">
              <i className="bi bi-lightning-charge-fill fs-6"></i>
            </div>
            <div>
              <h6 className="mb-0 fw-bold text-dark">Overall Task Completion Status</h6>
              <span className="text-muted small">Real-time productivity overview</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold fs-5 text-lavender-dark">{stats.completionRate}%</span>
            <span className="badge bg-light text-secondary border rounded-pill">
              {stats.completed} / {stats.total} Done
            </span>
          </div>
        </div>

        {/* Multi-step / smooth gradient progress bar */}
        <div className="progress progress-main rounded-pill bg-light position-relative" style={{ height: '12px' }}>
          <div 
            className="progress-bar bg-lavender-gradient rounded-pill progress-bar-animated progress-bar-striped"
            role="progressbar" 
            style={{ width: `${stats.completionRate}%`, transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
            aria-valuenow={stats.completionRate} 
            aria-valuemin="0" 
            aria-valuemax="100"
          />
        </div>

        <div className="d-flex align-items-center justify-content-between mt-2 text-muted small">
          <span>
            {stats.total === 0 
              ? 'No tasks created yet. Click "+ Add New Task" to begin!' 
              : stats.pending === 0 
              ? '✨ Outstanding! Every task on your list has been completed.'
              : `${stats.pending} remaining task${stats.pending === 1 ? '' : 's'} awaiting completion.`}
          </span>
          <span className="d-none d-sm-inline text-secondary fst-italic">
            {stats.completionRate === 100 ? 'Goal Achieved 🎯' : 'Keep going! 💪'}
          </span>
        </div>
      </div>
    </section>
  );
};
