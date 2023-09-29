import { Router } from "express";
const router = Router();


import { createNewPost, fetchAllPosts } from "../controllers/postController";
import auth from "../middleware/authMiddleware";




//to create a new post
router.post('/create-post', createNewPost);

//to get the list of posts in server
router.get('/fetch-posts', fetchAllPosts);













export default router;
