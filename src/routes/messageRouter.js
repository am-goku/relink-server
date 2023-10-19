import { Router } from "express";
import protect from "../middleware/authMiddleware";
import { getChats, sendNewMessage, setChatRoom } from "../controllers/chatController";
const router = Router();








// @desc    Get chats from a room
// @access  Users - private
router.get("/inbox/:roomId", protect, getChats);


// @desc    Create or get chatRoom of two
// @access  Users - private
router.put("/inbox/room/:firstId/:secondId", protect, setChatRoom);
                        //@user  //@other


// @desc    Send new chat
// @access  Users - private
router.post("/inbox/new-message/:roomId", protect, sendNewMessage)









export default router;