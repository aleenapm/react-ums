import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/users',userRoutes);
app.use('/admin',adminRoutes);

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("Server is Running on Port 5000")
})
