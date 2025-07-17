import React from 'react';
import { motion } from 'framer-motion';

const ContentToggle = ({ activeMode, onModeChange, loading = false }) => {
  const modes = [
    { id: 'movies', label: 'Movies', icon: '🎬' },
    { id: 'tv', label: 'TV Shows', icon: '📺' }
  ];

  return (
    <div className="content-toggle-container">
      <div className="content-toggle">
        <div className="toggle-background">
          <motion.div
            className="toggle-slider"
            animate={{
              x: activeMode === 'movies' ? 0 : '100%'
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        </div>
        
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`toggle-option ${activeMode === mode.id ? 'active' : ''}`}
            onClick={() => !loading && onModeChange(mode.id)}
            disabled={loading}
            aria-pressed={activeMode === mode.id}
          >
            <span className="toggle-icon">{mode.icon}</span>
            <span className="toggle-label">{mode.label}</span>
            {loading && activeMode === mode.id && (
              <div className="toggle-loading">
                <div className="loading-spinner" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContentToggle;