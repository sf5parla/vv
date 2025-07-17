import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroCarousel = ({ featuredMovies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Auto-switch every 5 seconds
  useEffect(() => {
    if (featuredMovies.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [featuredMovies.length]);

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
    // Reset auto-play timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
      }, 5000);
    }
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? featuredMovies.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % featuredMovies.length;
    goToSlide(newIndex);
  };

  // Handle trailer audio
  const toggleAudio = async () => {
    if (!isPlaying && audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch (error) {
        console.log('Audio play failed:', error);
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsMuted(true);
    }
  };

  if (!featuredMovies.length) {
    return (
      <div className="hero-carousel">
        <div className="hero-skeleton" />
      </div>
    );
  }

  const currentMovie = featuredMovies[currentIndex];
  const backdropUrl = currentMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${currentMovie.backdrop_path}`
    : null;

  return (
    <div className="hero-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="hero-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {backdropUrl && (
            <div className="hero-background">
              <img src={backdropUrl} alt={currentMovie.title || currentMovie.name} />
              <div className="hero-gradient" />
            </div>
          )}
          
          <div className="hero-content">
            <div className="hero-info">
              <motion.h1 
                className="hero-title"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {currentMovie.title || currentMovie.name}
              </motion.h1>
              
              <motion.div 
                className="hero-meta"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <span className="hero-rating">
                  ★ {currentMovie.vote_average?.toFixed(1) || 'N/A'}
                </span>
                <span className="hero-year">
                  {new Date(currentMovie.release_date || currentMovie.first_air_date).getFullYear()}
                </span>
                <span className="hero-type">
                  {currentMovie.title ? 'Movie' : 'TV Series'}
                </span>
              </motion.div>
              
              <motion.p 
                className="hero-description"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {currentMovie.overview?.length > 200 
                  ? currentMovie.overview.substring(0, 200) + '...'
                  : currentMovie.overview
                }
              </motion.p>
              
              <motion.div 
                className="hero-buttons"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Link 
                  to={`/watch/${currentMovie.id}`} 
                  className="hero-btn hero-btn-play"
                >
                  <Play size={20} fill="currentColor" />
                  Play
                </Link>
                <Link 
                  to={`/movie/${currentMovie.id}`} 
                  className="hero-btn hero-btn-info"
                >
                  <Info size={20} />
                  More Info
                </Link>
              </motion.div>
            </div>

            <div className="hero-controls">
              <button 
                className="volume-btn"
                onClick={toggleAudio}
                title={isMuted ? "Turn on sound" : "Turn off sound"}
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              
              <div className="maturity-rating">
                18+
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {featuredMovies.length > 1 && (
            <>
              <button className="hero-nav hero-nav-prev" onClick={goToPrevious}>
                <ChevronLeft size={32} />
              </button>
              <button className="hero-nav hero-nav-next" onClick={goToNext}>
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Tactile Navigation Dots */}
      {featuredMovies.length > 1 && (
        <div className="hero-indicators">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`hero-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hidden audio element for trailer sound */}
      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        preload="none"
      >
        <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
      </audio>
    </div>
  );
};

export default HeroCarousel;