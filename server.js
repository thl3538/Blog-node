const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const db = require("./config/key").mongoURI;

//引入user.js blogs.js
const users = require("./routes/api/users");
const blogs = require("./routes/api/blogs");

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

//passport 初始化
app.use(passport.initialize());

require("./config/passport")(passport);

//数据库的连接
mongoose.connect(db, { useUnifiedTopology: true,useNewUrlParser: true })
    .then(() => {
        console.log("mongoose is connected");
    }).catch(err => console.log(err))


app.use("/api/users",users);
app.use("/api/blogs",blogs);

const port = 5000;

app.listen(port,() => {
    console.log("server is running");
})