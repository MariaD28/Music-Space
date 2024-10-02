const Album = require('../models/music.js'); // Find all albums in database
const {cloudinary} = require('../cloudinary'); // Render index page with retrived albums

// Function to display all albums
module.exports.index = async(req, res) => {
    const albums = await Album.find({});
    res.render('music/index', {albums});
}

// Function to render the form to create a new album
module.exports.renderNewForm = (req, res) => {
    res.render('music/new');
}

// Function to create a new album
module.exports.createAlbum = async (req, res, next) => {
    const album = await Album(req.body.album);
    album.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    album.author = req.user._id;
    await album.save();
    console.log(album);
    req.flash('success', 'Successfully made a new album!')
    res.redirect(`/musicspace/albums/${album._id}`);
   
}

// Function to display a specific album
module.exports.showAlbum = async (req, res) => {
    const { id } = req.params;  
    const album = await Album.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!album) {
        req.flash('error', 'Cannot find that album!')
        return res.redirect('/musicspace/albums');
    }
    res.render('music/show', { album });
}

// Function to render the form for editing an album
module.exports.renderEditForm = async(req, res)=> {
    const { id } = req.params;
    const album = await Album.findById(id);
    if(!album) {
        req.flash('error', 'Cannot find that album!')
        return res.redirect('/musicspace/albums');
    }
    res.render('music/edit', {album})
}

// Functiob to update an album
module.exports.updateAlbum = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const album = await Album.findByIdAndUpdate(id, { ...req.body.album });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename }));
    album.images.push(...imgs);
    await album.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await album.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}});
    }
    req.flash('success', 'Successfully updated album!');
    res.redirect(`/musicspace/albums/${album._id}`);
}

// Function to delete an album
module.exports.deleteAlbum = async(req, res) => {
    const {id} = req.params;
    await Album.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted album')
    res.redirect('/musicspace/albums');
}

