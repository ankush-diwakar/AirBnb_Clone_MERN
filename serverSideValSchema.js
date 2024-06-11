
//for server side validation we first 
 //1)create a validation schema with Joi 
 //2)create schema validation function
 //3)pass that function as a middleware to the route for serverside validation.........

const Joi = require('joi');

const LISTING_SCHEMA  = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        category : Joi.string().required(),
        image : Joi.string().allow("",null)
    }).required()
})

const REVIEW_SCHEMA = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required()
});


module.exports = {
    LISTING_SCHEMA,
    REVIEW_SCHEMA
};

// hi bye