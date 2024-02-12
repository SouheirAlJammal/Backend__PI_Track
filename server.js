import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbconnect from "./src/config/dbConfig.js";
import userRoute from './src/routes/userRoutes.js'
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/users", userRoute); 

dbconnect();

app.listen(port, () => {
  console.log(`Server is listenning on port ${port}`);
});
