//const passport=require("passport");
const User=require("../models/user.js");



//RENDER SIGNUP
module.exports.renderSignupForm= (req,res)=>{
    res.render("users/signup.ejs");
};

//RENDER LOGIN
module.exports.renderLoginForm=(req,res)=>{ 
   res.render("users/login.ejs"); 
};


//SIGNUP 
module.exports.signup= async(req,res,next)=>{
    //console.log("SIGNUP ROUTE HIT");
  try{
  let {username,email,password}= req.body;
  const newUser= new User({email,username});
  const registeredUser=await User.register(newUser,password);
  console.log(registeredUser);
  req.login(registeredUser,(err)=>{
     if(err){
         return next(err);
        }
        req.flash("success","Welcome to Wanderlust!");
        res.redirect('/listings');
    }); 

    }catch(err){
        
        req.flash('error',err.message);
        res.redirect('/signup');
    }
}


//LOGIN
//Actual login is done by passport while signing up
module.exports.login=async(req,res)=>{
     //console.log("LOGIN ROUTE HIT");
     req.flash("success","Login successful!");
     let redirectUrl=res.locals.redirectUrl ;
     if(!redirectUrl || redirectUrl=="/login" ){
        redirectUrl="/listings";
     }
    res.redirect(redirectUrl);
};

//LOGOUT
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout Successful!");
        res.redirect("/listings");
    });
};