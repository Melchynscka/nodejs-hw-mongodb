import express from "express";
import cors from "cors";
import { env } from "./utils/env.js";
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "../src/middlewares/logger.js";
import { UPLOAD_DIR } from './constants/index.js';


export const setupServer = () => {
    const app = express();
    app.use(logger);
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use('/uploads', express.static(UPLOAD_DIR));
    // routes
    // app.use("/auth", authRouter);
    // app.use("/contacts", contactsRouter);
    app.use(router);
    app.use(notFoundHandler);
    app.use(errorHandler);
    
    const port = Number(env("PORT", 3001));

    app.listen(port, () => console.log("Server is running on port 3001"));
}