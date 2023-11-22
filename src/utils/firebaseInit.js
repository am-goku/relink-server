import admin from "firebase-admin";

import { googleApplicationCredentials } from "./settings.js"


const serviceAccount = googleApplicationCredentials 


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "your-database-url-here",
});

export const messaging = admin.messaging();


