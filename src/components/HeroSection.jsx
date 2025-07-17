import React from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = ({ featuredMovie }) => {
  const [isMuted, setIsMuted] = React.useState(true);

  if (!featuredMovie) {
    return (
      <div className="hero-section-netflix">
        <div className="hero-skeleton" />
      </div>
    );
  }

  const backdropUrl = featuredMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${featuredMovie.backdrop_path}`
    : null;

  return (
    <div className="hero-section-netflix">
      {backdropUrl && (
        <div className="hero-background">
          <img src={backdropUrl} alt={featuredMovie.title} />
          <div className="hero-gradient" />
        </div>
      )}
      
      <div className="hero-content-netflix">
        <div className="hero-info">
          <h1 className="hero-title-netflix">{featuredMovie.title}</h1>
          <p className="hero-description">
            {featuredMovie.overview?.length > 200 
              ? featuredMovie.overview.substring(0, 200) + '...'
              : featuredMovie.overview
            }
          </p>
          
          <div className="hero-buttons">
            <Link to={`/watch/${featuredMovie.id}`} className="hero-btn hero-btn-play">
              <Play size={20} fill="currentColor" />
              Play
            </Link>
            <Link to={`/movie/${featuredMovie.id}`} className="hero-btn hero-btn-info">
              <Info size={20} />
              More Info
            </Link>
          </div>
        </div>

        <div className="hero-controls">
          <button 
            className="volume-btn"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          
          <div className="maturity-rating">
            18+
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;