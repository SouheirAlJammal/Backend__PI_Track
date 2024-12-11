import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbconnect from "./src/config/dbConfig.js";
import userRoute from './src/routes/userRoutes.js'
import taskRoute from './src/routes/taskRoutes.js'
import planRoute from './src/routes/planRoutes.js'
import lessonRoute from './src/routes/lessonRoutes.js'
import statisticsRoute from './src/routes/userStatisticsRoutes.js'
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:process.env.FRONTEND_ORIGIN,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    headers: 'Content-Type, Authorization',
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/users", userRoute); 
app.use("/api/tasks", taskRoute); 
app.use("/api/lessons", lessonRoute); 
app.use("/api/plans", planRoute); 
app.use("/api/statistics", statisticsRoute); 




dbconnect();

app.listen(port, () => {
  console.log(`Server is listenning on port ${port}`);
});
