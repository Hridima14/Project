const Listing= require("../models/listing");
const mapToken= process.env.MAP_TOKEN;

//INDEX
module.exports.index =async (req,res)=>{
  const allListings= await Listing.find({});
  res.render("listings/index.ejs",{allListings});
  };


//RENDER FORM
module.exports.renderNewForm= (req,res)=>{
  res.render('listings/new.ejs');
};


//SHOW
module.exports.showListings= async (req,res)=>{
  let {id}=req.params;
  const listing= await Listing
                        .findById(id)
                        .populate({  //nested populate
                            path: "reviews",
                            populate:{
                              path:"author",
                            }
                         })
                        .populate("owner");
  

  if(!listing){
    req.flash("error","The listing you requested doesn't exist");
    return res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show.ejs",{listing,mapToken: process.env.MAP_TOKEN});
  
};


//CREATE
module.exports.createNewListing = async (req,res,next)=>{
  //console.log(req.file);
   // Get coordinates from MapTiler geocoding API
  const location = req.body.listing.location;
  const geoResponse = await fetch(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${mapToken}`
  );
  const geoData = await geoResponse.json();
  const coordinates = geoData.features[0].geometry.coordinates; // [lng, lat]

  let image= req.files.map(file=>({
     url: file.secure_url,
     filename :file.public_id
  }));

  const newListing = new Listing(req.body.listing);
  newListing.owner= req.user._id;
  newListing.image= image;
  newListing.geometry={
    type:"Point",
    coordinates: coordinates
  };
  //console.log("newListing:", newListing);
  await newListing.save();
  req.flash("success","New listing created!");
  res.redirect('/listings');
  
  // console.log(listing);
};


//EDIT
module.exports.editListing = async(req,res)=>{
  let {id}=req.params;
  const listing= await Listing.findById(id);
  req.flash("success","Listing edited succesfully");
  if(!listing){
    req.flash("error","The listing you requested doesn't exist");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs",{listing});

};


//UPDATE
module.exports.updateListing= async(req,res)=>{
  let {id}= req.params;
  let listing= await Listing.findById(id);
  await Listing.findByIdAndUpdate(id,{...req.body.listing});

  if(req.files && req.files.length>0){
    if(listing.image.length + req.files.length >5){
      req.flash("error","Image limit is 5!");
      return res.redirect(`/listing/"${id}/edit`);
    }
  
  let newImages= req.files.map(file=>({
    url:file.secure_url,
    filename:file.public_id
  }));

  listing.image.push(...newImages);
  //This adds new images to existing ones
  await listing.save();

}
  req.flash("success","Listing updated successfully");
  res.redirect(`/listings/${id}`);

};

//DELETE
module.exports.destroyListing= async(req,res)=>{
let {id}= req.params;
let deletedListing= await Listing.findByIdAndDelete(id); 
console.log(deletedListing);
req.flash("success","Listing deleted successfully!");
res.redirect("/listings");
}