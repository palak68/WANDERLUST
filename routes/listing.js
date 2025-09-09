const express = require("express");
const router = express.Router();
const wrapasync= require("../utils/wrapasync.js");
const Listing = require("../MODELS/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controller/listings.js");
const { route } = require("./user.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
// -----------------------------------------------------------------------
router.route("/")
.get(wrapasync( listingController.index ))
.post(isLoggedIn, upload.single("image") ,wrapasync (listingController.createListing));

// -----------------------------------------------------------------------
 // new route
 router.get("/new",isLoggedIn,listingController.renderNewForm);

//  ----------------------------------------------------------------------
router.route("/:id")
.get(wrapasync(listingController.showListing))
.put(isLoggedIn,
    isOwner,
    upload.single("image"),
    wrapasync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapasync( listingController.deleteListing));

// ------------------------------------------------------------------------ 
 // Edit route
 router.get("/:id/edit",isLoggedIn,isOwner,wrapasync(listingController.editListing));
 module.exports = router;