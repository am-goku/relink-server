import { Router } from "express";
import { fetchUsers } from "../controllers/userController";
import { adminPostLogin } from "../controllers/adminController";
import protectAdmin from "../middleware/adminAuth";

const router = Router();



router.post('/login', adminPostLogin);



//to get all the user details
router.get('/fetch-users',protectAdmin, fetchUsers);








export default router;