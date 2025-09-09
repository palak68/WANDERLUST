const User = require("../MODELS/user");
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.Signup = async(req,res)=>{
    try{
       let{username,email,password}=req.body;
const newUser = new User({email,username});
const registerdUser = await User.register(newUser,password);
console.log(registerdUser);
req.login(registerdUser,(err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","Welcome to Wanderlust")

    res.redirect("/listings") 
})

    } catch(err){
req.flash("error",err.message);
res.redirect("/signup")
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.Login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect( redirectUrl );
};

module.exports.Logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            next();
        }
        req.flash("success", "you are logged out now ");
        res.redirect("/listings");
    })
};