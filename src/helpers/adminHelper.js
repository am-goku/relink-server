import mongoose from "mongoose";
import generateJwt from "../services/jwt";
import { Admin } from "../models/adminModel";

import bcrypt from "bcrypt";





export const adminLogin = (data) => {
  try {
    return new Promise(async (resolve, reject) => {
      const admin = await Admin.findOne({ email: data.email });
      if (
        data.email === admin?.email &&
        bcrypt.compare(data.password, admin.password)
      ) {
        generateJwt(admin)
          .then((adminToken) => {
            console.log(adminToken);
            resolve({
              status: 200,
              message: "Admin login successful",
              adminToken,
            });
          })
          .catch((error) => {
            console.log(error);
            resolve({
              status: 500,
              message: error.message,
              error_code: "INTERNAL_SERVER_ERROR",
            });
          });
      } else {
        resolve({ status: 401, message: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.log("error during admin login (in adminHelper): " + error);
  }
};
