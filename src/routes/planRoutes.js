import express from "express";
import  { createPlan, editPlan, deletePlan, getAllPlans,getPlanById } from "../controllers/planController.js";

const router = express.Router();

router.post("/create", createPlan);
router.get("/", getAllPlans);
router.get("/onePlan/:id", getPlanById);
router.delete("/delete/:id", deletePlan);
router.patch("/update/:id", editPlan);


export default router;
