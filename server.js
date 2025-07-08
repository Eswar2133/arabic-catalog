const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

// TMDb API Key (Make sure to set this as an environment variable on Render)
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Arabic Movie Addon API!');
});

// Search route - Search movies using TMDb API
app.get('/search', async (req, res) => {
  const query = req.query.query; // Get the search query from URL
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;
  
  try {
    const response = await axios.get(url); // Get data from TMDb API
    res.json(response.data.results); // Return the results as JSON
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from TMDb API' });
  }
});

// Scrape route - Scrape torrent links for a movie
app.get('/scrape', async (req, res) => {
  const movieTitle = req.query.title; // Get the movie title from URL
  const torrentSiteUrl = `https://example-torrent-site.com/search?q=${movieTitle}`; // Replace with actual site
  
  try {
    const { data } = await axios.get(torrentSiteUrl);
    const $ = cheerio.load(data); // Load the HTML of the page
    const torrentLinks = [];
    
    $('a.torrent-link').each((i, element) => {
      torrentLinks.push($(element).attr('href')); // Scrape each link
    });
    
    res.json(torrentLinks); // Return torrent links
  } catch (error) {
    res.status(500).json({ error: 'Error scraping torrent site' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
