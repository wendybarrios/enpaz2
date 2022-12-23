const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const aboutController = require('../controllers/about')
const resourcesController = require('../controllers/resources')
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);
// getting the login page below
router.get("/login", authController.getLogin);
// actually trying to login below
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/about", aboutController.getIndex)
router.get("/resources", resourcesController.getIndex)

// newchange
router.get("/withpicslayout", ensureAuth, postsController.withpicsFeed)

module.exports = router;
