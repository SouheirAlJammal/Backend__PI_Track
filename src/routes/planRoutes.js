import express from "express";
import  { createPlan, editPlan, deletePlan, getAllPlans,getPlanById } from "../controllers/planController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/create", isAuthenticated,createPlan);
router.get("/",isAuthenticated, getAllPlans);
router.get("/onePlan/:id",isAuthenticated, getPlanById);
router.delete("/delete/:id", isAuthenticated,deletePlan);
router.patch("/update/:id",isAuthenticated, editPlan);


export default router;
