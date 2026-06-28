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

//search
router.get("/search", async(req,res)=>{
 
  const {q}= req.query;

  if(!q){
    return res.redirect("/listings");
  }

  //-------------------------------------
  //The code below is case sensitive
  // const allListings= await Listing.find();
  
  // const listings=allListings.filter((listing)=>{
  //  return (
  //   listing.title.includes(q) ||
  //   listing.location.includes(q) ||
  //   listing.country.includes(q) ||
  //   listing.description.includes(q)
  // );
  // });
   //-------------------------------------

  //The code below uses $regex(like string.includes(q) for mongoDB) 
  // and $options(like string.toLowerCase() for MongoDB)
   const listings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } }
        ]
    });

   res.render("listings/index", { allListings:listings });
}
);

//CATEGORY
router
.get("/category/:category", async(req,res)=>{
   
  const {category}= req.params;
  const listings= await Listing.find({category});

  res.render("listings/index",{
    allListings : listings
  });
});


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
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))



//EDIT route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.editListing));


module.exports= router;