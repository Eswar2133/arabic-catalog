const express = require('express');
const axios = require('axios');
const app = express();

// Access the TMDb API Key from environment variables
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const port = process.env.PORT || 3000;

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Arabic Movie Addon API!');
});

// Search route (Search movies using TMDb API)
app.get('/search', async (req, res) => {
  const query = req.query.query;  // Get the search query from the URL
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;

  try {
    const response = await axios.get(url); // Fetch data from TMDb API
    const movies = response.data.results;

    // Filter the movies that contain the query in their title (case insensitive)
    const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()));

    if (filteredMovies.length === 0) {
      return res.status(404).json({ error: `No movies found for "${query}"` });
    }

    // Send filtered movie data as JSON to the frontend
    res.json(filteredMovies);
  } catch (error) {
    console.error('Error fetching data from TMDb API:', error.response || error.message);
    res.status(500).json({ error: 'Error fetching data from TMDb API' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
