const express = require('express'); // Import express
const multer = require('multer');  // Import multer for file uploads
const { storage } = require('../cloudinary'); // Import cloudinary storage configuration
const upload = multer({ storage }); // Configure multer to use cloudinary storage
const router = express.Router();  // Create a new router

const albums = require('../controllers/albums.js');  // Import album controller functions
const catchAsync = require('../utils/catchAsync.js'); // Import utility to catch and handle async errors
const { isLoggedIn, isAuthor, validateAlbum } = require('../middleware.js');  // Import middleware functions

const { searchSongs, getSongLyrics } = require('../utils/geniusAPI'); // Import Genius API utility functions
const Album = require('../models/music.js'); // Import Album model
const axios = require('axios'); // Import axios for HTTP requests


// Log response structure from Genius API
const logResponseStructure = async (query) => {
    try {
        const response = await searchSongs(query); // Fetch songs from Genius API
        console.log('Response structure:', response[0]); // Log the first response's structure
    } catch (error) {
        console.error('Error fetching data from Genius API:', error);
        throw error;
    }
};

// Call logResponseStructure to log the structure of the response from Genius API
logResponseStructure('query');

// Function to search local albums
const searchAlbums = (query, albums) => {
    const searchTerm = query.toLowerCase(); // Convert the search query to lowercase
    return albums.filter(album => {
        const name = album.name ? album.name.toLowerCase() : ''; // Convert album name to lowercase
        const artist = album.artist ? album.artist.toLowerCase() : ''; // Convert artist name to lowercase
        return name.includes(searchTerm) || artist.includes(searchTerm);  // Check if search term is in name or artist
    });
};

// Combined search route for both local albums and Genius API
router.get('/search', catchAsync(async (req, res) => {
    const searchTerm = req.query.q; // Get the search term from query parameters
    const source = req.query.source; // Get the search source from query parameters
    console.log('Search Term:', searchTerm);
    console.log('Search Source:', source);
    
    if (!searchTerm) {
        return res.redirect('/musicspace/albums');  // Redirect if no search term
    }
    
    let localSearchResults = [];
    let geniusSearchResults = [];
    
    if (source === 'local' || !source) {
        const albums = await Album.find({}); // Find all local albums
        localSearchResults = searchAlbums(searchTerm, albums); 
    }
    
    if (source === 'genius') {
        try {
            geniusSearchResults = await searchSongs(searchTerm);
        } catch (error) {
            console.error('Error searching songs:', error);
            req.flash('error', 'Error searching songs');
        }
    }

    res.render('music/searchResults', { 
        albums: localSearchResults, 
        searchResults: geniusSearchResults,
        searchTerm,
        source
    });
}));

// Route to fetch and display song lyrics
router.get('/lyrics/:path', catchAsync(async (req, res) => {
    const songPath = req.params.path; // Get the song path from the route parameters
    try {
        const lyrics = await getSongLyrics(songPath); // Fetch song lyrics from Genius API
        res.render('music/lyrics', { lyrics }); // Render the lyrics page with fetched lyrics
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        req.flash('error', 'Error fetching lyrics');
        res.redirect('/musicspace/albums'); // Redirect to albums page
    }
}));

// Route for displaying and creating albums
router.route('/')
    .get(catchAsync(albums.index)) // Get and display all albums
    .post(isLoggedIn, upload.array('image'), validateAlbum, catchAsync(albums.createAlbum)); // Create a new album
       
router.get('/new', isLoggedIn, albums.renderNewForm); // Display form to create a new album


// Route for displaying, updating, and deleting a specific album
router.route('/:id')
    .get(catchAsync(albums.showAlbum))  // Get and display a specific album
    .put(isLoggedIn, isAuthor, upload.array('image'), validateAlbum, catchAsync(albums.updateAlbum)) // Update a specific album
    .delete(isLoggedIn, isAuthor, catchAsync(albums.deleteAlbum)); // Delete a specific album

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(albums.renderEditForm)); // Display form to edit a specific album

// Export the router
module.exports = router;
