const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;
    req.flash("failure", "Please Login First");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports.saveRedirect = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirect = req.session.redirectURL;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let findListing = await Listing.findById(id);
  if (!findListing.owner.equals(res.locals.currUser._id)) {
    req.flash("failure", "Lising do not belongs to you");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//* Validate Listing Data coming to db

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let err = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, err);
  } else {
    next();
  }
};

//* Validate Reviews coming to db

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let err = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, err);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let extractedReview = await Review.findById(reviewId);
  if (!extractedReview.author.equals(res.locals.currUser._id)) {
    req.flash("failure", "Review do not belongs to you");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
