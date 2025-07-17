import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Star } from 'lucide-react';
import tmdbApi from '../../services/tmdbApi';
import ContentGrid from '../../components/ContentGrid';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import './Upcoming.css';

const Upcoming = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUpcomingContent();
  }, [currentPage]);

  const fetchUpcomingContent = async () => {
    try {
      setLoading(true);
      const response = await tmdbApi.getUpcoming(currentPage);
      
      if (currentPage === 1) {
        setContent(response.results || []);
      } else {
        setContent(prev => [...prev, ...(response.results || [])]);
      }
      
      setTotalPages(response.total_pages || 1);
    } catch (error) {
      console.error('Error fetching upcoming content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayClick = async (item) => {
    try {
      const detailedItem = await tmdbApi.getMovieDetails(item.id);
      
      setSelectedMovie(detailedItem);
      setShowVideoPlayer(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching item details:', error);
      setSelectedMovie(item);
      setShowVideoPlayer(true);
    }
  };

  const handleClosePlayer = () => {
    setShowVideoPlayer(false);
    setSelectedMovie(null);
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="upcoming-page">
      <VideoPlayer 
        movie={selectedMovie}
        onClose={handleClosePlayer}
        isVisible={showVideoPlayer}
      />

      <div className="upcoming-content">
        {/* Hero Section */}
        <section className="upcoming-hero">
          <div className="container">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="hero-icon">
                <Calendar size={48} />
              </div>
              <h1 className="hero-title">Upcoming Movies</h1>
              <p className="hero-description">
                Get ready for the most anticipated movies coming to theaters soon. 
                Stay ahead of the curve with our upcoming releases.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="upcoming-results">
          <div className="container">
            <ContentGrid
              title=""
              content={content}
              loading={loading && currentPage === 1}
              onPlayClick={handlePlayClick}
              showReleaseDate={true}
            />

            {/* Load More Button */}
            {content.length > 0 && currentPage < totalPages && (
              <div className="load-more-container">
                <button
                  className="load-more-btn"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More</span>
                      <span className="load-more-count">
                        ({content.length} of {totalPages * 20})
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="upcoming-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{content.length}</div>
                <div className="stat-label">Upcoming Movies</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  <Clock size={24} />
                </div>
                <div className="stat-label">Coming Soon</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">2024</div>
                <div className="stat-label">Release Year</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">HD</div>
                <div className="stat-label">Quality</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Upcoming;