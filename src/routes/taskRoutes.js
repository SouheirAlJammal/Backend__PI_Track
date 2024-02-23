import express from "express";
import { createTask, getTask, getTasks, deleteTask, updateTask } from "../controllers/taskController.js";
import { isAuthenticated, isAuthorizedUser} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/create",isAuthenticated,createTask);
router.get("/",isAuthenticated, getTasks);
router.delete("/delete/:id",isAuthenticated, deleteTask);
router.get("/oneTask/:id", isAuthenticated,getTask);
router.patch("/update/:id",isAuthenticated,updateTask);

export default router;