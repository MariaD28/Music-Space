const express = require('express'); // Import express
const router = express.Router({mergeParams: true}); // Create a new router with mergeParams to access params from parent routers
const { reviewSchema } = require('../schemas.js'); // Import review schema for validation
const catchAsync = require('../utils/catchAsync.js'); // Import utility to catch and handle async errors
const ExpressError = require('../utils/ExpressError.js'); // Import custom Express error class
const Album = require('../models/music'); // Import Album model
const Review = require('../models/review');  // Import Review model
const albums = require('../controllers/reviews.js')  // Import review controller functions

 
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js'); // Import middleware functions

// Route to create a new review for an album
router.post('/', isLoggedIn, validateReview, catchAsync(albums.createReview));

// Route to delete a review from an album
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(albums.deleteReview))

// Export the router
module.exports = router;