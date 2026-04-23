// About.js
// Shows info about environmental advocacy, a personal journey, and a short quiz.

import React, { useState } from 'react';
import '../styles.css';

// Quiz questions data
const quizData = [
  {
    question: 'Why does environmental advocacy matter?',
    options: [
      'It helps protect ecosystems and future generations.',
      'It exists mainly to increase corporate profits.',
      'It only focuses on wildlife and ignores human communities.',
      'It is only important for scientists.',
    ],
    answer: 0,
  },
  {
    question: 'Why is reducing plastic waste important?',
    options: [
      'Because plastic disappears naturally in a few days.',
      'Because plastic pollution harms wildlife and marine ecosystems.',
      'Because plastic makes the ocean warmer.',
      'Because plastic increases oxygen in the water.',
    ],
    answer: 1,
  },
];

const About = () => {
  // ── Quiz state ──
  const [currentQ, setCurrentQ]       = useState(0);
  const [selected, setSelected]       = useState(null);
  const [result, setResult]           = useState('');   // 'correct' | 'incorrect' | ''

  const handleSubmit = () => {
    if (selected === quizData[currentQ].answer) {
      setResult('correct');
    } else {
      setResult('incorrect');
    }
  };

  const handleNext = () => {
    setCurrentQ(prev => prev + 1);
    setSelected(null);
    setResult('');
  };

  const q = quizData[currentQ]; // shorthand for the current question

  return (
    <div className="page">
      <div className="container">

        {/* ── Page Header ── */}
        <h1 className="page-title">About Environmental Advocacy</h1>
        <p className="page-subtitle">
          Exploring why our planet needs champions, and the personal journey
          that sparked this mission.
        </p>

        {/* ── Why It Matters + Image ── */}
        <div className="two-col">
          <div>
            <h2 className="section-title">Why It Matters</h2>
            <p className="body-text">
              Environmental advocacy helps protect ecosystems and future generations
              by promoting responsible use of natural resources and holding governments
              and industries accountable. It raises awareness about climate change,
              pollution, and biodiversity loss, encouraging individuals and communities
              to take action.
            </p>
          </div>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/assets/about1.jpg`}
              alt="Environmental impact"
              style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>

        <div className="section-divider" />

        {/* ── My Journey ── */}
        <h2 className="section-title">My Journey</h2>
        <div className="two-col">
          <ul className="step-list">
            {[
              {
                title: 'Learning Sustainability Basics',
                desc:  'Attending workshops and taking online courses about sustainable living.',
              },
              {
                title: 'Participating in Cleanups',
                desc:  'Joining local beach and park cleanups to see the real effects of pollution.',
              },
              {
                title: 'Promoting Eco-Friendly Habits',
                desc:  'Encouraging friends and family to reduce plastics and conserve energy.',
              },
            ].map((step, i) => (
              <li className="step-item" key={i}>
                <div className="step-num">{i + 1}</div>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/assets/about2.jpg`}
              alt="My journey"
              style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>

        {/* ── Quote ── */}
        <blockquote className="blockquote">
          "The Earth does not belong to us — we belong to the Earth."
        </blockquote>

        <div className="section-divider" />

        {/* ── Quiz ── */}
        <h2 className="section-title">Quick Knowledge Quiz</h2>
        <div className="card quiz-card">
          <p className="quiz-q">{q.question}</p>
          <p className="quiz-progress">Question {currentQ + 1} of {quizData.length}</p>

          <div className="options-list">
            {q.options.map((option, i) => (
              <button
                key={i}
                className={`option-btn ${selected === i ? 'selected' : ''}`}
                onClick={() => setSelected(i)}
              >
                <strong style={{ color: 'var(--primary)', marginRight: '8px' }}>
                  {String.fromCharCode(65 + i)}.
                </strong>
                {option}
              </button>
            ))}
          </div>

          <div className="quiz-footer">
            {/* Submit button — disabled until an answer is chosen */}
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={selected === null}
            >
              Submit Answer
            </button>

            {/* Show result after submitting */}
            {result && (
              <span className={`result-badge ${result}`}>
                {result === 'correct' ? '✅ Correct!' : '❌ Incorrect'}
              </span>
            )}

            {/* Next question button */}
            {result && currentQ < quizData.length - 1 && (
              <button className="btn-secondary" onClick={handleNext}>
                Next →
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;