const Listing = require("../models/listing.js");

module.exports.indexRoute = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listingData = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listingData) {
    req.flash("failure", "Listing not found");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listingData });
  }
};

module.exports.addNewListing = async (req, res) => {
  let filename = req.file.filename;
  let url = req.file.path;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { filename, url };
  await newListing.save();
  req.flash("success", "New Listing saved");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;

  let listingData = await Listing.findById(id);
  if (!listingData) {
    req.flash("failure", "Listing not found");
    return res.redirect("/listings");
  } else {
    let OriginalImgUrl = listingData.image.url;
    OriginalImgUrl = OriginalImgUrl.replace("/upload", "/upload/h_200,w_350");
    res.render("listings/edit.ejs", { listingData, OriginalImgUrl });
  }
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    let filename = req.file.filename;
    let url = req.file.path;
    listing.image = { url, filename };
    await listing.save();
  }
  if (!listing) {
    req.flash("failure", "Listing not found");
    res.redirect("/listings");
  } else {
    req.flash("success", "Listing updated");
    res.redirect("/listings");
  }
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    req.flash("failure", "Listing not found");
    res.redirect("/listings");
  } else {
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }
};
