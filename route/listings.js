const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");

const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
router
.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single("image"),
  wrapAsync(listingController.createListing)
);

// new route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));
router
.route("/:id")
.get(
  wrapAsync(listingController.showListing)
)
.put(
  isLoggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  wrapAsync(listingController.destroyListing)
);

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;