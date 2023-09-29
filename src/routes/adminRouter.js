import { Router } from "express";
import { fetchUsers } from "../controllers/userController";
import { adminPostLogin } from "../controllers/adminController";

const router = Router();



router.post('/login', adminPostLogin);



//to get all the user details
router.get('/users', fetchUsers);








export default router;