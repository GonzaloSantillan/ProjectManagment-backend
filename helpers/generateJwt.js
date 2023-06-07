import jwt from "jsonwebtoken";

const generateJwt = (id) => {
    return ( jwt.sign({id}, process.env.JWTSECRET, { expiresIn:"30d" }) );
}
 
export default generateJwt;