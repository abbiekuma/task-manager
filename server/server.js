/**
 * npm init 是用于创建一个新的 Node.js 项目的初始化命令，它会生成一个 package.json 文件，这个文件是项目的「说明书」或「身份卡」。
 *
 * put ["start": "node server.js" ] in package.json
 * so that when you do 'npm start', you can run the frontend with 'node server.js'
 * --------------------------
 * put ["dev": "nodemon server.js", ] in package.json; need to `npm install --save-dev nodemon` first before 'npm run dev'
 * so that whenever you change any js file, it will restart the server for you
 */

/**
 * Client (Postman/Browser)
   ↓
Express Server (server.js) 
【Sets up system and routes.
Connects DB, sets middleware, mounts routes.】
   ↓
Routes (/routes/*.js)
【Defines which URL calls which controller function.】
   ↓
Controllers (/controllers/*.js)
【Handles logic like registration or login. Receives request → calls model → sends response.】
   ↓
Models (/models/*.js)
【Defines database schema and operations, like user or task models.】
   ↓
MongoDB
===================
Browser sends request 
→ server.js receives it 
→ routes decide where to go 
→ controllers handle registration 
→ models save data to the database
 */

// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    console.log("DB Connected Successfully!");
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
