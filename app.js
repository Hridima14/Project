if(process.env.NODE_ENV != "production"){
  require ('dotenv').config();
}
//console.log(process.env.SECRET);

const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate= require('ejs-mate');
const ExpressError=require("./utils/ExpressError");
const session=require("express-session");
const MongoStore=require('connect-mongo').MongoStore;
const flash= require("connect-flash");
const passport=require("passport");
const LocalStrategy= require("passport-local").Strategy;
const User= require("./models/user.js");

// app.get("/",(req,res)=>{
//   res.send("Hi! I am root");
// });

//-------------------------------------------



//FOR ROUTER
const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
//---------------------------------------------


//FOR MONGODB
const dbUrl= process.env.ATLASDB_URL;
async function main() {
    mongoose.set('strictQuery', false); //This was written because of some warning
    await mongoose.connect(dbUrl);
};

main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
  console.log(err);
});
//--------------------------------------------------
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));



//This makes sure that session info is stored in
//MONGO ATLAS  database


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret:process.env.SECRET
  },
  touchAfter: 24 * 3600
});


store.on("error",(err)=>{
  console.log("ERROR in MONGO SESSION STORE", err);
});
//-----------------------------------
//EXPRESS-SESSION
const sessionOptions= {
  store,
  secret :process.env.SECRET,
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+ 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true
  }
};





//---------------------------
app.use(session(sessionOptions));
app.use(flash());
//console.log(User.authenticate);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser= req.user;
  
  next();
}); 




//----------------------------------------
//ROUTER

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
//----------------------------------------
app.get("/", (req, res) => {
  res.redirect("/listings");
});




//-----------------------------------------


//----------------------------
//ERROR HANDLING
app.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});


app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"}= err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{message});
});
//--------------------------------------------------

app.listen(8080,()=>{
    console.log("listening on port 8080");
});
