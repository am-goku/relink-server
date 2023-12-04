import { User } from "../models/userModel.js";


const clearFCM = async () => {
  try {
    const result = await User.updateMany({}, {$set:{online: false}});
    console.log(result);
  } catch (error) {
    console.log("Error clearing FCM: ", error);
  }
};

setInterval(clearFCM, 10 * 60 * 1000);