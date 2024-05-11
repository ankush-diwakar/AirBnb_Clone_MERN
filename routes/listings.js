const express = require("express");
const router = express.Router();
const listings = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { LISTING_SCHEMA, REVIEW_SCHEMA } = require("../serverSideValSchema.js"); //for the validation of schema for server side schema validation using JOI
const flash = require("connect-flash");
const {isLoggedIn} = require("../middlewares.js");
const {isOwner} = require("../middlewares.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

//fuction to validate the listings ** for serverside validation ** 
const validateListings = (req, res, next) => {
    const result = LISTING_SCHEMA.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, `J:ERROR ${result.error}`)
    } else {
        next()
    }
}

//using router.route method to make the code more compact and easy to understand!
router
   .route("/")
   .get(wrapAsync(listingController.index)) //index route 
   .post(isLoggedIn,upload.single("listing[image]"),validateListings,listingController.createNewListing)  //post req to create a new listing
 

//create route to insert new listing
router.get("/new", isLoggedIn, listingController.newListingPageRender);

router
  .route("/:id")
  .get(listingController.showListings)  //show route
  .put(isLoggedIn,upload.single("listing[image]"),isOwner,validateListings,listingController.updateListings) // update route
  .delete(isLoggedIn,isOwner,listingController.distoryListing)    //delete route

//edit route
router.get("/:id/edit", isLoggedIn,isOwner, listingController.editListings);


module.exports = router;