if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

//! Routes
const listingsRoute = require("./routes/listings.js");
const reviewsRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");

const app = express();
const port = 3000;

const dbUrl = process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in Mongo Store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  Cookie: {
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge: Date.now() * 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.currUser = req.user;
  next();
});

//* Database connection
main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

//* ------------------ ROUTES ------------------

//* About Page Route
// Ye static about page render karta hai jisme ek dummy user profile show hoti hai
app.get("/developer", (req, res) => {
  let users = [
    {
      _id: 1,
      name: "Ahmad Raza",
      role: "Full Stack Web Developer",
      email: "ahmeedmaliik@icloud.com",
      phone: "NA",
      location: "Lahore, Pakistan",
      skills: [
        "JavaScript",
        "Node.js",
        "Express.js",
        "React.js",
        "Next.js",
        "Mongodb",
      ],
      image: "",
    },
    {
      _id: 2,
      name: "Tayyaba",
      role: "Full Stack Web Developer",
      email: "",
      phone: "NA",
      location: "Lahore, Pakistan",
      skills: [
        "JavaScript",
        "Node.js",
        "Express.js",
        "React.js",
        "Next.js",
        "Mongodb",
      ],
      image: "",
    },
  ];
  res.render("listings/developers.ejs", { users });
});
// jadoobhai;

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute);

//* 404 Not Found Middleware
// Agar koi route match na kare to custom ExpressError throw karta hai
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//* Error Handling Middleware
// Sabhi errors ko catch karta hai aur error message browser pe show karta hai
app.use((err, req, res, next) => {
  let { status = 500, message = "Some Unknown Error Occur" } = err;
  res.render("listings/error.ejs", { message });
  // res.status(status).send(message);
});

//* Start Server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
