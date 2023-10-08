import express from 'express';
import cors from 'cors';
import logger from 'morgan'
import dotenv from 'dotenv';

import {connect} from './src/config/mongoose.js';
import cloudinaryConfig from './src/services/cloudinary.js';


//importing the routes location
import adminRouter from './src/routes/adminRouter.js';
import userRouter from './src/routes/userRouter.js';
import postRouter from './src/routes/postRouter.js';
import authRouter from './src/routes/authRouter.js';




const app = express();


//dotenv configuration
dotenv.config();

//mongoose connection
connect();

//cloudinary configuration
cloudinaryConfig();


//settingup corse options
const corsOption = {
    origin: 'http://localhost:3000'
}
//middlewares
app.use(express.json());
app.use(cors(corsOption));

app.use(logger("dev")); //logger



//settingup router paths
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/auth", authRouter)


const port = process.env.LISTENING_PORT;
app.listen(port, ()=>{
    console.log('the server is listening on: ', `http://localhost:${port}`);
})
