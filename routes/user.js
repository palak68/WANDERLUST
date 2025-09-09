const express = require("express");
const router = express.Router();
const User = require("../MODELS/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");

router.get("/signup",userController.renderSignupForm);

router.post("/signup",wrapasync(userController.Signup));

router.get("/login", userController.renderLoginForm);
 
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}), 
wrapasync(userController.Login));


router.get("/logout",userController.Logout);
module.exports = router;