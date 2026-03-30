const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required:true,
    },

    image: {
     url: String,
     filename: String,
    },

    price: {
      type: Number,
      min: 0,
    },

    location: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      },
    ],
    owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing)=> {
   
 if(listing) {
   await Review.deleteMany({_id: {$in: listing.reviews}});
 }
});

module.exports = mongoose.model("listing", listingSchema);



// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;// bar bar mongoose.schema na likhne pde is liye store kr liya

// const listingSchema = new Schema({
//     title : {
//         type: String,
//         required: true,
//     },
//     description: String,
//     Image: {
//         type:String,
//         default: "./Images/2_hotel.jpg",
//         set: (v)=> v==="" ? "./Images/2_hotel.jpg" : v,
//     },
//     price: Number,
//     location: String,
//     country: String,

// });


// const listing = mongoose.model("listing", listingSchema);// create model
// module.exports = listing; // export kiya app.js mai