
import crypto from "crypto";
import { Verify } from "../models/verifyModel";
import { sentEmail } from "./sentmail";
import { url } from "inspector";




const verificationEmail = (email, username) => {
    return new Promise (async (resolve, reject) => {
        try {
            const token = crypto.randomBytes(3).toString('hex');
            const verify = new Verify({
                email: email,
                username: username,
                token: token,
            });
            await verify.save();

            sentEmail(email, token, username).then((response)=> {
                resolve(response);
            }).catch((error)=> {
                reject(error);
            })

        } catch (error) {
            reject(error);
        }
    })
}

export default verificationEmail;