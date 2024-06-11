const express = require("express");
const router = express.Router();
const searchController = require("../controller/search.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/",searchController.searchListing);

router.get("/listings/filters",searchController.renderFilter);


module.exports = router;