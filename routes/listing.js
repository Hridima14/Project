const express=require("express");
const router= express.Router();
const Listing= require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js");

const {storage}= require("../cloudConfig.js");
const multer= require('multer');
const upload= multer({storage});

//CONTROLLER
const listingController= require('../controllers/listings.js')


router
.route("/")
//INDEX
.get(wrapAsync(listingController.index))
//Create new
.post(
  isLoggedIn,
  upload.array("listing[image]",5),
  validateListing,
  wrapAsync(listingController.createNewListing)
);

//NEW route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router
.route("/:id")
//SHOW route
.get(wrapAsync(listingController.showListings))
//UPDATE route
.put(isLoggedIn,
   isOwner,
   upload.array("listing[image]",5),
   validateListing,
   wrapAsync(listingController.updateListing))
//DELETE route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//EDIT route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.editListing));


module.exports= router;