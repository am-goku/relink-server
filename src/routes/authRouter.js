import { Router } from "express";
const router = Router();

import { authAdmin, authUser } from "../controllers/authController";
import protectAdmin from "../middleware/adminAuth";
import protect from "../middleware/authMiddleware";



router.get('/user', protect,  authUser);

router.get('/admin', protectAdmin, authAdmin);








export default router;