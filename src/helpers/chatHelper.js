import { ChatRoom } from "../models/chatRoomModel";
import { Messages } from "../models/messageModel"





// @desc    Get chats from a room
// @route   /messages/inbox/:roomId
// @access  Users - private
export const getChatHelper = (roomId) => {
  return new Promise(async (resolve, reject) => {
    try {
      Messages.find({ roomId: roomId })
        .then((messages) => {
          resolve(messages)
        })
        .catch((err) =>
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: "Somethings wrong.",
            err,
          })
        )
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong.",
        error,
      })
    }
  })
}



// @desc    Create or get chatRoom of two
// @route   /messages/inbox/room/:firstId/:secondId
// @access  Users - private
export const chatRoomHelper = (userIds) => {
    return new Promise((resolve, reject) => {
        try {
            userIds.sort();
            ChatRoom.findOneAndUpdate(
              { users: userIds },
              { users: userIds },
              { upsert: true, new: true }
            ).then((room) => {
                resolve(room)
            }).catch((err)=> {
                reject({
                  status: 500,
                  error_code: "DB_FETCH_ERROR",
                  message: "Somethings wrong.",
                  err,
                })
            })
        } catch (error) {
            reject({
              status: 500,
              error_code: "INTERNAL_SERVER_ERROR",
              message: "Somethings wrong.",
              error,
            })
        }
    })
}