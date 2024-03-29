const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");


module.exports = {
  getProfile: async (req, res) => {
    try {
      // since we have a session, each request (req) contains the logged-in user's info : req.user
      // console.log(req.user) to see everything
      // grabbing just the posts of the logged-in user
      const posts = await Post.find({ user: req.user.id });
      // sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find({user:req.user.id}).sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  // Below new Change
  withpicsFeed: async (req, res) => {
    try {
      const posts = await Post.find({user:req.user.id}).sort({ createdAt: "desc" }).lean();
      res.render("withpicsfeed.ejs", { posts: posts, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  // Above new change
  getPost: async (req, res) => {
    try {
      // id parameter comes from the post routes
      // router.get("/:id", ensureAuth, postsController.getPost);
      // http://localhost:5050/post/63b5f12898ea16c87a3b0618
      // id: 63b5f12898ea16c87a3b0618
      const post = await Post.findById(req.params.id);
      // use the comment model to find all comments that have a post property of the current post we are on
      const comments = await Comment.find({post:req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments:comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);

   
// upload cloudinary url; if it doesn't exist upload default image
let result = '';
if(req.file) {
  result = await cloudinary.uploader.upload(req.file.path)
} else {
  result = await cloudinary.uploader.upload("https://res.cloudinary.com/dgrd0ce7i/image/upload/v1672356883/360_F_238478220_kbmtrPrWwvm6JzJ90l9bETJsnGUFDWbo_amqpuq.jpg")
}

 // check if mood text exists, if not return "-"
let emptyString = '-'
if(!req.body.mood){
emptyString
}
// check if behaviors exists, if not return "-"
if(!req.body.behaviors){
emptyString
}

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id || result,
        caption: req.body.caption,
        mood: req.body.mood || emptyString,
        behaviors: req.body.behaviors || emptyString,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/feed");
      // og: ('/profile')
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
