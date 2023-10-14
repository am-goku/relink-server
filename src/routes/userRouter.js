import { Router } from "express";
const router = Router();

//IMPORTING CONTROLLERS
import {fetchUsers, login, registerUser, getUserdetails, savePost, removeSavedPost, followUser, searchUser, fetchUserByUsername, getConnection, unfollowUser, updateUser,} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";


// @desc    Fetch username && email
// @access  Private
router.get("/userdetails", getUserdetails);

// @desc    Fetch users
// @access  Authenticated users
router.get("/fetch-users", fetchUsers);

// @desc    Fetch user by username
// @access Authenticated users
router.get("/fetch/username/:username", fetchUserByUsername )

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
router.post("/:userId/unfollow/:followeeUserId", protect, unfollowUser)

// @desc    Get connections
// @access  Registerd users
router.get("/fetch/connection/:userId", protect, getConnection)



// @desc    Search user
// @access  Registerd users
router.get("/search/:key", searchUser)


// @desc    Update user
// @access  Registerd users
router.put("/update/user/:username", protect, updateUser)


export default router;
