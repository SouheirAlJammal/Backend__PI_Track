import express from "express";
import { createTask, getTask, getTasks, deleteTask, updateTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/create",createTask);
router.get("/", getTasks);
router.delete("/delete/:id", deleteTask);
router.get("/oneTask/:id", getTask);
router.patch("/update/:id",updateTask);

export default router;