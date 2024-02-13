import express from 'express';
import { register, login, getUsers, getUser, updateProfile, deleteUser, logout,getUserByMail } from '../controllers/userController.js';
import { uploadImage } from '../middlewares/multer.js';
import { logInValidation, registerValidation } from '../middlewares/authValidationregister.js';
import { isAuthenticated, isAuthorizedUser} from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/user',isAuthenticated, getUser);
router.get('/userMail',isAuthenticated, getUserByMail);
router.delete('/:id',isAuthenticated, isAuthorizedUser(['admin']), deleteUser);
router.get('/', isAuthenticated, isAuthorizedUser(['admin']), getUsers);
router.put('/:id/profile', uploadImage.single("image"), isAuthenticated ,updateProfile);
router.post('/signup',uploadImage.single("image"), registerValidation,register);
router.post("/login", logInValidation, login);
router.post("/logout",logout)

export default router;