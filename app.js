import express from 'express';
import cors from 'cors';
import logger from 'morgan'
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import http from 'http';


import {connect} from './src/config/mongoose.js';
import cloudinaryConfig from './src/services/cloudinary.js';


//importing the routes location
import adminRouter from './src/routes/adminRouter.js';
import userRouter from './src/routes/userRouter.js';
import postRouter from './src/routes/postRouter.js';
import authRouter from './src/routes/authRouter.js';
import messageRouter from "./src/routes/messageRouter.js";
import bodyParser from 'body-parser';
import socketIo_Config from './src/services/socketIo.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST", "PUT", "PATCH"],
  },
});

//dotenv configuration
dotenv.config();

//mongoose connection
connect();

//cloudinary configuration
cloudinaryConfig();

//settingup corse options
const corsOption = {
    origin: 'http://localhost:3000',
}
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOption));

app.use(logger("dev")); //logger


//socket connection 
socketIo_Config(io);


//settingup router paths
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);


const port = process.env.LISTENING_PORT;
server.listen(port, ()=>{
    console.log('the server is listening on: ', `http://localhost:${port}`);
})
