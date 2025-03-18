import jwt, {JwtPayload} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request{
    user?:{id:string, role:string};
    admin?:{id:string, role:string};
}

const jwt_key = 'your_jwt_secret';

export const userOnly = async (req:AuthRequest,res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if(!token){
        res.status(401).json({message: "No token provided, access denied"});
        return;
    }
    if(!jwt_key){
        res.status(500).json({message: "JWT_SECRET is not configured on the server"})
        return
    }
    try{
        const decoded = jwt.verify(token, jwt_key) as JwtPayload & {id: string; role:string};
        console.log("Decoded Token:", decoded);

        const {id,role} = decoded;

        if(!id || !role){
            res.status(401).json({message: "Invalid token payload"});
            return;
        }
        req.user = {
            id,
            role
        }
        next();
    } catch (error) {
        res.status(401).json({message: "Invalid or expired token"});
    }
}

export const adminOnly = async(req: AuthRequest, res:Response,next:NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        res.status(401).json({message:"No token provided, access denied"});
        return;
    }
    try{
        const decoded = jwt.verify(token,jwt_key) as JwtPayload & {id:string,role:string};
        const {id,role} = decoded;
        if(!id || role !== 'admin'){
            res.status(403).json({message: "Admin access acquired"});
            return;
        }
        req.admin = {
            id,
            role
        }
        next()
    } catch (error) {
        res.status(401).json({message: "Invalid or expired token"})
        return
    }
}