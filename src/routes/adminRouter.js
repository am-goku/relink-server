import { Router } from "express";
import { fetchUsers } from "../controllers/userController";
import { adminPostLogin } from "../controllers/adminController";
import protect from "../middleware/authMiddleware";

const router = Router();



router.post('/login', adminPostLogin);



//to get all the user details
router.get('/fetch-users',protect, fetchUsers);








export default router;