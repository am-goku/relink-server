

export const authUser = (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        res.status(200).json({status:200, message:"User is authenticated", valid: true, user});
    } catch (err) {
        res
          .status(200)
          .json({ status: 500, message: "Somethings is wrong", error_code: "INTERNAL_SERVER_ERROR" });
    }
}