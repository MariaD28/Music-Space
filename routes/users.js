const express = require('express');  // Import express
const router = express.Router();  // Create a new router
const catchAsync = require('../utils/catchAsync'); // Import utility to catch and handle async errors
const users = require('../controllers/users'); // Import user controller functions
const User = require('../models/user'); // Import User model
const passport = require('passport'); // Import passport for authentication
const { storeReturnTo } = require('../middleware'); // Import middleware to store returnTo path

// Route to display the registration form and register a new user
router.route('/musicspace/register')
    .get(users.renderRegister) // Display the registration form
    .post(catchAsync(users.registerUser)) // Handle registration form submission


// Route to display the login form and log in a user
router.route('/musicspace/login')
    .get(users.renderLogin) // Display the login form
    .post( storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/musicspace/login'}), users.loginUser) // Middleware to store the original URL the user wanted to access

    // Route to log out a user
router.get('/logout', users.logoutUser) // Handle successful login


// Export the router
module.exports = router;