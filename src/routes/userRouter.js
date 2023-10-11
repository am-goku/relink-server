import { Router } from "express";
const router = Router();

//IMPORTING CONTROLLERS
import {fetchUsers, login, registerUser, getUserdetails, savePost, removeSavedPost, followUser,} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";


// @desc    Fetch username && email
// @access  Private
router.get("/userdetails", getUserdetails);

// @desc    Fetch users
// @access  Authenticated users
router.get("/fetch-users", fetchUsers);

// @desc    Login user
// @access  Public
router.post("/login", login);

// @desc    Register user
// @access  Public
router.post("/register", registerUser);


// @desc    Save post
// @access  Registerd users
router.put("/:userId/save/post/:postId", protect, savePost)
// @desc    Remove saved post
// @access  Registerd users
router.delete("/:userId/save/post/remove/:postId", protect, removeSavedPost)



// @desc    Follow user
// @access  Registerd users
router.post("/:userId/follow/:followeeUserId", protect, followUser)

// @desc    Unfollow user
// @access  Registerd users
router.post("/:userId/unfollow/:followeeUserId", protect, followUser)


export default router;
