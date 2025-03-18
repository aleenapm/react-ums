import { Request, Response } from "express";
import Users from "../models/Users";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const jwt_key = 'your_jwt_secret';

interface AuthRequest extends Request{
    user?:{id:string}
}

export const registerUser = async (req:Request,res:Response):Promise<void>=>{
    const {name,email,password,phone,image} = req.body;
    console.log(name,email,password,phone,image);

    try{
        let user = await Users.findOne({email});
        if(user){
            res.status(400).json({message: "User Already Exist"})
            return
        }
        const hashedPassword = await bcrypt.hash(password,10);
        user = new Users({
            name,
            email,
            password:hashedPassword,
            profileImage:image,
            phone
        })
        console.log(user);
        await user.save();
        res.status(201).json({message:"User Registered successfully",user})
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
}

export const loginUser = async(req:Request,res:Response):Promise<void> => {
    const {email,password} = req.body;

    try{
        const user = await Users.findOne({email});
        if(!user){
            res.status(400).json({message: "The user with this email not exist"});
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            res.status(400).json({message:"The password is incorrect"})
            return
        }

        const token = jwt.sign({
            id:user._id,
            role:user.role,
        },
        jwt_key,
        {expiresIn:'1h'}
        )
        res.json({message: "Login Successful", token, user})
    } catch (error) {
        res.status(500).json({messsage: "Server error"})
    }
}

export const updateUser = async (req:AuthRequest, res:Response) => {
    try{
        if(!req.user) {
            res.status(401).json({message:"Unauthorized"});
            return
        }
        const userId = req.user.id;

        const {name,email,phone,profileImage} = req.body;
        const user = await Users.findById(userId);

        if(!user){
            res.status(404).json({message:"User not found"})
            return
        }
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.email = email || user.email;
        user.profileImage = profileImage || user.profileImage

        const updatedUser = await user.save();

        res.json({
            message: "User updated successfully",
            user:updatedUser
        })
    } catch (error) {
        res.status(500).json({message: "Server error", error})
    }
}