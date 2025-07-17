import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Calendar, Clock, Info, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrendingSection = ({ content = [], loading = false, contentType = 'movies' }) => {
  const [hoveredItem, setHoveredItem] = React.useState(null);
  const [watchlist, setWatchlist] = React.useState(new Set());

  const toggleWatchlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newWatchlist = new Set(watchlist);
    if (newWatchlist.has(id)) {
      newWatchlist.delete(id);
    } else {
      newWatchlist.add(id);
    }
    setWatchlist(newWatchlist);
  };

  const handlePlayClick = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle play functionality
  };

  if (loading) {
    return (
      <section className="trending-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              🔥 Trending Now
            </h2>
          </div>
          <div className="trending-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="trending-card-skeleton">
                <div className="skeleton-poster" />
                <div className="skeleton-content">
                  <div className="skeleton-title" />
                  <div className="skeleton-meta" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!content || content.length === 0) {
    return (
      <section className="trending-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              🔥 Trending Now
            </h2>
          </div>
          <div className="no-content">
            <p>No trending {contentType} available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="trending-section">
      <div className="container">
        <div className="section-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🔥 Trending Now
          </motion.h2>
        </div>
        
        <motion.div 
          className="trending-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {content.slice(0, 6).map((item, index) => {
              const posterUrl = item.poster_path 
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : 'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Image';
              
              const title = item.title || item.name || 'Untitled';
              const year = item.release_date || item.first_air_date 
                ? new Date(item.release_date || item.first_air_date).getFullYear()
                : 'N/A';
              
              const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
              const isInWatchlist = watchlist.has(item.id);

              return (
                <motion.div
                  key={`${contentType}-${item.id}`}
                  className="trending-card"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{ y: -12, scale: 1.03 }}
                >
                  <Link to={`/${contentType === 'tv' ? 'tv' : 'movie'}/${item.id}`} className="card-link">
                    <div className="card-poster">
                      <img 
                        src={posterUrl} 
                        alt={`${title} poster`}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x450/1a1a1a/666?text=No+Image';
                        }}
                      />
                      
                      <div className="card-badges">
                        <div className="rating-badge">
                          <Star size={12} fill="currentColor" />
                          <span>{rating}</span>
                        </div>
                        <div className="quality-badge">HD</div>
                      </div>

                      <div className="trending-rank">
                        <span className="rank-number">{index + 1}</span>
                      </div>

                      <AnimatePresence>
                        {hoveredItem === item.id && (
                          <motion.div
                            className="card-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="overlay-content">
                              <button 
                                className="play-btn"
                                onClick={(e) => handlePlayClick(item, e)}
                                aria-label={`Play ${title}`}
                              >
                                <Play size={24} fill="currentColor" />
                              </button>
                              
                              <div className="overlay-actions">
                                <button 
                                  className={`action-btn ${isInWatchlist ? 'active' : ''}`}
                                  onClick={(e) => toggleWatchlist(item.id, e)}
                                  aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                                >
                                  {isInWatchlist ? <Check size={16} /> : <Plus size={16} />}
                                </button>
                                
                                <Link 
                                  to={`/${contentType === 'tv' ? 'tv' : 'movie'}/${item.id}`}
                                  className="action-btn"
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={`More info about ${title}`}
                                >
                                  <Info size={16} />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="card-content">
                      <h3 className="card-title">{title}</h3>
                      <div className="card-meta">
                        <span className="card-year">
                          <Calendar size={12} />
                          {year}
                        </span>
                        <span className="card-type">
                          {contentType === 'tv' ? 'TV Show' : 'Movie'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingSection;