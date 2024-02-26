import express from "express";
import { createLesson, editLesson, deleteLesson, updateLessonProgress,getLessonsForParticipant,getLessonByIdForParticipant }from "../controllers/lessonController.js";
import { isAuthenticated} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/create", isAuthenticated,createLesson);
router.get("/:planId/", isAuthenticated,getLessonsForParticipant);
router.delete("/delete/:id",isAuthenticated, deleteLesson);
router.get("/lesson/:planId/:lessonId",isAuthenticated, getLessonByIdForParticipant);
router.patch("/edit/:id",isAuthenticated, editLesson);
router.patch("/updateProgress",isAuthenticated, updateLessonProgress); 

export default router;
