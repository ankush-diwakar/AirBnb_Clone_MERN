if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}
// console.log(process.env)

const express = require('express')
const app = express()
const port = 8080
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const ejsMate = require('ejs-mate');                      //importing ejsmate pakage
const ExpressError = require("./utils/ExpressError.js")
const flash = require("connect-flash");

const listing = require("./routes/listings.js");
const review = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const contactRouter = require("./routes/contact.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
const {saveRedirectUrl} = require("./middlewares.js");
const {isOwner} = require("./middlewares.js");
app.engine('ejs', ejsMate);                               //for templating ejsMATE templates..
app.set("views", path.join(__dirname, "views"));          //for ejs q1
app.set("view engine", "ejs");                            //for ejs q2

const ATLAS_URL = process.env.MONGO_ATLAS_URL;


const store = MongoStore.create({
  mongoUrl: ATLAS_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter : 24*3600,
});

store.on("error",()=>{
  console.log("Error in mongo store..",err);
});

const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000
  }
};

app.use(express.urlencoded({ extended: true }));

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, "public")))   //for using the static files and content
app.use(express.urlencoded({ extended: true }))           //for extracting the req.body data from post,put requests
app.use(methodOverride("_method"));                       //for the method overriding  i.e for put and delete req


app.listen(port, () => console.log(`Hello there Listening on port ${port}!`))

app.get('/', (req, res) => {
  res.render("home/index.ejs")
})


//mongoose db connection code
main()
  .then(() => {
    console.log("db connection success!!")
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(ATLAS_URL);
}
//end of mongoose db connection code....

app.get("/demo",async(req,res)=>{
  const fakeUser = {
    email : "ankush@gmail.com",
    username : "ankush-diwakar",
  };
  let registeredUser =  await User.register(fakeUser,"randomPassword@3283");
  res.send(registeredUser);
})

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})

app.use("/",userRouter);
app.use("/listings", listing);
app.use("/listings/:id/reviews", review);
app.use("/contact",contactRouter);

app.post("/contact",(req,res)=>{
  const data = req.body.contact;
  res.send(data);
})

app.use("*", (req, res, next) => {
  throw new ExpressError(404, "PAGE NOT FOUND!")
})

//middleware to handle the error 
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong" } = err;
  // res.status(statusCode).send(message)
  res.status(500).render("./listings/error.ejs", { err });
})