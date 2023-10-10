import { Router } from "express";
const router = Router();

//importing controllers
import { createNewPost, ctrlFetchUserPosts, fetchAllPosts } from "../controllers/postController";

//importing middleware
import protect from "../middleware/authMiddleware";




// @desc    Create post
// @access  Authenticated user
router.post('/create-post', protect, createNewPost);

// @desc    Fetch posts
// @access  Authenticated user
router.get('/fetch-posts', protect, fetchAllPosts);


// @desc    Fetch a user's posts
// @access  Registerd users
router.get("/fetchUserPosts", protect, ctrlFetchUserPosts);













export default router;
