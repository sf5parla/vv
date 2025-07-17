
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ContentToggle from '../components/ContentToggle';
import TrendingSection from '../components/TrendingSection';
import VideoPlayer from '../components/VideoPlayer';
import tmdbApi from '../services/tmdbApi';

const Home = () => {
  const [activeMode, setActiveMode] = useState('movies');
  const [content, setContent] = useState({
    trending: { movies: [], tv: [] },
    popular: { movies: [], tv: [] },
    topRated: { movies: [], tv: [] },
    upcoming: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      
      // Fetch trending content
      const [trendingMovies, trendingTV] = await Promise.all([
        tmdbApi.getTrending('movie', 'week'),
        tmdbApi.getTrending('tv', 'week')
      ]);

      // Fetch popular content
      const [popularMovies, popularTV] = await Promise.all([
        tmdbApi.getPopular('movie'),
        tmdbApi.getPopular('tv')
      ]);

      // Fetch top rated content
      const [topRatedMovies, topRatedTV] = await Promise.all([
        tmdbApi.getTopRated('movie'),
        tmdbApi.getTopRated('tv')
      ]);

      // Fetch upcoming movies
      const upcomingMovies = await tmdbApi.getUpcoming();

      setContent({
        trending: {
          movies: trendingMovies.results?.slice(0, 6) || [],
          tv: trendingTV.results?.slice(0, 6) || []
        },
        popular: {
          movies: popularMovies.results?.slice(0, 6) || [],
          tv: popularTV.results?.slice(0, 6) || []
        },
        topRated: {
          movies: topRatedMovies.results?.slice(0, 6) || [],
          tv: topRatedTV.results?.slice(0, 6) || []
        },
        upcoming: upcomingMovies.results?.slice(0, 6) || []
      });

    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode) => {
    setActiveMode(newMode);
  };

  const handlePlayClick = async (movie) => {
    try {
      const response = await tmdbApi.getMovieDetails(movie.id);
      setSelectedMovie(response);
      setShowVideoPlayer(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setSelectedMovie(movie);
      setShowVideoPlayer(true);
    }
  };

  const handleClosePlayer = () => {
    setShowVideoPlayer(false);
    setSelectedMovie(null);
  };

  return (
    <div className="home-page">
      <VideoPlayer 
        movie={selectedMovie}
        onClose={handleClosePlayer}
        isVisible={showVideoPlayer}
      />
      
      <motion.div
        className="content-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Enhanced Hero Section */}
        <section className="hero-section-enhanced">
          <div className="hero-background">
            <img 
              src="https://images.unsplash.com/photo-1489599217771-130c537e0c84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Hero background"
            />
            <div className="hero-gradient" />
          </div>
          
          <div className="hero-content-enhanced">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="hero-title-enhanced">
                  Welcome to StreamFlix
                </h1>
                <p className="hero-description-enhanced">
                  Discover thousands of movies and TV shows. Watch trending content, 
                  explore top-rated films, and find your next favorite series.
                </p>
                <div className="hero-buttons-enhanced">
                  <Link to="/trending" className="hero-btn-primary">
                    🔥 Explore Trending
                  </Link>
                  <Link to="/top-rated" className="hero-btn-secondary">
                    ⭐ Top Rated
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quick Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎬</div>
                <div className="stat-number">50K+</div>
                <div className="stat-label">Movies</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📺</div>
                <div className="stat-number">20K+</div>
                <div className="stat-label">TV Shows</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-number">Daily</div>
                <div className="stat-label">Updates</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-number">HD</div>
                <div className="stat-label">Quality</div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Toggle */}
        <section className="toggle-section">
          <div className="container">
            <ContentToggle 
              activeMode={activeMode}
              onModeChange={handleModeChange}
              loading={loading}
            />
          </div>
        </section>

        {/* Trending Section */}
        <section className="content-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🔥 Trending This Week</h2>
              <Link to="/trending" className="section-link">View All</Link>
            </div>
            <TrendingSection
              content={content.trending[activeMode]}
              loading={loading}
              contentType={activeMode}
              onPlayClick={handlePlayClick}
            />
          </div>
        </section>

        {/* Popular Section */}
        <section className="content-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🌟 Popular {activeMode === 'movies' ? 'Movies' : 'TV Shows'}</h2>
              <Link to={activeMode === 'movies' ? '/popular-movies' : '/popular-tv'} className="section-link">View All</Link>
            </div>
            <TrendingSection
              content={content.popular[activeMode]}
              loading={loading}
              contentType={activeMode}
              onPlayClick={handlePlayClick}
            />
          </div>
        </section>

        {/* Top Rated Section */}
        <section className="content-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">⭐ Top Rated {activeMode === 'movies' ? 'Movies' : 'TV Shows'}</h2>
              <Link to="/top-rated" className="section-link">View All</Link>
            </div>
            <TrendingSection
              content={content.topRated[activeMode]}
              loading={loading}
              contentType={activeMode}
              onPlayClick={handlePlayClick}
            />
          </div>
        </section>

        {/* Upcoming Movies Section (only for movies) */}
        {activeMode === 'movies' && (
          <section className="content-section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">🎭 Coming Soon</h2>
                <Link to="/upcoming" className="section-link">View All</Link>
              </div>
              <TrendingSection
                content={content.upcoming}
                loading={loading}
                contentType="movies"
                onPlayClick={handlePlayClick}
              />
            </div>
          </section>
        )}

        {/* Browse by Genre Section */}
        <section className="genres-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🎯 Browse by Genre</h2>
            </div>
            <div className="genres-grid">
              <Link to="/genre/28?name=Action" className="genre-card action">
                <span className="genre-icon">💥</span>
                <span className="genre-name">Action</span>
              </Link>
              <Link to="/genre/35?name=Comedy" className="genre-card comedy">
                <span className="genre-icon">😂</span>
                <span className="genre-name">Comedy</span>
              </Link>
              <Link to="/genre/18?name=Drama" className="genre-card drama">
                <span className="genre-icon">🎭</span>
                <span className="genre-name">Drama</span>
              </Link>
              <Link to="/genre/27?name=Horror" className="genre-card horror">
                <span className="genre-icon">👻</span>
                <span className="genre-name">Horror</span>
              </Link>
              <Link to="/genre/10749?name=Romance" className="genre-card romance">
                <span className="genre-icon">💕</span>
                <span className="genre-name">Romance</span>
              </Link>
              <Link to="/genre/878?name=Sci-Fi" className="genre-card scifi">
                <span className="genre-icon">🚀</span>
                <span className="genre-name">Sci-Fi</span>
              </Link>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Home;
