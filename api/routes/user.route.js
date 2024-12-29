import express from 'express';
import { getUser, loadLayout, login, logout, saveLayout, verifyOtp } from '../controllers/user.conttroller.js';
import { authMiddlware } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/sendEmail',login);
router.get('/getUser',authMiddlware,getUser);
router.post('/verifyEmail',verifyOtp);
router.post('/logout',logout);
router.post("/save-layout",authMiddlware, saveLayout);
router.get("/load-layout",authMiddlware, loadLayout); 
export default router;