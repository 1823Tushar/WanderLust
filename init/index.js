const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

// database k liye async function
const MONGO_URL ="mongodb://127.0.0.1:27017/wandorlust";

main()
.then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
};

// initialize database
const initDB = async() => {
    await listing.deleteMany({});
   initData.data =  initData.data.map((obj) => ({
    ...obj, 
    owner:new
    mongoose.Types.ObjectId("69c22494dbf39cdcd3d42caa"),}));
    await listing.insertMany(initData.data);
    console.log("data was initialize");
};

initDB();