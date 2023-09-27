import { Router } from "express";
import { getUserdetails, login, registerUser } from "../controllers/userController.js";
const router = Router();




router.get('/userdetails', getUserdetails);


router.post('/login', login);

router.post('/register', registerUser);




export default router;
