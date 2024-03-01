import express from "express";
import  { createPlan, editPlan, deletePlan, getAllPlans,getPlanById ,InviteParticipant,acceptInvitation} from "../controllers/planController.js";
import { isAuthenticated} from '../middlewares/authMiddleware.js';
import { uploadImage } from "../middlewares/multer.js";

const router = express.Router();

router.post("/create", isAuthenticated, uploadImage.single("image"),createPlan);
router.get("/",isAuthenticated, getAllPlans);
router.get("/onePlan/:id",isAuthenticated, getPlanById);
router.delete("/delete/:id", isAuthenticated,deletePlan);
router.patch("/update/:id",isAuthenticated, uploadImage.single("image"), editPlan);
router.post('/inviteUser/:planId', isAuthenticated,InviteParticipant)
router.put('/acceptInvitation', isAuthenticated, acceptInvitation);
export default router;
