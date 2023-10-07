import { Router } from "express";
const router = Router();

//importing controllers
import { authAdmin, authUser } from "../controllers/authController";

//importing middleware
import protectAdmin from "../middleware/adminAuth";
import protect from "../middleware/authMiddleware";


// @desc    User authentication
// @access  Private
router.get('/user', protect,  authUser);

// @desc    Admin authentication
// @access  Private
router.get('/admin', protectAdmin, authAdmin);








export default router;