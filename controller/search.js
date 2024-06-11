const listings = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");

module.exports.searchListing = async(req,res) => {
    const qr = req.query.listingname;
    const flisting = await listings.findOne({title:qr});
     res.render("listings/searchShow.ejs",{flisting,qr});
};

module.exports.renderFilter = async(req,res) => {
    const fil = req.query.filtername;
    const allListings = await listings.find({category:fil});

    res.render("listings/index.ejs",{allListings});
};