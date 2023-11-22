import { Notifications } from "../models/notificationModel.js"
import { sendNotification } from "../services/notify.js";
import { fetchAPost } from "./postHelper.js";
import { fetchUserById } from "./userHelper.js"


// when a user likes a post \\

export const notifyLike = (post, fromId) => {
    return new Promise(async (resolve, reject) => {

        const likedUser = await fetchUserById(fromId);
        const currentUser = await fetchUserById(post?.userId)

        if(likedUser[0]?.username === currentUser[0]?.username){
            console.log(likedUser[0]?.username === currentUser[0]?.username);
            resolve(false);
        } else {
            console.log("liked user: ", likedUser);

            const newNotification = new Notifications({
              userId: currentUser[0]?._id,
              from: fromId,
              postId: post?._id,
              message: `liked your post.`,
            });

            newNotification
              .save()
              .then((response) => {
                sendNotification(currentUser[0]?._id, response);
                resolve(response);
              })
              .catch((err) => reject(err));
        }        
    })
};



// when a user follows another user \\

export const notifyFollow = (userId, fromId) => {
  return new Promise(async (resolve, reject) => {
    const followedUser = await fetchUserById(fromId);

    const currentUser = await fetchUserById(userId);

    if (currentUser[0]?.username === followedUser[0]?.username) {
      resolve(false);
    } else {
      const newNotification = new Notifications({
        userId: userId,
        from: fromId,
        message: `started following you.`,
      });

      newNotification
        .save()
        .then((response) => {
          sendNotification(userId, response);
          resolve(response);
        })
        .catch((err) => reject(err));
    }
  });
};



// when admin blocks a post \\

export const notifyPostBlock = (userId, postId) => {
    return new Promise(async (resolve, reject) => {

        const post = await fetchAPost(postId);

        const newNotification = new Notifications({
            userId: userId,
            message: "You post has been blocked by the administrator."
        });

        newNotification.save().then((response) => {
            sendNotification(userId, response, post)
            resolve(response);
        }).catch((err)=> reject(err))
    })
};



// @desc    Read notifications
// @route   PATCH /user/notifications/read/:notificationId
// @access  Registerd users
export const readNotification = (notifyId) => {
    return new Promise((resolve, reject) => {
        Notifications.findOneAndUpdate({_id: notifyId}, {isRead: true}).then((response) => {
            resolve(response);
        }).catch((err)=> reject(err))
    })
};


// @desc    Delete notification
// @route   DELETE /user/notifications/delete/:userId
// @access  Registerd users
export const clearNotifications = (userId) => {
    return new Promise((resolve, reject) => {
        Notifications.deleteMany({userId: userId}).then((response) => {
            console.log(response);
            resolve(response);
        }).catch((err)=> reject(err))
    })
};



// @desc    Fetch notifications
// @route   /user/:userId/notifications
// @access  Registerd users
export const fetchNotifications = (userId) => {
    return new Promise((resolve, reject) => {
        Notifications.find({userId: userId}).sort({createdAt: -1}).then((response) => {
            resolve(response);
        }).catch((err)=>reject(err))
    })
};
