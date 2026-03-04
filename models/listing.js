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
      url: {
        type : String,
        default: "https://images.unsplash.com/photo-1626255047415-fdb067552f9b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      filename: {
        type: String,
        default: "default-image",
      }
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
      }
    ]
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