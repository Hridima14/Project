const express=require("express");
const router= express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");


//CONTROLLER
const userController= require("../controllers/users.js");



router
.route("/signup")
//RENDER SIGNUP
.get(userController.renderSignupForm)
//SIGNUP
.post(wrapAsync(userController.signup));


router
.route("/login")
//RENDER LOGIN
.get(userController.renderLoginForm)
//LOGIN
.post(saveRedirectUrl, 
    passport.authenticate('local',{failureRedirect: '/login',failureFlash :true}),
    userController.login);



//LOGOUT
router.get("/logout",userController.logout);


module.exports= router;  