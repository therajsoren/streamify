import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const protectRoute = async (req ,res, next) => {
    try {
        const token = req.cookies.jwt // typeof cookies is object
        if(!token){
            return res.status(401).json({
                message: "Unauthorized - No token provided"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // typeof decoded is object 
        if(!decoded){
            return res.status(401).json({
                message: "Unauthorized - Invalid token"
            })
        }

        const user = await User.findById(decoded.userId).select("-password"); // exclude the password field from the result
        if(!user){
            return res.status(401).json({
                message: "Unauthorized - User not found"
            })
        }
        req.user = user; // attach user to request object, so we can access it in other middlewares
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware", error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export {protectRoute};