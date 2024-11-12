const { albumSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError.js');
const Album = require('./models/music.js');
const Review = require('./models/review.js');

// Middleware to check if a user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
     // If the user is not authenticated
    if (!req.isAuthenticated()) {
        // Store the current URL in the session to redirect after login
        req.session.returnTo = req.originalUrl;
        // Flash an error message
        req.flash('error', 'You must be signed in');
         // Redirect to the login page
        return res.redirect('/musicspace/login');
    }
    next();  // Proceed to the next middleware/route handler
}

// Middleware to store the return URL in res.locals
module.exports.storeReturnTo = (req, res, next) => {
    // If there's a stored return URL in the session
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo; // Set it in res.locals for access in templates

    }
    next(); // Proceed to the next middleware/route handler
}
    // Middleware to validate album data
module.exports.validateAlbum = (req, res, next) => {
    const {error} = albumSchema.validate(req.body); // Validate the request body against album schema
    if(error) {
        const msg = error.details.map(el => el.message).join(','); // Construct an error message from validation details
        throw new ExpressError(msg, 400);  // Throw an ExpressError with status 400 and error message
    } else { 
        next();
    }
}

// Middleware to check if the user is the author of the album
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const album = await Album.findById(id);  // Find the album by ID
      if (!album.author.equals(req.user._id)) { // If the user is not the author of the album
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/musicspace/albums/${id}`); // Redirect to the album page

    }
    next();
}

// Middleware to validate review data
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Validate the request body against review schema
    if (error) {  // If validation fails
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next(); // Proceed to the next middleware/route handler
    }
}

// Middleware to check if the user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params; // Find the review by ID
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {  // If the user is not the author of the review
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/musicspace/albums/${id}`);
    } 
    next(); // Proceed to the next middleware/route handler
}