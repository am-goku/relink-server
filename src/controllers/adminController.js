//importing helpers
import { adminLogin } from "../helpers/adminHelper";



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

