import React from 'react';

export const ProductivityAnalytics = ({ tasks = [] }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Group by categories
  const categories = ['Work', 'Personal', 'Design', 'DevOps', 'Study', 'Finance', 'Health'];
  const categoryStats = categories.map((cat) => {
    const count = tasks.filter((t) => t.category === cat).length;
    const catCompleted = tasks.filter((t) => t.category === cat && t.completed).length;
    return {
      category: cat,
      count,
      completed: catCompleted,
      percent: count === 0 ? 0 : Math.round((catCompleted / count) * 100),
    };
  }).filter((c) => c.count > 0);

  // Mock 7-day activity bars (last 7 days)
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activityData = [
    { day: 'Mon', count: 3, height: '60%' },
    { day: 'Tue', count: 5, height: '90%' },
    { day: 'Wed', count: 2, height: '40%' },
    { day: 'Thu', count: 4, height: '75%' },
    { day: 'Fri', count: completed > 0 ? Math.min(completed + 2, 6) : 3, height: '80%' },
    { day: 'Sat', count: 1, height: '25%' },
    { day: 'Sun', count: 2, height: '35%' },
  ];

  return (
    <div className="card border-0 rounded-4 shadow-xs mb-4 bg-white overflow-hidden">
      <div className="card-header bg-white border-0 pt-3 px-3 px-md-4 pb-0 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-3 p-1.5 bg-success-subtle text-success">
            <i className="bi bi-graph-up-arrow fs-5"></i>
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark">Weekly Productivity</h6>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Performance &amp; activity insights
            </span>
          </div>
        </div>
        <span className="badge bg-success-subtle text-success rounded-pill py-1 px-2.5 small fw-semibold">
          ⚡ 94% Efficiency
        </span>
      </div>

      <div className="card-body p-3 p-md-4">
        {/* 7-Day Mini Bar Chart */}
        <div className="activity-chart-container mb-3 pt-2">
          <div className="d-flex align-items-end justify-content-between gap-1" style={{ height: '110px' }}>
            {activityData.map((d, i) => (
              <div key={d.day} className="d-flex flex-column align-items-center flex-grow-1 h-100 justify-content-end">
                <div 
                  className={`w-100 rounded-top-2 transition-all ${
                    i === 4 ? 'bg-lavender-gradient shadow-xs' : 'bg-lavender-subtle hover-bg-lavender'
                  }`}
                  style={{ height: d.height, minHeight: '8px', maxWidth: '32px' }}
                  title={`${d.day}: ${d.count} tasks done`}
                />
                <span className="text-muted small mt-1.5" style={{ fontSize: '0.72rem' }}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Highlights */}
        <div className="row g-2 mb-3 text-center">
          <div className="col-4">
            <div className="p-2 rounded-3 bg-light border border-light-subtle">
              <div className="fw-bold text-dark fs-6">{completed}</div>
              <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Done</div>
            </div>
          </div>
          <div className="col-4">
            <div className="p-2 rounded-3 bg-light border border-light-subtle">
              <div className="fw-bold text-dark fs-6">{pending}</div>
              <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Pending</div>
            </div>
          </div>
          <div className="col-4">
            <div className="p-2 rounded-3 bg-light border border-light-subtle">
              <div className="fw-bold text-lavender-dark fs-6">{completionRate}%</div>
              <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Rate</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {categoryStats.length > 0 && (
          <div className="pt-2 border-top">
            <div className="text-muted small fw-medium mb-2 d-flex justify-content-between">
              <span>Category Breakdown</span>
              <span className="small text-secondary">{categoryStats.length} active</span>
            </div>
            <div className="d-flex flex-column gap-2">
              {categoryStats.slice(0, 4).map((c) => (
                <div key={c.category}>
                  <div className="d-flex justify-content-between small mb-1" style={{ fontSize: '0.76rem' }}>
                    <span className="fw-semibold text-secondary">{c.category}</span>
                    <span className="text-muted">{c.completed}/{c.count} tasks</span>
                  </div>
                  <div className="progress rounded-pill bg-light" style={{ height: '5px' }}>
                    <div
                      className="progress-bar bg-lavender-gradient rounded-pill"
                      role="progressbar"
                      style={{ width: `${c.percent}%` }}
                      aria-valuenow={c.percent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
