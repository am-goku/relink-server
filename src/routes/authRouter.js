import { Router } from "express";
const router = Router();

//importing controllers
import { authAdmin, authUser } from "../controllers/authController";

//importing middleware
import protectAdmin from "../middleware/adminAuth";
import protect from "../middleware/authMiddleware";
import { sentVerificationEmail, verifyOTP } from "../controllers/userController";


// @desc    User authentication
// @access  Private
router.get('/user', protect,  authUser);

// @desc    Admin authentication
// @access  Private
router.get('/admin', protectAdmin, authAdmin);


// @desc    Sent email verification
// @access  Registerd users
router.post('/sent-verification', sentVerificationEmail);


// @desc    Verify otpToken
// @access  Public
router.post('/verify-otpToken', verifyOTP);








export default router;