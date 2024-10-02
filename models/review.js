const mongoose = require('mongoose'); // Import mongoose for database operations
const Schema = mongoose.Schema; // Create a shorthand for mongoose.Schema


// Define the schema for reviews
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the user who wrote the review
    }
});

// Export the Review model based on the reviewSchema
module.exports = mongoose.model('Review', reviewSchema);