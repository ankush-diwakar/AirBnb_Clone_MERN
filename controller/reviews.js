const listings = require("../models/listings");
const Reviews = require("../models/review");

module.exports.addReview = async (req,res)=>{
    let currentListing = await listings.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    currentListing.reviews.push(newReview);
    await currentListing.save();
    await newReview.save();
    req.flash("success","Review added!");
    res.redirect(`/listings/${currentListing.id}`)
};

module.exports.deleteReview  = async (req,res) => {

    const {id,reviewId} = req.params;
    console.log(id,reviewId);
    const res1 = await Reviews.findByIdAndDelete(reviewId);
    const res2 = await listings.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    console.log(res1,res2);
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
 };