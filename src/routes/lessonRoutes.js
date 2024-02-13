import { Router } from "express";
import { createLesson, getLesson, getLessons, deleteLesson, editLesson }from "../controllers/lessonController.js";

const router = express.Router();

router.post("/create",createLesson);
router.get("/", getLessons);
router.delete("/delete/:id", deleteLesson);
router.get("/oneTask/:id", getLesson);
router.patch("/update/:id",editLesson);

export default router;