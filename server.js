const express = require('express');
const axios = require('axios');

// Initialize the Express app
const app = express();

// Access the TMDb API Key from environment variables
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const port = process.env.PORT || 3000;

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Arabic Movie Addon API!');
});

// Search route (Search movies, TV shows, and web series using TMDb API)
app.get('/search', async (req, res) => {
  const query = req.query.query || '';  // Get the search query or default to empty string
  const encodedQuery = encodeURIComponent(query);  // URL encode the query

  const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodedQuery}&language=ar`;

  try {
    const response = await axios.get(url); // Fetch data from TMDb API
    const results = response.data.results;

    // If no results found for the query, fallback to fetching popular Arabic content
    if (results.length === 0) {
      const popularUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=ar&sort_by=popularity.desc&page=1`;
      const popularResponse = await axios.get(popularUrl);
      return res.json(popularResponse.data.results);  // Return popular Arabic movies
    }

    // Filter the results by checking if they are movies, TV shows, or web series
    const filteredResults = results.filter(result => {
      return result.title || result.name;  // Check for movie or TV show
    });

    // Return filtered or all results if nothing matched
    res.json(filteredResults);
  } catch (error) {
    console.error('Error fetching data from TMDb API:', error.response || error.message);
    res.status(500).json({ error: 'Error fetching data from TMDb API' });
  }
});

// Discover route for Arabic content by genre (includes TV shows and web series)
app.get('/discover', async (req, res) => {
  const genre = req.query.genre || '';  // Genre passed in the URL query
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=ar&with_genres=${genre}&sort_by=popularity.desc`;

  try {
    const response = await axios.get(url); // Fetch data from TMDb API
    const movies = response.data.results;

    if (movies.length === 0) {
      return res.status(404).json({ error: 'No movies found for this genre' });
    }

    res.json(movies);  // Return movies for the specific genre
  } catch (error) {
    console.error('Error fetching data from TMDb API:', error.response || error.message);
    res.status(500).json({ error: 'Error fetching data from TMDb API' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
