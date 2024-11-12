const Joi = require('joi');

// module.exports.albumSchema = Joi.object({
//     album: Joi.object({
//         name: Joi.string().required(),
//         artist: Joi.string().required(),
//         tracks: Joi.string().required,
//         genre: Joi.string().required(),
//         year: Joi.number().required(),
//         price: Joi.number().required(),
//         description: Joi.string().required(),
//         tracks: Joi.array().items(Joi.string()).required(), // Add this line for tracks
//         images: Joi.array().items(
//             Joi.object({
//                 url: Joi.string().required(),
//                 filename: Joi.string().required()
//             })
//         )
//     }).required(),
//     deleteImages: Joi.array()
// });

// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required().max(5).min(1),
//         body: Joi.string().required()
//     }).required()
// })

// const Joi = require('joi');

module.exports.albumSchema = Joi.object({
    album: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        artist: Joi.string().required(),
        year: Joi.number().required(),
        genre: Joi.string().required(),
        tracks: Joi.array().items(Joi.string()).required(), // Add this line for tracks
        images: Joi.array().items(
                        Joi.object({
                            url: Joi.string().required(),
                            filename: Joi.string().required()
                        })
                    )

    }).required(),
    deleteImages: Joi.array()
})
 
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().max(5).min(1),
        body: Joi.string().required()
    }).required()
})