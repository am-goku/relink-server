import { Router } from "express";
import {
    fetchUsers,
  getUserdetails,
  login,
  registerUser,
} from "../controllers/userController.js";
const router = Router();




//route to get the list of username and password as an array
router.get("/userdetails", getUserdetails);

//route to fetch details of all users
router.get("/fetch-users", fetchUsers);

//routes for the login
router.post("/login", login);

//routes fot the registration process
router.post("/register", registerUser);




export default router;
