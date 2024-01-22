import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { logger } from "./utils/logger.util.js";
import { dbConnection } from "./db.controller.js";
import { routes } from "./routes.js";
import Razorpay from "razorpay";
import https from "https";
import fs from "fs";
import {v2 as cloudinary} from 'cloudinary';

import { initializeApp,applicationDefault} from "firebase-admin/app";
 


dotenv.config();

cloudinary.config({ 
  cloud_name: 'dxrze8ji2', 
  api_key: '987534721543442', 
  api_secret: '4o68EWb4h3M1ETJQTGuw8AfXcV0' 
});

const app = express();
process.env.GOOGLE_APPLICATION_CREDENTIALS;
console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
initializeApp({
  credential: applicationDefault(),
  project_id: "hustleforwork-310c3"
});
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://hustleforwork.com",
    "http://localhost:3001",
    "https://frontfeverr.vercel.app",
    "https://adminfeverr-eight.vercel.app"
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({limit:'100mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000; // Change the port to 443 for HTTPS

// // Load SSL certificate and private key
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/hustleforwork.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/hustleforwork.com/fullchain.pem', 'utf8');
// const credentials = {
//   key: privateKey,
//   cert: certificate,
// };

// // Create an HTTPS server using Express app and SSL credentials
// const httpsServer = https.createServer(credentials, app);

app.listen(PORT, () => {
  logger.info(`Server started at port ${PORT}`, {
    meta: {
      method: "httpsServer.listen",
    },
  });
  dbConnection(process.env.MONGO_DB_URI);
});

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

routes(app);
