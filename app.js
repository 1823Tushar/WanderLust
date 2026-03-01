const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-Mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const review = require("./models/review.js");
// database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wandorlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to db");
}
main().catch(err => console.log(err));

app.set("view engine", 'ejs');
app.use(express.urlencoded({extended: true}));
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) => {
    res.send("Hi I am a Tushar");
});

const validateListing = (req, res ,next) => {
    let {error} = listingSchema.validate(req.body);
if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg);
} else {
    next();
}
};
// it is for review schema 
const validateReview = (req, res ,next) => {
    let {error} = reviewSchema.validate(req.body);
if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg);
} else {
    next();
}
};
//index route
app.get("/listings", wrapAsync(async (req,res)=>{
  const alllistings = await listing.find({});
  res.render("listings/index", {alllistings});
}));

// New Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new");
});
// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const flisting = await listing.findById(id);
    res.render("listings/show", {listing: flisting});
}));

//create Route
app.post("/listings",validateListing, wrapAsync(async(req,res, next) => {

//    if(!req.body.listing) {
//     throw new ExpressError(400, "send valid data for listings")
//    }
// let result = listingSchema.validate(req.body);
// console.log(result);
// if (result.error) {
//     throw new ExpressError(400, result.error);
// }
  const newListing = new listing(req.body.listing);
//   if(!newListing.description) {
//     throw new ExpressError(400, "description is missing &");
//  }
//    if(!newListing.title) {
//     throw new ExpressError(400, "title is missing &");
//  }
//    if(!newListing.location) {
//     throw new ExpressError(400, "location is missing &");
//  }
  await newListing.save();
  res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
let {id} = req.params;
    const NF_listing = await listing.findById(id);
    res.render("listings/edit", {listing: NF_listing});
}));

// Update Route 
app.put("/listings/:id",validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

// delete route
app.delete("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
//Reviews
// post route 
// app.post("/listings/:id/reviews",validateReview,wrapAsync( async (req,res)=> {
// let Listing = await  listing.findById(req.params.id);
// let newReview = new Review(req.body.review);
// Listing.reviews.push(newReview);

// await newReview.save();
// await Listing.save();

// // console.log("new review saved");
// // res.send("new review saved ");
//  res.redirect(`/listings/${Listing._id}`);
//  console.log("BODY:", req.body);

// }));
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  let Listing = await listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  Listing.reviews.push(newReview);

  await newReview.save();
  await Listing.save();

  console.log("BODY:", req.body);

  res.redirect(`/listings/${Listing._id}`);
}));

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
  const { status= 500, message = "Something went wrong" } = err;
//   console.error(err.stack);

  res.status(status).render('listings/error',{message: err});
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});