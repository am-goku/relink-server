import { Router } from "express";
const router = Router();

//importing controllers
import { fetchUsers } from "../controllers/userController";
import { adminPostLogin } from "../controllers/adminController";

//importing middleware
import protectAdmin from "../middleware/adminAuth";



// @desc    Login admin
// @access  Admins
router.post('/login', adminPostLogin);

// @desc    Fetch users
// @access  Admins
router.get('/fetch-users',protectAdmin, fetchUsers);








export default router;