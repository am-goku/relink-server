import { Router } from "express";
const router = Router();

//IMPORTING CONTROLLERS
import {
  login,
  registerUser,
  savePost,
  removeSavedPost,
  followUser,
  searchUser,
  fetchUserByUsername,
  getConnection,
  unfollowUser,
  updateUser,
  fetch_Users,
  reportUser,
  registerFcmToken,
  logout,
  OauthLogin,
  regOauthUser,
  fetchUserByEmail,
  requestVerification,
  fetchRandomUsers,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import { deleteNotification, fetch_notifications } from "../controllers/notificationController.js";


// @desc    Fetch users
// @access  Authenticated users
router.get("/fetch-users", fetch_Users);

// @desc    Fetch user by username
// @access Authenticated users
router.get("/fetch/username/:username", fetchUserByUsername )

// @desc    Login user
// @access  Public
router.post("/login", login);

// @desc    Login google user
// @access  Public
router.post("/login/Oauth", OauthLogin)

// @desc    Register user
// @access  Public
router.post("/register", registerUser);

// @desc    Register google user
// @access  Public
router.post('/register/Oauth', regOauthUser);

// @desc    Get users with email
// @access  Public
router.get('/fetch-user/email/:email', fetchUserByEmail);

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


// @desc    Report user
// @access  Registerd users
router.post("/report/user/:userId/:username", protect, reportUser)


// @desc    Register fcm
// @access  Registerd users
router.post("/fcm/:userId/:fcmToken", registerFcmToken);

// @desc    Fetch notifications
// @access  Registerd users
router.get("/:userId/notifications", protect, fetch_notifications)

// @desc    Read notifications
// @access  Registerd users
router.patch("/notifications/read/:notificationId", protect, fetch_notifications);

// @desc    Delete notification
// @access  Registerd users
router.delete("/notifications/delete/:userId", protect, deleteNotification)


///////////////////////// password management //////////////////
router.post("/password/verify/email", protect, requestVerification);


router.get("/fetch-suggested-users/:userId", protect, fetchRandomUsers)


// @desc    Logout user
// @access  Registerd users
router.post("/logout/:userId", logout)







export default router;
