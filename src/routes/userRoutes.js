import express from 'express';
import { register, login, getUsers, getUser, updateProfile, deleteUser, logout,getUserByMail } from '../controllers/userController.js';
import { uploadImage } from '../middlewares/multer.js';
import { logInValidation, registerValidation } from '../middlewares/authValidationregister.js';
import { isAuthenticated, isAdmin} from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/user',isAuthenticated, getUser);
router.get('/userMail',isAuthenticated, getUserByMail);
router.delete('/:id',isAuthenticated, isAdmin, deleteUser);
router.get('/', isAuthenticated, isAdmin, getUsers);
router.put('/:id/profile', uploadImage.single("image"), isAuthenticated ,updateProfile);
router.post('/signup',uploadImage.single("image"), registerValidation,register);
router.post("/login", logInValidation, login);
router.post("/logout",logout)

export default router;