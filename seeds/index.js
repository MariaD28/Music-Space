const mongoose = require('mongoose'); // require Mongoose DB to the app
const musicAlbums = require('./musicAlbums'); // require musicAlbums.js under seeds dir
const Album = require('../models/music'); // import Album model to the app


mongoose.connect('mongodb://127.0.0.1:27017/musicSpace')

    .then(() => {
        console.log('Connected to Database');
    })
    .catch(err => {
        console.log('Error: ', err.message);
    });

    
    const seedDB = async () => {
        await Album.deleteMany({}); // delete everything
        const author = '665d073b4d1f5b6d130024af'; // specify the author
        for (const albumData of musicAlbums) {
            const album = new Album({
                author, // set the author
                ...albumData // spread in the rest of the album data
            });
            await album.save(); // Save each album to the database
        }
    };
    
    // Call the seedDB function to seed the database with music albums data
    seedDB().then(() => {
        mongoose.connection.close();  // Close the MongoDB connection after seeding is complete
    });