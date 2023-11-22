import {
  clearNotifications,
  fetchNotifications,
  readNotification,
} from "../helpers/notificationHelper.js";



// @desc    Fetch notifications
// @route   GET /user/:userId/notifications
// @access  Registerd users
export const fetch_notifications = (req, res) => {
  try {
    const userId = req.params.userId;
    fetchNotifications(userId)
      .then((notifications) => {
        res.status(200).json(notifications);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

// @desc    Read notifications
// @route   PATCH /user/notifications/read/:notificationId
// @access  Registerd users
export const setReadStatus = (req, res) => {
  try {
    const notifyId = req.params.notificationId;
    readNotification(notifyId)
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Delete notification
// @route   DELETE /user/notifications/delete/:userId
// @access  Registerd users
export const deleteNotification = (req, res) => {
  try {
    const userId = req.params.userId;
    clearNotifications(userId)
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};
