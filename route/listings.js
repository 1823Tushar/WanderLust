const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");

const validateListing = (req, res ,next) => {
    let {error} = listingSchema.validate(req.body);
if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg);
} else {
    next();
}
};
//index router
router.get("/", wrapAsync(async (req,res)=>{
  const alllistings = await listing.find({});
  res.render("listings/index", {alllistings});
}));

// New Route
router.get("/new", (req,res) => {
    res.render("listings/new");
});
// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    const flisting = await listing
        .findById(id)
        .populate("reviews");
        if(!flisting)   {
            req.flash("error", 'Listing for you requested does not exist');
           res.redirect("/listings");
        }
    res.render("listings/show", { listing: flisting });
}));
// create route
router.post("/",validateListing, wrapAsync(async(req,res, next) => {
  const newListing = new listing(req.body.listing);
  await newListing.save();
  req.flash("success", 'new Listing Created');
  res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req,res) => {
let {id} = req.params;
    const NF_listing = await listing.findById(id);
      if(!NF_listing)   {
            req.flash("error", 'Listing for you requested does not exist');
           res.redirect("/listings");
        }
    res.render("listings/edit", {listing: NF_listing});
}));

// Update Route 
router.put("/:id",validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
   req.flash("success", 'new Listing Updated');
    res.redirect("/listings");
}));

// delete route
router.delete("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", 'new Listing deleted');
    res.redirect("/listings");
}));
module.exports = router;