import { fetchUserById } from "../helpers/userHelper.js";
import { User } from "../models/userModel.js";
import { messaging } from "../utils/firebaseInit.js";

// Send a message to the devices corresponding to the provided
// registration tokens.
export const sendNotification = (userId, message, misc = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await fetchUserById(userId);

      const token = user[0].fcmToken;

      console.log("message",{...message});

      const newData = JSON.stringify(message);

      const notification = {
        data: {
          newData
        },
        token: token
      };

      if (token) {
        messaging
          .send(notification)
          .then((response) => {
            // Response is a message ID string.
            console.log("Successfully sent message:", response);
          })
          .catch((error) => {
            console.log("Error sending message:", error);
            reject(error);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};





export const sendMessageNotification = (senderId, roomId, message) => {
  return new Promise(async (resolve, reject) => {
    const sender = await User.findOne({_id: senderId});

    const newMessage = `${sender?.username}: ${message}`;

    let recieverId;

    if(roomId[0] !== senderId){
      recieverId = roomId[0];
    } else {
      recieverId = roomId[1];
    }

    sendNotification(recieverId, newMessage);

    resolve(true)
  })
}



