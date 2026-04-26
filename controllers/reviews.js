const Listing= require("../models/listing");
const Review= require("../models/review");
const mongoose=require("mongoose");



module.exports.createReview= async(req,res,next)=>{

 console.log(req.params.id);
 let listing= await Listing.findById(req.params.id);
 let newReview= new Review(req.body.review);
 newReview.author= req.user._id;
 
 listing.reviews.push(newReview);

 await newReview.save();
 await listing.save();
 req.flash("success","New review added");
 console.log("Review saved");
 res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview= async(req,res)=>{
  let {id,reviewId}= req.params;
  // console.log("ID:",reviewId);
  await Listing.findByIdAndUpdate(id, {$pull:{reviews:new mongoose.Types.ObjectId(reviewId)}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted succesfully");
  res.redirect(`/listings/${id}`);
};