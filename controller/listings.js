const listings = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync")

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await listings.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.newListingPageRender = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createNewListing = wrapAsync(async (req, res, next) => {

    const response = await geoCodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
    .send();
    //   console.log(response.body.features[0].geometry)

    // const {title,description,image,price,location,country} = req.body;
    const newData = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
  
    let newListing = new listings(newData);
    newListing.owner = req.user._id;
    newListing.image = { url,filename };
    newListing.geometry = response.body.features[0].geometry;

    const result = await newListing.save();
    console.log(result);    
    req.flash("success","new listing added!");
    res.redirect("/listings");
})

module.exports.showListings = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await listings.findById(id)
    .populate({ 
        path:"reviews",
        populate : {
           path : "author"
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","The listing you requested for does not exists!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
});

module.exports.editListings = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await listings.findById(id);
    if(!listing){
        req.flash("error","The listing you requested for does not exists!");
        res.redirect("/listings");
    }
    let ogurl =  listing.image.url;
    ogurl = ogurl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing , ogurl});
});

module.exports.updateListings =  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listingg = await listings.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listingg.image = { url,filename };
    }
    await listingg.save();
    console.log("the data is updated..");
    req.flash("success","Listing has been updated!");
    res.redirect(`/listings/${id}`);
});

module.exports.distoryListing = wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listings.findByIdAndDelete(id).then(console.log("successfully deleted!!"));
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
});