import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req: any, res: any, next: any) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, unauthorized " });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

export const authorize = (...roles:string[]) =>{
    return (req:any,res:any, next:any) =>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({ message: 'Forbidden'})
        }
        next()
    }
}