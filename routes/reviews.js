const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/reviews.js");
const {
  isReviewAuthor,
  validateReview,
  isLoggedIn,
} = require("../middleware/middleware.js");
const controllerReview = require("../controllers/reviews.js");

//* Reviews Routes
//! Save Review

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(controllerReview.createReview)
);

//* Delete Route

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(controllerReview.destroyReview)
);

module.exports = router;
