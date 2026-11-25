import React, { useState } from 'react';
import { getTodayDateString, joinTimeTo24Hour } from '../utils/dateUtils';

export const QuickTaskAdd = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(getTodayDateString());

  // 12-Hour Time States with explicit AM / PM selector
  const [timeHour, setTimeHour] = useState('09');
  const [timeMinute, setTimeMinute] = useState('00');
  const [timePeriod, setTimePeriod] = useState('AM');
  const [hasTime, setHasTime] = useState(false);

  const [category, setCategory] = useState('Work');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a task name.');
      return;
    }

    const finalDueTime = hasTime ? joinTimeTo24Hour(timeHour, timeMinute, timePeriod) : '';

    onAddTask({
      title: trimmed,
      description: '',
      dueDate: dueDate || getTodayDateString(),
      dueTime: finalDueTime,
      priority,
      category,
    });

    setTitle('');
    setError('');
    setHasTime(false);
  };

  const categories = ['Work', 'Personal', 'Design', 'DevOps', 'Study', 'Finance', 'Health'];

  const priorityOptions = [
    { id: 'Low', label: 'Low', icon: 'bi-arrow-down-circle-fill', activeClass: 'badge-priority-low' },
    { id: 'Medium', label: 'Medium', icon: 'bi-dash-circle-fill', activeClass: 'badge-priority-medium' },
    { id: 'High', label: 'High', icon: 'bi-exclamation-triangle-fill', activeClass: 'badge-priority-high' },
  ];

  const hoursList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutesList = ['00', '15', '30', '45'];

  return (
    <div className="quick-task-add card border-0 rounded-4 shadow-xs mb-4 bg-white overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-3 p-md-4">

          {/* Main Input Row */}
          <div className="d-flex align-items-center gap-2">
            <div className="quick-add-icon text-lavender-dark p-2 d-none d-sm-flex align-items-center justify-content-center rounded-3 bg-lavender-subtle">
              <i className="bi bi-plus-circle-fill fs-5"></i>
            </div>

            <div className="flex-grow-1 position-relative">
              <input
                type="text"
                className={`form-control quick-add-input border-0 py-2.5 px-3 rounded-3 shadow-none ${error ? 'is-invalid' : ''}`}
                placeholder="What needs to be done? Type a task title and press Enter..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                onFocus={() => setIsExpanded(true)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-lavender-primary px-3 py-2.5 rounded-3 fw-semibold text-nowrap d-flex align-items-center gap-1.5 shadow-sm"
            >
              <i className="bi bi-plus-lg fs-6"></i>
              <span className="d-none d-sm-inline">Add Task</span>
            </button>
          </div>

          {/* Validation Feedback */}
          {error && (
            <div className="text-danger small mt-2 ms-sm-5 ps-sm-2 fw-medium">
              <i className="bi bi-exclamation-circle me-1"></i>
              {error}
            </div>
          )}

          {/* Options Row (Visible when typing or clicked) */}
          <div className={`quick-add-options mt-3 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2 ${isExpanded || title ? 'd-flex' : 'd-none d-md-flex'}`}>
            <div className="d-flex flex-wrap align-items-center gap-2">

              {/* Due Date */}
              <div className="d-flex align-items-center gap-1.5">
                <span className="text-muted small fw-medium">Due:</span>
                <input
                  type="date"
                  className="form-control form-control-sm rounded-pill border-light-subtle shadow-none py-1"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{ width: 'auto' }}
                  title="Due date"
                />
              </div>

              {/* Due Time with AM / PM toggle */}
              <div className="d-flex align-items-center gap-1 bg-light rounded-pill px-2 py-0.5 border border-light-subtle">
                <i className="bi bi-clock small text-muted"></i>
                <select
                  className="form-select form-select-sm border-0 bg-transparent p-0 shadow-none text-center fw-semibold"
                  value={timeHour}
                  onChange={(e) => {
                    setTimeHour(e.target.value);
                    setHasTime(true);
                  }}
                  style={{ width: '38px', fontSize: '0.8rem' }}
                  title="Hour"
                >
                  {hoursList.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className="small text-muted fw-bold">:</span>
                <select
                  className="form-select form-select-sm border-0 bg-transparent p-0 shadow-none text-center fw-semibold"
                  value={timeMinute}
                  onChange={(e) => {
                    setTimeMinute(e.target.value);
                    setHasTime(true);
                  }}
                  style={{ width: '38px', fontSize: '0.8rem' }}
                  title="Minute"
                >
                  {minutesList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>

                {/* AM or PM Toggle Pill */}
                <button
                  type="button"
                  className={`btn btn-xs rounded-pill px-2 py-0.5 fw-bold ${timePeriod === 'AM' && hasTime ? 'btn-lavender-primary' : 'btn-light text-secondary border'
                    }`}
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => {
                    setTimePeriod('AM');
                    setHasTime(true);
                  }}
                >
                  AM
                </button>
                <button
                  type="button"
                  className={`btn btn-xs rounded-pill px-2 py-0.5 fw-bold ${timePeriod === 'PM' && hasTime ? 'btn-lavender-primary' : 'btn-light text-secondary border'
                    }`}
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => {
                    setTimePeriod('PM');
                    setHasTime(true);
                  }}
                >
                  PM
                </button>

                {hasTime && (
                  <button
                    type="button"
                    className="btn btn-link btn-xs p-0 text-muted"
                    onClick={() => setHasTime(false)}
                    title="Clear time"
                  >
                    <i className="bi bi-x-circle-fill small"></i>
                  </button>
                )}
              </div>

              {/* Priority Select Buttons */}
              <div className="d-flex align-items-center gap-1 ms-sm-2">
                <span className="text-muted small fw-medium me-1">Priority:</span>
                {priorityOptions.map((p) => {
                  const isSelected = priority === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`btn btn-xs rounded-pill px-3 py-1 transition-all d-flex align-items-center gap-1 ${isSelected
                          ? `${p.activeClass} fw-bold shadow-xs`
                          : 'btn-light text-secondary border border-light-subtle'
                        }`}
                      style={{ fontSize: '0.78rem' }}
                      onClick={() => setPriority(p.id)}
                    >
                      <i className={`bi ${p.icon} small`}></i>
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Category */}
              <div className="d-flex align-items-center gap-1.5 ms-sm-2">
                <span className="text-muted small fw-medium">Category:</span>
                <select
                  className="form-select form-select-sm rounded-pill border-light-subtle shadow-none py-1"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="text-muted small fst-italic d-none d-lg-block">
              <i className="bi bi-info-circle me-1"></i>
              Press Enter ↵ to add
            </div>

          </div>

        </div>
      </form>
    </div>
  );
};
