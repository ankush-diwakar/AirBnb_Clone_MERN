const wrapAsync = require("../utils/wrapAsync");
const contact = require("../models/contact");

module.exports.index = async (req, res) => {
    res.render("contact/index.ejs");
};
module.exports.postData = async (req, res) => {
    const data = req.body.contact;
    const newContact = new contact(data);
    const result = await newContact.save();
    console.log(result);
    req.flash("success","Response sent!");
    res.redirect("/listings");
};