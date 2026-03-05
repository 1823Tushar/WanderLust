const express = require("express");
const router = express.Router();

// INDEX route
router.get ("/" ,(req ,res) => {
    res.send("Hi , I am a Index for post route");
});
// SHOW route
router.get ("/:id" ,(req ,res) => {
    res.send("Hi , I am a show for posts route");
});// post route
router.get ("/" ,(req ,res) => {
    res.send("Hi , I am a post route");
});
// delete route
router.get ("/:id" ,(req ,res) => {
    res.send("Hi , I am a delete route");
});

module.exports = router;

