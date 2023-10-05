import { Router } from "express";
const router = Router();


import { createNewPost, fetchAllPosts } from "../controllers/postController";
import protect from "../middleware/authMiddleware";




//to create a new post
router.post('/create-post', protect, createNewPost);

//to get the list of posts in server
router.get('/fetch-posts', fetchAllPosts);













export default router;
