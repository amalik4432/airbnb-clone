const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ email, username });
    await User.register(newUser, password);
    req.logIn(newUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User Registerted and logged in Successful");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("failure", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.logIn = async (req, res) => {
  req.flash("success", "Login Successful");
  let redirectUrl = res.locals.redirect || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Logged Out Successful");
    res.redirect("/listings");
  });
};
