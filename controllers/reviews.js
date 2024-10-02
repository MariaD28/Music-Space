const Album = require('../models/music.js'); // Import Album model from music.js file
const Review = require('../models/review.js'); // Import Review model from review.js file

// Function to create a new review for an album
module.exports.createReview = async (req, res) => {
    const {id} = req.params; // Extract the album ID from requesr parameters
    const album = await Album.findById(id); // Find the album by ID
    const review = new Review(req.body.review); // Create a new review instance with data from the request body
    review.author = req.user._id; // Set the review author to the current user's ID
    album.reviews.push(review); // Add the new review to the album's reviews array
    await review.save(); // Save the new review to the database
    await album.save(); // Save the updated album to the database
    req.flash('success', 'Created new review!')
    res.redirect(`/musicspace/albums/${album._id}`); // Redirect to the album's show page
}

// Function to delete a review from an album
module.exports.deleteReview = async (req, res) =>{
    const { id, reviewId } = req.params;
    await Album.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});  // Find the album by ID and remove the review from its reviews array
    await Review.findByIdAndDelete(reviewId);  // Find and delete the review by ID
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/musicspace/albums/${id}`); // Redirect to the album's show page
}
