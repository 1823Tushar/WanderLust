const express = require("express");
const app = express();
const users =  require("./routes/users.js");
const posts = require("./routes/posts.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));


const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false, 
    saveUninitialized: true,
};
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res , next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register", (req,res)=> {
    let {name= "anonymous"} = req.query;
   req.session.name = name;
   
   if(name === "anonymous"){
    req.flash("error", "some error occured");
   }else {
    req.flash("success", "user registered succesfully!");
   }
   
    // console.log(req.session);
    // res.send(name);
    res.redirect("/hello");
});
app.get("/hello", (req,res) => {
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash("error");
    //console.log(req.flash("success"));
    res.render("page.ejs", {name: req.session.name});
    //res.send(`hello, ${req.session.name})`);
});


app.listen(3000, () => {
    console.log("SERVER WAS START");
})