const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./schema.js"); //JOI




//This middleware is for Login
module.exports.isLoggedIn =(req,res,next)=>{
  console.log(req.user);
  if(!req.isAuthenticated()){
    req.session.redirectUrl= req.originalUrl;
    //originalUrl is the page that user wanted to access before logging in
    req.flash("error","Login required!");
    return res.redirect('/login');
  }
  next();
};

//The middleware below is created beacuse passport
//  clears the session after login, which wipes
//  req.session.redirectUrl before saveRedirectUrl
//  can save it to res.locals.
module.exports.saveRedirectUrl= (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};



module.exports.isOwner=async(req,res,next)=>{
  let {id}= req.params;
  let listing= await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of the listing");
    return res.redirect(`/listings/${id}`);
}
next();
};

module.exports.isAuthor=async(req,res,next)=>{
  let {id,reviewId}= req.params;
  let review= await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of the review");
    return res.redirect(`/listings/${id}`);
}
next();
};


module.exports.validateListing= (req,res,next)=>{
  let {error}= listingSchema.validate(req.body);

  if(error){
    let errMsg=error.details.map((el)=>el.message ).join(',');
    return next(new ExpressError(400,errMsg));
  } else{
    next();
  }
};

module.exports.validateReview= (req,res,next)=>{
  let {error}= reviewSchema.validate(req.body);

  if(error){
    let errMsg=error.details.map((el)=>el.message ).join(',');
    return next((new ExpressError(400,errMsg)));
  } else{
    next();
  }
}
