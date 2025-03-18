import express from 'express';
import { adminOnly } from '../middleware/auth';
import { getUsers, loginAdmin, createUser, updateUsers, deleteUser } from '../controllers/adminController';
const router = express.Router();

router.post('/login',loginAdmin);
router.get('/getUsers',adminOnly,getUsers);
router.post('/createUser',createUser);
router.put('/updateUser/:id',adminOnly,updateUsers);
router.delete('/deleteUser/:id',adminOnly,deleteUser);

export default router