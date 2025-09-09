const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync= require("../utils/wrapasync.js");
const ExpressError= require("../utils/ExpressError.js");
const reviewController = require("../controller/reviews.js");
const review = require("../MODELS/review.js");
const Listing = require("../MODELS/listing.js");
const {validateReview, isLoggedIn,isreviewAuthor} = require("../middleware.js");
const { createReview, deleteReview } = require("../controller/reviews.js");

// review route 

router.post("/" ,isLoggedIn, validateReview , wrapasync(reviewController.createReview));
    
    // delete review route
    
    router.delete("/:reviewId", isLoggedIn,isreviewAuthor,wrapasync(reviewController.deleteReview));
    module.exports = router;