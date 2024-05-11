const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Reviews = require("../models/review.js");
const listings = require("../models/listings.js");
const ExpressError = require("../utils/ExpressError.js");
const { LISTING_SCHEMA, REVIEW_SCHEMA } = require("../serverSideValSchema.js"); //for the validation of schema for server side schema validation using JOI
const {isLoggedIn,isReviewAuthor} = require("../middlewares.js");

const reviewController = require("../controller/reviews.js");

//fuction to validate the reviews ** for serverside validation ** 
const  validateReviews = (req,res,next) => {
    const result = REVIEW_SCHEMA.validate(req.body);
    if(result.error){
      throw new ExpressError(400,`J:ERROR ${result.error}`)
    }else{
      next()
    }
  }
  
//reviews POST route
router.post("/",isLoggedIn,validateReviews,wrapAsync(reviewController.addReview));

//reviews DELETE route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;