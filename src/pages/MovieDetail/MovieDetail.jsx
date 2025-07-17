import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Eye, 
  Download, 
  Star, 
  Calendar, 
  Clock, 
  Globe,
  Users,
  DollarSign,
  Award,
  Heart,
  Share2,
  Bookmark,
  ChevronRight
} from 'lucide-react';
import tmdbApi from '../../services/tmdbApi';
import VideoModal from '../../components/VideoModal';
import ContentGrid from '../../components/ContentGrid';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' }
  ];

  const downloadQualities = [
    { quality: 'SD', size: '1.2 GB' },
    { quality: 'HD', size: '2.8 GB' },
    { quality: 'Full HD', size: '4.5 GB' },
    { quality: '4K', size: '8.2 GB' }
  ];

  useEffect(() => {
    if (id) {
      fetchMovieData();
    }
  }, [id]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await tmdbApi.getMovieDetails(id);
      
      setMovie(data);
      setCast(data.credits?.cast?.slice(0, 10) || []);
      setCrew(data.credits?.crew?.slice(0, 5) || []);
      setVideos(data.videos?.results || []);
      setReviews(data.reviews?.results?.slice(0, 3) || []);
      setSimilarMovies(data.similar?.results?.slice(0, 12) || []);
      setRecommendations(data.recommendations?.results?.slice(0, 12) || []);
      setTranslations(data.translations?.translations || []);
      
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Failed to load movie details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (quality) => {
    alert(`Complete the CPA offer to download this movie in ${quality} quality!`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Check out ${movie.title} on StreamFlix`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    // In a real app, this would sync with backend
  };

  const getTrailerKey = () => {
    const trailer = videos.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer?.key || videos[0]?.key;
  };

  const getDirector = () => {
    return crew.find(person => person.job === 'Director')?.name || 'N/A';
  };

  const getTranslatedOverview = () => {
    const translation = translations.find(t => t.iso_639_1 === selectedLanguage);
    return translation?.data?.overview || movie.overview;
  };

  const formatBudget = (amount) => {
    return tmdbApi.formatCurrency(amount);
  };

  const formatRevenue = (amount) => {
    return tmdbApi.formatCurrency(amount);
  };

  if (loading) {
    return (
      <div className="movie-detail-loading">
        <div className="loading-container">
          <div className="loading-spinner" />
          <span>Loading movie details...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-error">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error || 'Movie not found'}</p>
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = tmdbApi.getImageURL(movie.backdrop_path, 'w1920_and_h800_multi_faces');
  const posterUrl = tmdbApi.getImageURL(movie.poster_path, 'w600_and_h900_bestv2');
  const rating = tmdbApi.formatRating(movie.vote_average);
  const releaseYear = tmdbApi.formatDate(movie.release_date);
  const runtime = tmdbApi.formatRuntime(movie.runtime);

  return (
    <div className="movie-detail">
      {/* Hero Section */}
      <section className="movie-hero">
        {backdropUrl && (
          <div className="hero-background">
            <img src={backdropUrl} alt={movie.title} />
            <div className="hero-gradient" />
          </div>
        )}
        
        <div className="hero-content">
          <div className="container">
            <motion.div 
              className="movie-header"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="movie-poster-container">
                <div className="movie-poster-sticky">
                  <img src={posterUrl} alt={movie.title} />
                  <div className="poster-overlay">
                    <button 
                      className="poster-play-btn"
                      onClick={() => setShowTrailer(true)}
                    >
                      <Play size={24} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="movie-info">
                <div className="movie-title-section">
                  <h1 className="movie-title">{movie.title}</h1>
                  {movie.tagline && (
                    <p className="movie-tagline">"{movie.tagline}"</p>
                  )}
                </div>

                <div className="movie-meta-grid">
                  <div className="meta-item">
                    <Star size={16} fill="#ffd700" color="#ffd700" />
                    <span className="meta-value rating-value">
                      {rating.text} ({movie.vote_count?.toLocaleString()} votes)
                    </span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span className="meta-value">{releaseYear}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span className="meta-value">{runtime}</span>
                  </div>
                  <div className="meta-item">
                    <Globe size={16} />
                    <span className="meta-value">{movie.original_language?.toUpperCase()}</span>
                  </div>
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="genre-tags">
                    {movie.genres.map((genre) => (
                      <Link
                        key={genre.id}
                        to={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                        className="genre-tag"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="movie-stats">
                  <div className="stat-item">
                    <DollarSign size={16} />
                    <div className="stat-content">
                      <span className="stat-label">Budget</span>
                      <span className="stat-value">{formatBudget(movie.budget)}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Award size={16} />
                    <div className="stat-content">
                      <span className="stat-label">Revenue</span>
                      <span className="stat-value">{formatRevenue(movie.revenue)}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Users size={16} />
                    <div className="stat-content">
                      <span className="stat-label">Director</span>
                      <span className="stat-value">{getDirector()}</span>
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <Link to={`/watch/${movie.id}`} className="btn-primary btn-watch">
                    <Play size={20} />
                    Watch Now
                  </Link>
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowTrailer(true)}
                  >
                    <Eye size={20} />
                    Watch Trailer
                  </button>
                  <button 
                    className={`btn-icon ${isInWatchlist ? 'active' : ''}`}
                    onClick={toggleWatchlist}
                    title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <Bookmark size={20} fill={isInWatchlist ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    className="btn-icon"
                    onClick={handleShare}
                    title="Share"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="movie-content">
        <div className="container">
          <div className="content-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'cast' ? 'active' : ''}`}
              onClick={() => setActiveTab('cast')}
            >
              Cast & Crew
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviews.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'download' ? 'active' : ''}`}
              onClick={() => setActiveTab('download')}
            >
              Download
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="tab-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="overview-content">
                  <div className="language-selector">
                    <h3>Select Language:</h3>
                    <div className="language-flags">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          className={`flag-btn ${selectedLanguage === lang.code ? 'active' : ''}`}
                          onClick={() => setSelectedLanguage(lang.code)}
                          title={lang.name}
                        >
                          <span className="flag-emoji">{lang.flag}</span>
                          <span className="flag-name">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="movie-description">
                    <h3>Plot Summary</h3>
                    <p>{getTranslatedOverview() || 'No description available for this movie.'}</p>
                  </div>

                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <div className="production-info">
                      <h3>Production Companies</h3>
                      <div className="production-companies">
                        {movie.production_companies.slice(0, 4).map((company) => (
                          <div key={company.id} className="company-item">
                            {company.logo_path && (
                              <img 
                                src={tmdbApi.getImageURL(company.logo_path, 'w200')}
                                alt={company.name}
                                className="company-logo"
                              />
                            )}
                            <span className="company-name">{company.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'cast' && (
                <div className="cast-content">
                  <div className="cast-section">
                    <h3>Main Cast</h3>
                    <div className="cast-grid">
                      {cast.map((person) => (
                        <div key={person.id} className="cast-card">
                          <div className="cast-photo">
                            <img 
                              src={tmdbApi.getImageURL(person.profile_path, 'w200') || 'https://via.placeholder.com/200x300/333/fff?text=No+Image'}
                              alt={person.name}
                              loading="lazy"
                            />
                          </div>
                          <div className="cast-info">
                            <h4 className="cast-name">{person.name}</h4>
                            <p className="cast-character">{person.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="crew-section">
                    <h3>Key Crew</h3>
                    <div className="crew-list">
                      {crew.map((person) => (
                        <div key={`${person.id}-${person.job}`} className="crew-item">
                          <span className="crew-name">{person.name}</span>
                          <span className="crew-job">{person.job}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-content">
                  {reviews.length > 0 ? (
                    <div className="reviews-list">
                      {reviews.map((review) => (
                        <div key={review.id} className="review-card">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <h4 className="reviewer-name">{review.author}</h4>
                              {review.author_details?.rating && (
                                <div className="review-rating">
                                  <Star size={14} fill="#ffd700" color="#ffd700" />
                                  <span>{review.author_details.rating}/10</span>
                                </div>
                              )}
                            </div>
                            <span className="review-date">
                              {tmdbApi.formatDate(review.created_at, 'short')}
                            </span>
                          </div>
                          <div className="review-content">
                            <p>
                              {review.content.length > 500 
                                ? `${review.content.substring(0, 500)}...`
                                : review.content
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-reviews">
                      <p>No reviews available for this movie yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'download' && (
                <div className="download-content">
                  <div className="download-header">
                    <h3>Download Options</h3>
                    <p>Choose your preferred quality and language</p>
                  </div>

                  <div className="download-language-selector">
                    <h4>Language: {languages.find(l => l.code === selectedLanguage)?.name}</h4>
                    <div className="language-flags">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          className={`flag-btn ${selectedLanguage === lang.code ? 'active' : ''}`}
                          onClick={() => setSelectedLanguage(lang.code)}
                        >
                          {lang.flag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="download-grid">
                    {downloadQualities.map((item, index) => (
                      <div key={index} className="download-card">
                        <div className="download-info">
                          <h4 className="download-quality">{item.quality} Quality</h4>
                          <p className="download-size">{item.size}</p>
                          <p className="download-lang">
                            {languages.find(l => l.code === selectedLanguage)?.name} Audio
                          </p>
                        </div>
                        <button
                          className="download-btn"
                          onClick={() => handleDownload(item.quality)}
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="download-notice">
                    <p>
                      <strong>Note:</strong> Complete a quick offer to unlock download links. 
                      This helps us keep the service free for everyone.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <ContentGrid
          title="More Like This"
          content={similarMovies}
          loading={false}
        />
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <ContentGrid
          title="Recommended for You"
          content={recommendations}
          loading={false}
        />
      )}

      {/* Video Modal */}
      <VideoModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        videoKey={getTrailerKey()}
      />
    </div>
  );
};

export default MovieDetail;