import express from 'express';
import { loginUser, registerUser, updateUser } from '../controllers/userController';
import { userOnly } from '../middleware/auth';



const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/updateProfile',userOnly,updateUser)


export default router