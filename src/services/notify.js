import { fetchUserById } from "../helpers/userHelper";
import { messaging } from "../utils/firebaseInit";

// Send a message to the devices corresponding to the provided
// registration tokens.
export const sendNotification = (userId, message, misc = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await fetchUserById(userId);

      
      const token = user[0].fcmToken;

      console.log(message);

      const newData = JSON.stringify(message);

      const topic = "notify";
      const notification = {
        data: {
          newData
        },
        topic,
      };

      messaging
        .subscribeToTopic(token, topic)
        .then((response) => {
          console.log("Successfully subscribed to topic:", response);
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
        })
        .catch((error) => {
          console.log("Error subscribing to topic:", error);
        }).finally(()=> {
          messaging.unsubscribeFromTopic(token, topic).then((res)=> {
            resolve(res);
          })
        })
    } catch (error) {
      reject(error);
    }
  });
};
