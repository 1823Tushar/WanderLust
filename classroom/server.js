const express = require("express");
const app = express();
const users =  require("./routes/users.js");
const posts = require("./routes/posts.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser('secretcode'));

app.get("/getsignedcookie", (req,res)=>{
    res.cookie("made-In", "India", {signed: true});
    res.send("signed cookie sent");
});
app.get("/verify", (req,res) => {
    console.log(req.cookies);
    res.send("verifies!")
})

app.get("/getcookies", (req, res)=> {
    res.cookie("greet", "Namaste");
    res.cookie("madeIn", "India");
    res.send("sent you some cookies");
})
app.get("/greet", (req,res)=>{
    let {name = "anonyms"} = req.cookies;
    res.send("hi i am a 4a")
})

app.get ("/" ,(req ,res) => {
    console.dir(req.cookies);
    res.send("Hi , I am a Nothing");
})
app.use("/users", users);
app.use("/posts", posts);


app.listen(3000, () => {
    console.log("SERVER WAS START");
})