import nodemailer, { createTransport } from "nodemailer";

export const sentEmail = async (email, username, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
        tls: {
          rejectUnauthorized:false,
        }
      });

      const template =`<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>ReLink OTP Email</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                  <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #333; text-align: center;">ReLink OTP Code</h2>
                    <p>Hello ${username},</p>
                    <p>You have requested an OTP code to verify your identity on ReLink. Please enter the following code on the verification page to complete the process:</p>
                    <p style="text-align: center; font-size: 24px; font-weight: bold;">OTP Code: ${token} </p>
                    <p>If you did not request this code, please ignore this message. The code is valid for 30 minutes.</p>
                    <p>Thank you for using ReLink.</p>
                    <p style="text-align: center;">Best regards,<br>The ReLink Team</p>
                  </div>
                </body>
                </html>`;

      const info = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: "Relink email verification", // Subject line
        text: "",
        html: template // plain text body
      });
      resolve(info);
    } catch (error) {
      console.log("error in sentmail: " + error);
      reject(error);
    }
  });
};
