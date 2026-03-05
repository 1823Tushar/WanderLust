const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// review
//post review route
router.post("/", validateReview,
    wrapAsync(async (req, res) => {
      console.log(req.params.id);
        let Listing = await listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  Listing.reviews.push(newReview);

  await newReview.save();
  await Listing.save();

//   console.log("BODY:", req.body);

  res.redirect(`/listings/${Listing._id}`);
}));
// Delete Review Route
router.delete("/:reviewId",
     wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

   res.redirect(`/listings/${id}`)
}))
module.exports = router;