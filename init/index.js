const mongoose=require("mongoose");
const initData=require("./data.js");
const Listings=require("../models/listing.js");
require("dotenv").config({path:"../.env"}); 


const mapToken = process.env.MAP_TOKEN;
console.log("mapToken:", mapToken);
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(MONGO_URL);
};

main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
  console.log(err);
});


const initDB= async ()=>{
    await Listings.deleteMany({});
    const dataWithCoords = await Promise.all(initData.data.map(async (obj) => {
        try{
    const geoResponse = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(obj.location)}.json?key=${mapToken}`
    );
    const geoData = await geoResponse.json();
    const coordinates = geoData.features[0].geometry.coordinates;

    return {
      ...obj,
      owner: "69e61a5df2e23096f58d0772",
      geometry: {
        type: "Point",
        coordinates: coordinates 
      }
    };
  }catch(e){
    console.log("Error for listing:", obj.title, e);
    return { ...obj, owner: "69e61a5df2e23096f58d0772"};
  }
}));
    await Listings.insertMany(dataWithCoords);
    console.log("Data initialized");
};

initDB();


