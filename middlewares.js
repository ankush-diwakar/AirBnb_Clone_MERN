const listings = require("./models/listings.js")
const Reviews = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.rurl = req.originalUrl;
        console.log(req.session.rurl);
        req.flash("error","This action can't be done without login!");
        res.redirect("/login");
    }else{
        next();
    }  
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.rurl){
        res.locals.rurl = req.session.rurl;
        console.log("saved the url!");
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    const { id } = req.params;
    const listing = await listings.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of the listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    const {id,reviewId} = req.params;
    const review = await Reviews.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of the listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}