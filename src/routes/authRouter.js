import { Router } from "express";
const router = Router();

import auth from "../middleware/authMiddleware";
import { authUser } from "../controllers/authController";



router.get('/user', auth,  authUser);










export default router;