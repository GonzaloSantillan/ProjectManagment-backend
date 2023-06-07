import jwt from "jsonwebtoken";
import User from "../models/User.js";

const checkAuth = async (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            const token= req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.JWTSECRET);
            req.user = await User.findById(decodedToken.id).select("id name email");
            return next();
        } catch (error) {
            return res.status(400).json({msg:'There is a fail: '+ error.message});
        }
    } else{
        return res.status(401).json({msg:'Invalid token in checkAuth!'});
    }
}
 
export default checkAuth;