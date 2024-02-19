import express from "express";
import { createLesson, editLesson, deleteLesson, updateLessonProgress,getLessonsForParticipant,getLessonByIdForParticipant }from "../controllers/lessonController.js";

const router = express.Router();

router.post("/create", createLesson);
router.get("/:planId/", getLessonsForParticipant);
router.delete("/delete/:id", deleteLesson);
router.get("/lesson/:planId/:lessonId", getLessonByIdForParticipant);
router.patch("/edit/:id", editLesson);
router.patch("/updateProgress", updateLessonProgress); 

export default router;
