const User = require('../models/user'); // Import the User model from the user.js file

// Function to render the registration form
module.exports.renderRegister = (req, res) => {
    res.render('users/register') // Render the register page
}

// Function to register a new user
module.exports.registerUser = async(req, res) => {
    try {
         const { email, username, password } = req.body; // Extract email, username, and password from the request body
         const user = new User ({ email, username });  // Create a new user instance with email and username
         const registeredUser = await User.register(user, password); // Register the user with the given password
         req.login(registeredUser, err => { // Automatically log in the registered user
             if (err) return next(err); // Handle login errors
             req.flash('success', 'Welcome to MUSIC SPACE!')
             res.redirect('/musicspace/albums'); // Redirect to the albums page
         })
     } catch (e) {
         req.flash('error', e.message); // use the message from Joi
         return res.redirect('./register');  // Redirect back to the register page
     }
 }

 // Function to render the login form
module.exports.renderLogin = (req, res) => {
    res.render('users/login'); // Render the login page
}

// Function to log in a user
module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/musicspace/albums'; // Redirect to the previous URL or the albums page
    res.redirect(redirectUrl); // Perform the redirection
}

// Function to log out a user
module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) { // Log out the user
        if(err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/musicspace'); // Redirect to the splash page
    });
}