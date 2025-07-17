import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MovieCard from '../components/MovieCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchMovies(query);
    }
  }, [query]);

  const searchMovies = async (searchQuery) => {
    try {
      setLoading(true);
      const API_KEY = 'b7cd3340a794e5a2f35e3abb820b497f';
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setMovies(data.results?.filter(movie => movie.poster_path) || []);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Search Results for "{query}"
          </h2>
          <p className="section-subtitle">
            Found {movies.length} movies matching your search
          </p>
        </motion.div>

        {loading ? (
          <div className="loading">Searching movies...</div>
        ) : movies.length > 0 ? (
          <motion.div 
            className="movie-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="error">
            <h3>No Movies Found</h3>
            <p>Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;