if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
    console.log(process.env.SECRET)
};

const express = require('express'); // require Express
const path = require('path'); // require the path for the routes
const mongoose = require('mongoose'); // require Mongoose DB to the app
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); // require ejs-mate for layout (boilerplate.ejs)
const session = require('express-session');
const flash = require('connect-flash');
const axios = require('axios');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


// <-- Import required routes -->
const userRoutes = require('./routes/users');
const albumRoutes = require('./routes/albums');
const reviewRoutes = require('./routes/reviews');


// <-- Access environment variables -->
const CLIENT_ID = process.env.GENIUS_CLIENT_ID;
const CLIENT_SECRET = process.env.GENIUS_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';


// <-- Connect to MongoDB -->
mongoose.connect('mongodb://127.0.0.1:27017/musicSpace') 
    .then(() => {
        console.log('Connected to Database');
    })
    .catch(err => {
        console.log('Error: ', err.message);
    });

const app = express(); // execute Express (TESTING)

// <-- Set up middleware -->
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs'); // set ejs as the view engine
app.set('views', path.join(__dirname, 'views')); // connect the path of 'views' directory
app.use(express.urlencoded({ extended: true })) // access req.body (parse)
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // for public access to images

// <-- Session configuration -->
const sessionConfig = {
    secret: 'thisshouldbebetterasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

// <-- Passport middleware -->
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser()); // (store) user in session
passport.deserializeUser(User.deserializeUser()); // (store) user out of session 

// <-- Middleware to set local variables -->
app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user; // setting the user globally
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

// <-- Routes -->
app.use('/', userRoutes)
app.use('/musicspace/albums', albumRoutes)
app.use('/musicspace/albums/:id/reviews', reviewRoutes);

// <-- Genius API authorization route -->
app.get('/auth/genius', (req, res) => {
    const authUrl = `https://api.genius.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=me&response_type=code`;
    res.redirect(authUrl);
});

// <-- Genius API callback route -->
app.get('/callback', async (req, res) => {
    const authorizationCode = req.query.code;
    if (!authorizationCode) {
        return res.send('Authorization code not provided');
    }
    try {
        const tokenResponse = await axios.post('https://api.genius.com/oauth/token', {
            code: authorizationCode,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            response_type: 'code',
            grant_type: 'authorization_code'
        });
        const accessToken = tokenResponse.data.access_token;
        // Use the access token to make API requests or perform other actions
        res.send(`Access token received: ${accessToken}`);
    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error.response.data);
        res.send('Error during the authorization process');
    }
});

// <-- Splash page route -->
app.get('/musicspace', (req, res) => {
    res.render('splash');
});

// <-- Home page route -->
app.get('/musicspace/home', (req, res) => {
    res.render('home');
});

// Catch-all route for 404 errors
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// <-- Error handling middleware -->
app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('error', {err});
});

// <-- Start the server -->
app.listen(3000, () => { // app listener
    console.log('Server is running on port 3000');
});
