const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware/middleware.js");
const controllerUser = require("../controllers/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router
  .route("/signup")
  .get(controllerUser.renderSignupForm)
  .post(wrapAsync(controllerUser.signup));

router
  .route("/login")
  .get(controllerUser.renderLoginForm)
  .post(
    saveRedirect,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: {
        type: "failure",
        message: "Invalid username or password.",
      },
    }),
    controllerUser.logIn
  );

router.get("/logout", controllerUser.logOut);

module.exports = router;
