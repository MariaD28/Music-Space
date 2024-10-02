const mongoose = require('mongoose'); // Import mongoose for database operations
const Review = require('./review'); // Import the Review model
const Schema = mongoose.Schema; // Create a shorthand for mongoose.Schema

// Define the schema for images associated with albums
const ImageSchema = new Schema({
    url: String,
    filename: String
})

// Define a virtual property for creating image thumbnails
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200'); // Modify the image URL to point to a smaller version
})
 
const albumSchema = new Schema({
    name: String,
    artist: String,
    genre: String,
    year: Number,
    price: Number,
    images: [ImageSchema],
    video: String,
    description: String,
    genre: {
        type: String,
        enum: ['Rock', 'Pop', 'Soul', 'R&B', 'Classical'] // Add the genres you want to support
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'  // Reference to the user who created the album
    },
    tracks: [String],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' // References to reviews associated with the album
        }
    ]
});
 
// Middleware to delete associated reviews when an album is deleted
albumSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});
 // Export the Album model based on the albumSchema
module.exports = mongoose.model('Album', albumSchema);