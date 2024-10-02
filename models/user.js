const mongoose = require('mongoose'); // Import mongoose for database operations
const Schema = mongoose.Schema;  // Create a shorthand for mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose'); // Import passport-local-mongoose for authentication


// Define the schema for users
const userSchema = new Schema({
    email: {
        type: String,
        required: true,  // Email is required
        unique: true  // Email must be unique
    }
    // username: String // Username field is managed by passport-local-mongoose
});

// Add passport-local-mongoose plugin to handle username and password fields
userSchema.plugin(passportLocalMongoose);

// Export the User model based on the userSchema
module.exports = mongoose.model('User', userSchema);
