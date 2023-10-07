import { Router } from "express";
const router = Router();

//IMPORTING CONTROLLERS
import {fetchUsers, login, registerUser, getUserdetails,} from "../controllers/userController.js";


// @desc    Fetch username && email
// @access  Private
router.get("/userdetails", getUserdetails);

// @desc    Fetch users
// @access  Authenticated users
router.get("/fetch-users", fetchUsers);

// @desc    Login user
// @access  Public
router.post("/login", login);

// @desc    Register user
// @access  Public
router.post("/register", registerUser);




export default router;
