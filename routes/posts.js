const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

// enables user to create post w/ cloudinary for media upload
router.post("/createPost", upload.single("file"), postsController.createPost);
// enables user to like post 
router.put("/likePost/:id", postsController.likePost);
// enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
// module exports is just spitting something out that we could use somewhere else

