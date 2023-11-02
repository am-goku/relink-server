//  exporting the service account key file path


import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const serviceAccount = require("../../relink-app-firebase-adminsdk-8rjyx-d07c6acd86.json");

export const googleApplicationCredentials = serviceAccount;