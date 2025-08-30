const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const methodOverride = require("method-override");
const listingRouter = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");
dotenv.config();

const app = express();

const MONGO_URL = process.env.MONGO_URL;

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.error("Failed to connect to DB:", err);
  }
}
main();

const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");



const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,

});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    //for cross- scripting attacks
    httpOnly: true,
  },
};



app.use(session(sessionOptions));
app.use(flash());





app.use(passport.initialize());
app.use(passport.session());

//flash middleware

app.use((req, res, next) => {
  res.locals.currUser = req.user; // passport attaches user to req
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// app.get("/demo", async (req, res) => {
//   let fakeuser = new User({
//     email: "student@gmail.com",
//     username: "delta"
//   })

//   let user = await User.register(fakeuser, "hello");
//   res.send(user);
// });

// app.get("/", (req, res) => {
//   res.send("i am root");
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);


app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});


app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
