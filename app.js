//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent = "Oberservation, Documentation, Reflection.";
const aboutContent = "Made by Annabelle Sun,deployed on MongoDB Altals and Heroku ";
const contactContent = "sunhuaqing01@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// connect mongoose

mongoose.connect("mongodb+srv://" + process.env.ATLAS_USER + ":" + process.env.ATLAS_PWD + "@cluster0.jyonr.mongodb.net/postsDB");

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


app.get("/", (req, res) => {
  // Search database for blog posts
  Post.find({}, (err, foundPosts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        blogPosts: foundPosts
      });
    }
  });
});


app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  //notice need to create a new object
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  // Save new document to database; redirect to "/" GET if all well
  post.save(function(err) {

    if (!err) {

      res.redirect("/");

    }

  });
});

app.get("/post/:postId", function(req, res) {
  Post.findOne({
    _id: req.params.postId
  }, function(err, post) {
    if (err) { // post is undefined
      post = {
        title: "not found",
        content: ""
      };
    }
    res.render("post", {
      post: post
    });
  });
});

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server started on port 3000");
});