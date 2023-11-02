import { Notifications } from "../models/notificationModel"
import { sendNotification } from "../services/notify";
import { fetchAPost } from "./postHelper";
import { fetchUserById } from "./userHelper"
import { ObjectId } from "mongoose";


// when a user likes a post \\

export const notifyLike = (userId, fromId, postId) => {
    return new Promise(async (resolve, reject) => {

        const likedUser = await fetchUserById(fromId);

        console.log("liked user: " , likedUser);

        const newNotification = new Notifications({
            userId: userId,
            from: fromId,
            postId: postId,
            message: `${likedUser[0]?.username} liked your post.`
        });

        newNotification.save().then((response) => {
            sendNotification(userId, response)
            resolve(response)
        }).catch((err) => reject(err));
    })
};



// when a user follows another user \\

export const notifyFollow = (userId, fromId) => {
    return new Promise(async (resolve, reject) => {
        const followedUser = await fetchUserById(fromId);

        const newNotification = new Notifications({
            userId: userId,
            from: fromId,
            message: `${followedUser?.username} started following you.`
        })
        
        newNotification.save().then((response)=> {
            sendNotification(userId, response)
            resolve(response)
        }).catch((err) => reject(err))
    })
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



// to set change the read status \\

export const readNotification = (userId, notifyId) => {
    return new Promise((resolve, reject) => {
        Notifications.findOneAndUpdate({userId: userId, notifyId: notifyId}).then((response) => {
            resolve(response);
        }).catch((err)=> reject(err))
    })
};


// to clear all notifications \\

export const clearNotifications = (userId) => {
    return new Promise((resolve, reject) => {
        Notifications.deleteMany({userId: userId}).then((response) => {
            resolve(response);
        }).catch((err)=> reject(err))
    })
};


// to get all notifications \\

export const fetchNotifications = (userId) => {
    return new Promise((resolve, reject) => {
        Notifications.findOne({userId: userId}).then((response) => {
            resolve(response);
        }).catch((err)=>reject(err))
    })
};
