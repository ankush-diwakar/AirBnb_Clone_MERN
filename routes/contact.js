const express = require("express");
const router = express.Router();
const contactController = require("../controller/contact");
router
   .route("/")
   .get(contactController.index) //index route 
   .post(contactController.postData);


module.exports = router;