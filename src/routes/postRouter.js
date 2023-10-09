import { Router } from "express";
const router = Router();

//importing controllers
import { createNewPost, fetchAllPosts } from "../controllers/postController";

//importing middleware
import protect from "../middleware/authMiddleware";




// @desc    Create post
// @access  Authenticated user
router.post('/create-post', protect, createNewPost);

// @desc    Fetch posts
// @access  Authenticated user
router.get('/fetch-posts', protect, fetchAllPosts);













export default router;
