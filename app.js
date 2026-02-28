const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-Mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")

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
})

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
app.post("/listings", wrapAsync(async(req,res) => {
   if(!req.body.listing) {
    throw new ExpressError(400, "send valid data for listings")
   }
  const newListing = new listing(req.body.listing);
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
app.put("/listings/:id", wrapAsync(async (req,res) => {
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


app.use((err, req, res, next) => {
  const { message = "Something went wrong" } = err;
  console.error(err.stack);

  res.status(500).render('error.ejs',{message: err.meassage});
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});