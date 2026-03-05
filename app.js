const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-Mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./route/listings.js");
const reviews = require("./route/review.js")

// database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wandorlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to db");
}
main().catch(err => console.log(err));

app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use("/listings", listings)
app.get("/", (req, res) => {
    res.send("Hi I am a Tushar");
});
app.use("/listings/:id/reviews", reviews);

// it is for review schema 




app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    //   console.error(err.stack);

    res.status(status).render('listings/error', { message: err });
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});