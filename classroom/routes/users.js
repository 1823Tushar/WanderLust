const express  = require("express");
const router = express.Router();
// index route
router.get ("/" ,(req ,res) => {
    res.send("Hi , I am a Index route");
});
// show route
router.get ("/:id" ,(req ,res) => {
    res.send("Hi , I am a show route");
});
// post route
router.get ("/" ,(req ,res) => {
    res.send("Hi , I am a post route");
});
// delete route
router.get ("/:id" ,(req ,res) => {
    res.send("Hi , I am a delete route");
});

module.exports = router;
