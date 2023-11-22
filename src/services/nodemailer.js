
import crypto from "crypto";
import { Verify } from "../models/verifyModel.js";
import { sentEmail, sentVerificationEmail } from "./sentmail.js";
import { url } from "inspector";




export const verificationEmail = (email, username) => {
    return new Promise (async (resolve, reject) => {
        try {
            const token = crypto.randomBytes(3).toString('hex');
            const verify = new Verify({
                email: email,
                username: username,
                token: token,
            });
            await verify.save();

            sentEmail(email, username, token).then((response)=> {
                resolve(response);
            }).catch((error)=> {
                reject(error);
            })

        } catch (error) {
            reject(error);
        }
    })
}


export const verifyOtpToken = (email, token) => {
  return new Promise((resolve, reject) => {
    try {
      Verify.findOne({ email: email, token: token})
        .then(async (data) => {
          if (!data?.used) {
            await Verify.findOneAndUpdate(
              { email: email, used: false },
              { used: true }
            );
            resolve({ valid: true, data });
          } else {
            reject({
              status: 400,
              message: "Invalid verification code",
            });
          }
        })
        .catch((err) => {
          reject({
            status: 500,
            message: "Invalid verification code",
            error_code: "DB_FETCH_ERROR",
          });
        });
    } catch (error) {
      reject({
        status: 500,
        message: error.message,
        error_code: "INTERNAL_ERROR",
      });
    }
  });
};





///////////// password management ///////////////

export const generateTokenForPassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = crypto.randomBytes(32).toString('hex');
      const verify = new Verify({
        username: data?.username,
        email: data?.email,
        token: token,
        password: data?.password
      })

      await verify.save();

      const verificationLink = `${process.env.SERVER_BASE}/auth/change-password/verify/${data?.username}/${token}`;

      sentVerificationEmail(data?.email, data?.username, verificationLink).then((response)=> {
        resolve(response);
      }).catch((error)=> {
        reject(error);
      })

    } catch (error) {
        reject(error);
    }
  })
}