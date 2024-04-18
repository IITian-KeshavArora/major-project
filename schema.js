// Here we will define schema of our listings for server side schema validation and we will use that data
// and validate listings with the "joi" package.

const Joi = require("joi");   // It is used for server side schema validation for new listings.
module.exports.listingSchema = Joi.object(
    {
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
    }
)

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
})