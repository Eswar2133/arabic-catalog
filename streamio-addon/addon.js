const Streamio = require('streamio');

// Define the behavior when a user searches for content
Streamio.on('search', async function(query) {
    try {
        // Fetch movies, TV shows, or web series from your backend
        const response = await fetch(`https://arabic-catalog.onrender.com/search?query=${query}`);
        const movies = await response.json();

        // Check if we got results and format them for Streamio
        const results = movies.map(movie => ({
            title: movie.title || movie.name,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            overview: movie.overview,
            rating: movie.vote_average,
            releaseDate: movie.release_date || movie.first_air_date,
            id: movie.id
        }));

        // Return the results to Streamio
        return results;
    } catch (error) {
        console.error("Error fetching data from the API:", error);
        return [];
    }
});

// Define the behavior for browsing popular or new content
Streamio.on('browse', async function() {
    try {
        const response = await fetch('https://arabic-catalog.onrender.com/discover?genre=28&page=1');  // Example: Action movies
        const movies = await response.json();

        const results = movies.map(movie => ({
            title: movie.title || movie.name,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            overview: movie.overview,
            rating: movie.vote_average,
            releaseDate: movie.release_date || movie.first_air_date,
            id: movie.id
        }));

        return results;
    } catch (error) {
        console.error("Error fetching data from the API:", error);
        return [];
    }
});
