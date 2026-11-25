import React, { useState, useEffect } from 'react';
import { getTodayDateString, getOffsetDateString, splitTimeTo12Hour, joinTimeTo24Hour } from '../utils/dateUtils';

export const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  editingTask = null
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  // 12-Hour Time States with explicit AM / PM selector
  const [timeHour, setTimeHour] = useState('09');
  const [timeMinute, setTimeMinute] = useState('00');
  const [timePeriod, setTimePeriod] = useState('AM');
  const [hasTime, setHasTime] = useState(false);

  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Work');
  const [error, setError] = useState('');

  // Synchronize state when opening modal or changing editing task
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate || '');

      const parsedTime = splitTimeTo12Hour(editingTask.dueTime);
      setTimeHour(parsedTime.hour);
      setTimeMinute(parsedTime.minute);
      setTimePeriod(parsedTime.period);
      setHasTime(parsedTime.hasTime);

      setPriority(editingTask.priority || 'Medium');
      setCategory(editingTask.category || 'Work');
      setError('');
    } else {
      setTitle('');
      setDescription('');
      setDueDate(getTodayDateString());
      setTimeHour('09');
      setTimeMinute('00');
      setTimePeriod('AM');
      setHasTime(false);
      setPriority('Medium');
      setCategory('Work');
      setError('');
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task name is required. Please enter a title.');
      return;
    }

    const finalDueTime = hasTime ? joinTimeTo24Hour(timeHour, timeMinute, timePeriod) : '';

    const taskPayload = {
      title: trimmedTitle,
      description: description.trim(),
      dueDate: dueDate || getTodayDateString(),
      dueTime: finalDueTime,
      priority,
      category,
    };

    onSubmit(taskPayload);
    onClose();
  };

  const handleSetQuickTime = (hour, minute, period) => {
    setTimeHour(hour);
    setTimeMinute(minute);
    setTimePeriod(period);
    setHasTime(true);
  };

  const handleClearTime = () => {
    setHasTime(false);
  };

  const categories = ['Work', 'Personal', 'Design', 'DevOps', 'Study', 'Finance', 'Health'];

  const priorityOptions = [
    { id: 'Low', label: 'Low', icon: 'bi-arrow-down-circle-fill', activeClass: 'badge-priority-low' },
    { id: 'Medium', label: 'Medium', icon: 'bi-dash-circle-fill', activeClass: 'badge-priority-medium' },
    { id: 'High', label: 'High', icon: 'bi-exclamation-triangle-fill', activeClass: 'badge-priority-high' },
  ];

  const hoursList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutesList = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        zIndex: 1060,
        display: 'block'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 1065 }}
      >
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden position-relative" style={{ zIndex: 1066 }}>

          {/* Modal Header */}
          <div className="modal-header border-bottom p-4 bg-lavender-subtle align-items-center">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 rounded-3 bg-white text-lavender-dark shadow-xs">
                <i className={`bi ${editingTask ? 'bi-pencil-fill' : 'bi-plus-circle-fill'} fs-5`}></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold text-dark mb-0">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h5>
                <span className="text-muted small">
                  {editingTask ? 'Update the details and schedule for this task.' : 'Add a new item to your productivity roadmap.'}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          {/* Modal Body Form */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">

              {/* Validation Alert */}
              {error && (
                <div className="alert alert-danger rounded-3 py-2 px-3 d-flex align-items-center gap-2 mb-3" role="alert">
                  <i className="bi bi-exclamation-octagon-fill text-danger"></i>
                  <span className="small fw-semibold">{error}</span>
                </div>
              )}

              {/* Task Title */}
              <div className="mb-3">
                <label htmlFor="task-title-input" className="form-label fw-semibold text-dark small">
                  Task Name <span className="text-danger">*</span>
                </label>
                <input
                  id="task-title-input"
                  type="text"
                  className={`form-control rounded-3 py-2 px-3 ${error ? 'is-invalid' : ''}`}
                  placeholder="e.g. Prepare quarterly presentation slides"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                />
              </div>

              {/* Task Description */}
              <div className="mb-3">
                <label htmlFor="task-desc-input" className="form-label fw-semibold text-dark small">
                  Description / Notes <span className="text-muted fw-normal">(Optional)</span>
                </label>
                <textarea
                  id="task-desc-input"
                  rows="3"
                  className="form-control rounded-3 py-2 px-3"
                  placeholder="Provide additional context, sub-points, or links..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Row for Due Date & Due Time with AM/PM */}
              <div className="row g-3 mb-3">

                {/* Due Date */}
                <div className="col-12 col-md-6">
                  <label htmlFor="task-date-input" className="form-label fw-semibold text-dark small">
                    <i className="bi bi-calendar3 me-1 text-lavender-dark"></i> Due Date
                  </label>
                  <input
                    id="task-date-input"
                    type="date"
                    className="form-control rounded-3 py-2 px-3"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  {/* Quick Date Pills */}
                  <div className="d-flex align-items-center gap-1 mt-2">
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary rounded-pill py-0.5 px-2 small"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setDueDate(getTodayDateString())}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary rounded-pill py-0.5 px-2 small"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setDueDate(getOffsetDateString(1))}
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary rounded-pill py-0.5 px-2 small"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setDueDate(getOffsetDateString(7))}
                    >
                      In 1 Week
                    </button>
                  </div>
                </div>

                {/* Due Time with AM / PM Selector */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-dark small d-flex justify-content-between align-items-center">
                    <span>
                      <i className="bi bi-clock me-1 text-lavender-dark"></i> Due Time
                      {hasTime && <span className="badge bg-lavender-subtle text-lavender-dark ms-2 rounded-pill small">Active</span>}
                    </span>
                    {hasTime && (
                      <button
                        type="button"
                        className="btn btn-link btn-xs p-0 text-danger text-decoration-none small"
                        onClick={handleClearTime}
                        style={{ fontSize: '0.75rem' }}
                      >
                        Remove time
                      </button>
                    )}
                  </label>

                  {/* 12-Hour Picker with AM / PM toggle */}
                  <div className="d-flex align-items-center gap-1.5">
                    {/* Hour Select */}
                    <div className="d-flex align-items-center gap-1">
                      <select
                        className="form-select rounded-3 py-2 px-2 text-center shadow-none fw-semibold"
                        value={timeHour}
                        onChange={(e) => {
                          setTimeHour(e.target.value);
                          setHasTime(true);
                        }}
                        style={{ width: '74px' }}
                        aria-label="Hour (1-12)"
                      >
                        {hoursList.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <span className="fw-bold text-muted fs-5">:</span>

                    {/* Minute Select */}
                    <div className="d-flex align-items-center gap-1">
                      <select
                        className="form-select rounded-3 py-2 px-2 text-center shadow-none fw-semibold"
                        value={timeMinute}
                        onChange={(e) => {
                          setTimeMinute(e.target.value);
                          setHasTime(true);
                        }}
                        style={{ width: '74px' }}
                        aria-label="Minute (00-55)"
                      >
                        {minutesList.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* EXPLICIT AM / PM TOGGLE BUTTON GROUP */}
                    <div className="btn-group rounded-3 overflow-hidden border ms-auto" role="group" aria-label="Select AM or PM">
                      <button
                        type="button"
                        className={`btn btn-sm py-2 px-3 fw-bold transition-all ${timePeriod === 'AM' && hasTime
                            ? 'btn-lavender-primary text-white shadow-xs'
                            : 'btn-light text-secondary'
                          }`}
                        onClick={() => {
                          setTimePeriod('AM');
                          setHasTime(true);
                        }}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm py-2 px-3 fw-bold transition-all ${timePeriod === 'PM' && hasTime
                            ? 'btn-lavender-primary text-white shadow-xs'
                            : 'btn-light text-secondary'
                          }`}
                        onClick={() => {
                          setTimePeriod('PM');
                          setHasTime(true);
                        }}
                      >
                        PM
                      </button>
                    </div>
                  </div>

                  {/* Quick Time Presets */}
                  <div className="d-flex align-items-center gap-1 mt-2">
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary rounded-pill py-0.5 px-2 small"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => handleSetQuickTime('09', '00', 'AM')}
                    >
                      9:00 AM
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary rounded-pill py-0.5 px-2 small"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => handleSetQuickTime('02', '00', 'PM')}
                    >
                      2:00 PM
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary rounded-pill py-0.5 px-2 small"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => handleSetQuickTime('06', '00', 'PM')}
                    >
                      6:00 PM
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline-secondary rounded-pill py-0.5 px-2 small"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => handleSetQuickTime('11', '59', 'PM')}
                    >
                      11:59 PM
                    </button>
                  </div>
                </div>

              </div>

              {/* Category Selection */}
              <div className="mb-3">
                <label htmlFor="task-category-select" className="form-label fw-semibold text-dark small">
                  <i className="bi bi-tag me-1 text-lavender-dark"></i> Category Tag
                </label>
                <select
                  id="task-category-select"
                  className="form-select rounded-3 py-2 px-3"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Priority Selection Pills */}
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark small d-flex align-items-center justify-content-between">
                  <span><i className="bi bi-flag me-1 text-lavender-dark"></i> Priority Level</span>
                  <span className="text-muted small fw-normal">Current: <strong className="text-dark">{priority}</strong></span>
                </label>
                <div className="row g-2">
                  {priorityOptions.map((p) => {
                    const isSelected = priority === p.id;
                    return (
                      <div className="col-4" key={p.id}>
                        <button
                          type="button"
                          className={`btn w-100 py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 transition-all ${isSelected
                              ? `${p.activeClass} fw-bold shadow-sm`
                              : 'btn-light text-secondary border border-light-subtle'
                            }`}
                          onClick={() => setPriority(p.id)}
                          aria-pressed={isSelected}
                        >
                          <i className={`bi ${p.icon}`}></i>
                          <span>{p.label}</span>
                          {isSelected && <i className="bi bi-check2 fw-bold ms-1"></i>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="modal-footer border-top p-3 px-4 bg-light d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4 fw-medium"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-lavender-primary rounded-pill px-4 fw-semibold shadow-sm"
              >
                <i className={`bi ${editingTask ? 'bi-check2' : 'bi-plus-lg'} me-1`}></i>
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
