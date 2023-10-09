import { Router } from "express";
const router = Router();

//importing controllers
import { fetchUsers } from "../controllers/userController";
import { adminPostLogin, changeStatus } from "../controllers/adminController";

//importing middleware
import protectAdmin from "../middleware/adminAuth";



// @desc    Login admin
// @access  Admins
router.post('/login', adminPostLogin);

// @desc    Fetch users
// @access  Admins
router.get('/fetch-users',protectAdmin, fetchUsers);

// @desc    Change block status
// @access  Admins
router.patch('/:userId/change-status', protectAdmin, changeStatus);








export default router;