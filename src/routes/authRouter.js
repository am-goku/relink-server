import { Router } from "express";
const router = Router();

//importing controllers
import { authAdmin, authUser, changePassword } from "../controllers/authController";

//importing middleware
import protectAdmin from "../middleware/adminAuth";
import protect, { refreshAccessToken } from "../middleware/authMiddleware";
import { sentVerificationEmail, verifyOTP } from "../controllers/userController";


// @desc    User authentication
// @access  Private
router.get('/user', protect,  authUser);

// @desc    Admin authentication
// @access  Private-admin
router.get('/admin', protectAdmin, authAdmin);




// @desc    Renew user access token
// @access  Private
router.post('/user/refresh-token', refreshAccessToken);

// @desc    Renew admin access token
// @access  Private- admin
router.post('/admin/refresh-token', protectAdmin);





// @desc    Sent email verification
// @access  Registerd users
router.post('/sent-verification', sentVerificationEmail);


// @desc    Verify otpToken
// @access  Public
router.post('/verify-otpToken', verifyOTP);



// change password
router.get('/change-password/verify/:username/:token', changePassword);





export default router;