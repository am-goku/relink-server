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
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import { sendNotification } from "../services/notify.js";


// @desc    Fetch users
// @access  Authenticated users
router.get("/fetch-users", fetch_Users);

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


// @desc    Report user
// @access  Registerd users
router.post("/report/user/:userId/:username", protect, reportUser)


// @desc    Register fcm
// @access  Registerd users
router.post("/fcm/:userId/:fcmToken", protect, registerFcmToken);




//testing

router.get("/testNotification", async (req, res, next) => {
  try {
    const data = {
      title: "Test Notification",
      data: "sample data"
    }
    const token =
      "euEn_1SVArex6mwaf1Ntr8:APA91bEOfRbkPl9U8fO80GQdWSD9HBNod2hOOxfWciFT8FZnyjKdUbVorTTyZuoOCTz_ZWSst-T-i-TXXcEAKURGhBapbNO6_G8lFM-pJlT5gtlGueOH-Ikd4leGtNGUdSGTWKdL5Upf";
    sendNotification(token, data).then((response) => {
      res.status(200).send(response);
    }).catch((error) => {
      res.status(200).send(error);
    })
  } catch (error) {
    res.status(500).send(error)
  }
})





export default router;
