//importing helpers
import { adminLogin, getUsers, toggelBlockStatus } from "../helpers/adminHelper";


////////////////////////////////////////////////// ADMIN LOGIN //////////////////////////////////////////////////////////////////
// @desc    Login admin
// @route   POST /admin/login
// @access  Private
export const adminPostLogin = (req, res, next) => {
    try {
        const data = req.body;
        adminLogin(data).then((response) => {
            res.status(200).json({...response});
        }).catch((error) => {
            res.status(200).json({status:500, error_code: "INTERNAL_SERVER_ERROR", message:error.message});
        })
    } catch (error) {
        console.log("error logging in admin", error);
    }
}



////////////////////////////////////////////////// USER RELATED //////////////////////////////////////////////////////////////////
// @desc    Change user's block status
// @route   PATCH /admin/:userId/change-status
// @access  Admin - private
export const changeStatus = (req, res) => {
    try {
        const userId = req.params.userId;
        const status = req.body.status;
        toggelBlockStatus(userId, status).then((response) =>{
            res.status(200).send(response);
        }).catch((error) => {
            res.status(500).send(error.message);
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
}



////////////////////////////////////////////////// USER FETCH //////////////////////////////////////////////////////////////////
// @desc    Get users
// @route   GET /admin/fetch-users
// @access  Admin - private
export const fetchUsers = (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 7;
    const search = req.query.search || '';

    getUsers(page, perPage, search).then((response) => {
      res.status(200).json(response)
    }).catch((err) => {
      res.status(500).json(err);
    })
  } catch (error) {
    console.log("error in fetchUsers (userController)", error);
    res.status(500).json(err);
  }
};