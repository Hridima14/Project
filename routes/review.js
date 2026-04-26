const express=require("express");
const router= express.Router({mergeParams:true});
const mongoose=require("mongoose");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError");
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview,isLoggedIn,isAuthor}= require("../middleware.js")

//---------------------------------
const reviewController= require('../controllers/reviews.js')
//-----------------------------------

//REVIWS
router.post("/", isLoggedIn, validateReview,wrapAsync(reviewController.createReview));

//DELETE REVIEW ROUTE
router.delete('/:reviewId', isLoggedIn, isAuthor, isLoggedIn,wrapAsync(reviewController.destroyReview));  
//------------------------------------------

module.exports= router;