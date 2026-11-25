import React, { useState } from 'react';

const QUOTES = [
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "Simplicity boils down to two steps: Identify the essential. Eliminate the rest.", author: "Leo Babauta" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
];

export const DailyQuote = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const current = QUOTES[index];

  return (
    <div className="card border-0 rounded-4 shadow-xs mb-4 bg-lavender-subtle overflow-hidden">
      <div className="card-body p-3 p-md-4 position-relative">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="badge bg-white text-lavender-dark rounded-pill py-1 px-2.5 small fw-semibold shadow-xs">
            <i className="bi bi-lightbulb-fill me-1 text-warning"></i> Daily Spark
          </span>
          <button
            type="button"
            className="btn btn-sm btn-link text-lavender-dark p-0 border-0 text-decoration-none"
            onClick={handleNext}
            title="Next inspirational quote"
          >
            <i className="bi bi-arrow-repeat fs-6"></i>
          </button>
        </div>

        <blockquote className="mb-1 text-dark fw-medium fst-italic small" style={{ fontSize: '0.85rem' }}>
          "{current.text}"
        </blockquote>
        <figcaption className="blockquote-footer mb-0 text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
          {current.author}
        </figcaption>
      </div>
    </div>
  );
};
