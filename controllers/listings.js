const Listing = require("../models/listing");

module.exports.index = async (req, res,next) => {
    const alllistings = await Listing.find({});
    res.render("listings/index", { alllistings });
  }

  module.exports.renderNewForm = (req, res,next) => {
  res.render("listings/new")};

  module.exports.showListing = async (req, res,next) => {
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
    };
  module.exports.createListing = async (req, res, next) => {
    if (!req.file) {
        req.flash("error", "Image upload failed");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};
      module.exports.renderEditForm = async (req, res,next) => {
          let { id } = req.params;
          const NF_listing = await Listing.findById(id);
          if (!NF_listing) {
            req.flash("error", "Listing for you requested does not exist");
            return res.redirect("/listings");
          }
          let originalImageUrl = NF_listing.image.url;
          originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
          res.render("listings/edit", { listing: NF_listing , originalImageUrl});
        }
    module.exports.updateListing = async (req, res,next) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);
    if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
};
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
  }
  module.exports.destroyListing =async (req, res,next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "new Listing deleted");
    res.redirect("/listings");
  }