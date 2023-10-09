//importing helpers
import { adminLogin, toggelBlockStatus } from "../helpers/adminHelper";



// @desc    Login admin
// @route   POST /admin/login
// @access  Private
export const adminPostLogin = (req, res, next) => {
    try {
        const data = req.body;
        console.log(data);
        adminLogin(data).then((response) => {
            res.status(200).json({...response});
        }).catch((error) => {
            res.status(200).json({status:500, error_code: "INTERNAL_SERVER_ERROR", message:error.message});
        })
    } catch (error) {
        console.log("error logging in admin", error);
    }
}


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