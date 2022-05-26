require("dotenv").config();
const { urlencoded } = require("express");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const mcqsdb = require("./Model/mcqs.model");
const Userdb = require("./Model/user.model");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const localStrategy = require("passport-local");
const bcryt = require("bcrypt");

//requiring connection to database
const db = require("./db/db");
const { json } = require("express/lib/response");
const { hash } = require("bcrypt");
db();

//middlewares

app.set("view engine", "ejs");
app.use("/public/", express.static(__dirname + "/public/"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//setting up PassportJS for authentication
app.use(
  session({
    secret: process.env.secretKey,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(Userdb.createStrategy());

passport.serializeUser(Userdb.serializeUser());
passport.deserializeUser(Userdb.deserializeUser());

app.listen(port, (req, res) => {
  console.log("Server started");
});

//routes

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/addqus", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("addques");
  } else {
    res.redirect("/login");
  }
});

app.post("/addqus", (req, res) => {
  const mcqs = new mcqsdb({
    Question: req.body.Question,
    Option1: req.body.option1,
    Option2: req.body.option2,
    Option3: req.body.option3,
    CorrectOption: req.body.correctOption,
  });
  mcqs
    .save()
    .then(() => {
      res.redirect("/addqus");
    })
    .catch((err) => {
      res.status(500).send("something went wrong cant save the data");
    });
});

app.get("/listqus", (req, res) => {
  if (req.isAuthenticated()) {
    mcqsdb.find({}, (err, foundItem) => {
      res.render("queslist", {
        questions: foundItem,
      });
    });
  } else {
    res.redirect("/login");
  }
});
app.post("/listqus", async (req, res) => {
  try {
    await mcqsdb.deleteOne({ _id: req.body.Id_no });
  } catch (err) {
    console.log(err);
  }
  res.redirect("/listqus");
});

app.get("/test", (req, res) => {
  mcqsdb.find({}, (err, foundItem) => {
    res.render("test", {
      data1: foundItem,
    });
  });
});

//getting test data to check db connection or just check data without login
app.get("/testdata", (req, res) => {
  mcqsdb.find({}, (err, foundItem) => {
    res.json(foundItem);
  });
});

//login routes

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/addqus");
  } else {
    res.render("Login");
  }
});
app.post("/login", (req, res) => {
  const newUser = new Userdb({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(newUser, function (err) {
    if (err) console.log(err);
    passport.authenticate("local")(req, res, function () {
      res.redirect("/addqus");
    });
  });
});

app.get("/signup", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/addqus");
  } else {
    res.render("Signup");
  }
});

app.post("/signup", (req, res) => {
  Userdb.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/signup");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/addqus");
        });
      }
    }
  );
});

app.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.status(404).render("404");
});
