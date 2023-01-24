// builds our apis
const express = require("express");
const app = express();
// help us build our models 
const mongoose = require("mongoose");
// handles our authentication
const passport = require("passport");
// allows users to stay logged in as they move across our applications
const session = require("express-session");
// stores sessions in db (if you leave the browser, you stay logged in)
const MongoStore = require("connect-mongo")(session);
// we can override methods coming in to be what we want them to put (ex. we can just use get/post and treat them as put/delete)
const methodOverride = require("method-override");
// flash notification (Ex. entering wrong password)
const flash = require("express-flash");
const logger = require("morgan");
// connect to our database
const connectDB = require("./config/database");
// set up basic routes
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing: allows us to pull stuff from a request ex. form sends post request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
