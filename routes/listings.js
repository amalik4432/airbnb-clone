const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware/middleware.js");
const controllerListing = require("../controllers/listing.js");

router
  .route("/")
  .get(wrapAsync(controllerListing.indexRoute))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(controllerListing.addNewListing)
  );

//* New Listing Form Route
// Ye sirf ek form render karta hai jahan se nayi listing banayi jaati hai
router.get("/new", isLoggedIn, controllerListing.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(controllerListing.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(controllerListing.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(controllerListing.destroyListing));

//* Edit Form Route
// Purani listing ka data fetch karta hai aur edit.ejs form render karta hai
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(controllerListing.renderEditForm)
);

module.exports = router;
