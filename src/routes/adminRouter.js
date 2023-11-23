import { Router } from "express";
const router = Router();

//importing controllers
import {
  adminPostLogin,
  blockPost,
  changeStatus,
  fetchPosts,
  fetchUsers,
  getPostReports,
  getUserReports,
} from "../controllers/adminController.js";

//importing middleware
import protectAdmin from "../middleware/adminAuth.js";
import { fetchSinglePost } from "../controllers/postController.js";



// @desc    Login admin
// @access  Admins
router.post('/login', adminPostLogin);

// @desc    Fetch users (with pagination and filter)
// @access  Admins
router.get('/fetch-users', protectAdmin, fetchUsers);

// @desc    Change block status
// @access  Admins
router.patch('/:userId/change-status', protectAdmin, changeStatus);




// @desc    Fetch user reports
// @access  Admins
router.get('/reports/users', protectAdmin, getUserReports)
// @desc    Fetch post reports
// @access  Admins
router.get("/reports/posts", protectAdmin , getPostReports)




// @desc    Fetch posts with pagination and populated user
// @access  Admins
router.get('/fetch-posts', protectAdmin, fetchPosts);


router.get("/fetch-single-post/:postId", protectAdmin, fetchSinglePost);

// @desc    Block a Post
// @access  Admins
router.patch('/post/block/:postId', protectAdmin, blockPost)



export default router;