const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");


router.get(
  "/",
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index", { alllistings });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
  })
);

router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "new Listing Created");
    res.redirect("/listings");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const NF_listing = await Listing.findById(id);
    if (!NF_listing) {
      req.flash("error", "Listing for you requested does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit", { listing: NF_listing });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect(`/listings/${id}`);
    }

    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "you don't have permission to edit");
      return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "new Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "new Listing deleted");
    res.redirect("/listings");
  })
);

module.exports = router;