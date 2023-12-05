import { Router } from "express";
const router = Router();

//importing controllers
import {
  addComment,
  addReply,
  createNewPost,
  ctrlFetchUserPosts,
  deleteComment,
  deletePost,
  fetchAllPosts,
  fetchComment,
  fetchReplyComments,
  fetchSinglePost,
  getEveryPostCtrl,
  getPostsCountController,
  likePost,
  reportPost,
  unlikePost,
  updatePost,
} from "../controllers/postController.js";

//importing middleware
import protect from "../middleware/authMiddleware.js";




// @desc    Create post
// @access  Authenticated user
router.post('/create-post', protect, createNewPost);

// @desc    Fetch posts
// @access  Authenticated user
router.get('/fetch-posts', protect, fetchAllPosts);

// @desc    update posts
// @access  Authenticated user
router.put('/update-post/:postId', protect, updatePost)

// @desc    Fetch posts count
// @access  Private
router.get("/fetch-count", protect, getPostsCountController)

// @desc    Fetch single posts
// @access  Authenticated user
router.get('/fetch-single-post/:postId', protect, fetchSinglePost);


// @desc    Fetch a user's posts
// @access  Registerd users
router.get("/fetchUserPosts", protect, ctrlFetchUserPosts);


// @desc    Like post
// @access  Registerd users
router.patch('/like-post', protect, likePost);
// @desc    Unlike post
// @access  Registerd users
router.patch('/unlike-post', protect, unlikePost);


// @desc    Add comment
// @access  Registerd users
router.post('/add-comment', protect, addComment);
// @desc    Delete comment
// @access  Registerd users
router.delete('/delete-comment', protect, deleteComment);
// @desc    Get comment
// @access  Registerd users
router.get('/fetch-comments/:postId', protect, fetchComment);
// @desc    Get reply comments
// @access  Registerd users
router.get('/comments/replies/:commentId', protect, fetchReplyComments);
// @desc    Reply comment
// @access  Registerd users
router.post('/comments/reply-to/:commentId', protect, addReply);


// @desc    Delete post
// @access  Registerd users
router.delete('/delete/post/:postId', protect, deletePost)



// @desc    Report user
// @access  Registerd users
router.post("/report/post/:userId/:username", protect, reportPost);



router.get('/get-every-posts', protect, getEveryPostCtrl)











export default router;
