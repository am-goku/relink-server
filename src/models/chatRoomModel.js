import mongoose, { Schema, model } from "mongoose";


const chatRoomSchema = new Schema({
    users: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user"
            }
        ],
        require: true,
    },
    theme: {
        type: String,
    },
    background: {}
}, {
    timestamps: true,
})


export const ChatRoom = model("chatRoom", chatRoomSchema);