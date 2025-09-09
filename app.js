if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
};

console.log(process.env)

const express = require ("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require ("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const ExpressError= require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./MODELS/user.js");
const dbUrl = process.env.ATLASDB_URL;
const MongoStore = require('connect-mongo');



main().then(()=>{
console.log("connection to Db")
}).catch((err)=>{
console.log(err)
});

async function main(){
    await mongoose.connect(dbUrl)
};
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:"mysupersecretcode"
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("error in mongo -session store")
});

const sessionOptions = {
    store,
    secret: "mysupersecretcode",
    resave:false,
    saveUninitialized: false,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    },
};





app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy (User.authenticate()));

passport .serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

    app.use((req,res,next)=>{
        res.locals.success = req.flash("success");
         res.locals.error = req.flash("error");
         res.locals.currUser = req.user;
        next();
    });

    // app.get("/demouser", async(req,res)=>{
    //     let fakeUser = new User({
    //         email:"student@gmail.com",
    //         username: "delta-student"
    //     });
    //    let registerUser=  await User.register(fakeUser,"helloworld");
    //    res.send(registerUser);
    // });

    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/", userRouter);


// app.get("/",(req,res)=>{
//     res.send("starting")
// });
app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found!"))
});

app.use((err,req,res,next)=>{
    let{statusCode =500,message= "something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message})
});

app.listen(8080,()=>{
console.log(`listening to port ${port}`)
})
  