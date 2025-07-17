import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

const WatchMovie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCPAOffer, setShowCPAOffer] = useState(false);
  const videoRef = useRef(null);

  // Demo video URL - in production, this would come from your video service
  const demoVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const pauseTime = 5; // seconds

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
      fetchRelatedMovies();
    }
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const API_KEY = 'b7cd3340a794e5a2f35e3abb820b497f';
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
      );
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedMovies = async () => {
    try {
      const API_KEY = 'b7cd3340a794e5a2f35e3abb820b497f';
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`
      );
      const data = await response.json();
      setRelatedMovies(data.results?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching related movies:', error);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= pauseTime && !showCPAOffer) {
      videoRef.current.pause();
      setShowCPAOffer(true);
    }
  };

  const handleCPAComplete = () => {
    // Simulate CPA offer completion
    alert('Thank you for completing the offer! You can now continue watching.');
    setShowCPAOffer(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  if (loading) {
    return <div className="loading">Loading movie...</div>;
  }

  if (!movie) {
    return (
      <div className="error">
        <h3>Movie Not Found</h3>
        <p>The requested movie could not be found.</p>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop_path}`
    : null;

  return (
    <div className="content-section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="video-container">
            <video
              ref={videoRef}
              className="video-player"
              poster={backdropUrl}
              controls
              controlsList="nodownload"
              onTimeUpdate={handleTimeUpdate}
            >
              <source src={demoVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {showCPAOffer && (
            <motion.div
              className="cpa-offer-overlay"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
            >
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '3rem',
                borderRadius: '12px',
                textAlign: 'center',
                maxWidth: '500px',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 style={{ marginBottom: '1rem', color: '#e50914' }}>
                  Continue Watching
                </h2>
                <p style={{ marginBottom: '2rem', color: '#b3b3b3' }}>
                  To continue watching this movie, please complete a quick offer below.
                </p>
                <button
                  onClick={handleCPAComplete}
                  className="btn-primary"
                  style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
                >
                  Complete Offer & Continue
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <section className="mt-4">
            <h2 className="section-title">Related Movies</h2>
            <div className="movie-grid">
              {relatedMovies.map((relatedMovie) => (
                <motion.div
                  key={relatedMovie.id}
                  className="movie-card"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="movie-poster">
                    <img 
                      src={`https://image.tmdb.org/t/p/w220_and_h330_face${relatedMovie.poster_path}`}
                      alt={relatedMovie.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">
                      {relatedMovie.title.length > 20 
                        ? relatedMovie.title.substring(0, 20) + '...'
                        : relatedMovie.title
                      }
                    </h3>
                    <Link to={`/movie/${relatedMovie.id}`} className="btn btn-primary">
                      <Eye size={16} /> View
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default WatchMovie;