import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Calendar } from 'lucide-react';
import tmdbApi from '../../services/tmdbApi';
import ContentGrid from '../../components/ContentGrid';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import './TopRated.css';

const TopRated = () => {
  const [activeMediaType, setActiveMediaType] = useState('movie');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const mediaTypes = [
    { id: 'movie', label: 'Movies', emoji: '🎬' },
    { id: 'tv', label: 'TV Shows', emoji: '📺' }
  ];

  useEffect(() => {
    fetchTopRatedContent();
  }, [activeMediaType, currentPage]);

  const fetchTopRatedContent = async () => {
    try {
      setLoading(true);
      const response = await tmdbApi.getTopRated(activeMediaType, currentPage);
      
      if (currentPage === 1) {
        setContent(response.results || []);
      } else {
        setContent(prev => [...prev, ...(response.results || [])]);
      }
      
      setTotalPages(response.total_pages || 1);
    } catch (error) {
      console.error('Error fetching top rated content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaTypeChange = (mediaType) => {
    if (mediaType === activeMediaType) return;
    setActiveMediaType(mediaType);
    setCurrentPage(1);
  };

  const handlePlayClick = async (item) => {
    try {
      const endpoint = activeMediaType === 'movie' ? 'getMovieDetails' : 'getTVDetails';
      const detailedItem = await tmdbApi[endpoint](item.id);
      
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

  const getPageTitle = () => {
    const mediaLabel = mediaTypes.find(m => m.id === activeMediaType)?.label;
    return `Top Rated ${mediaLabel}`;
  };

  const getPageDescription = () => {
    const mediaLabel = mediaTypes.find(m => m.id === activeMediaType)?.label.toLowerCase();
    return `Discover the highest rated ${mediaLabel} of all time. Curated by critics and audiences worldwide.`;
  };

  return (
    <div className="top-rated-page">
      <VideoPlayer 
        movie={selectedMovie}
        onClose={handleClosePlayer}
        isVisible={showVideoPlayer}
      />

      <div className="top-rated-content">
        {/* Hero Section */}
        <section className="top-rated-hero">
          <div className="container">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="hero-icon">
                <Award size={48} />
              </div>
              <h1 className="hero-title">{getPageTitle()}</h1>
              <p className="hero-description">{getPageDescription()}</p>
            </motion.div>
          </div>
        </section>

        {/* Filter Controls */}
        <section className="top-rated-filters">
          <div className="container">
            <div className="filters-container">
              <div className="filter-group">
                <h3 className="filter-title">Content Type</h3>
                <div className="toggle-group">
                  {mediaTypes.map((mediaType) => (
                    <button
                      key={mediaType.id}
                      className={`toggle-btn ${activeMediaType === mediaType.id ? 'active' : ''}`}
                      onClick={() => handleMediaTypeChange(mediaType.id)}
                      disabled={loading}
                    >
                      <span className="toggle-emoji">{mediaType.emoji}</span>
                      <span>{mediaType.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="top-rated-results">
          <div className="container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMediaType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ContentGrid
                  title=""
                  content={content}
                  loading={loading && currentPage === 1}
                  onPlayClick={handlePlayClick}
                  showRanking={true}
                />
              </motion.div>
            </AnimatePresence>

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
        <section className="top-rated-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{content.length}</div>
                <div className="stat-label">Top Rated Items</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  <Star size={24} fill="#ffd700" color="#ffd700" />
                </div>
                <div className="stat-label">Highest Quality</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {activeMediaType === 'movie' ? 'Movies' : 'TV Shows'}
                </div>
                <div className="stat-label">Content Type</div>
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

export default TopRated;