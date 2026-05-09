import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { users } from '../db/schema.js';
dotenv.config()

export const  accessToken= (id: string) =>{
    const JWT = process.env.JWT_SECRET!
    
    return jwt.sign({id:users.id, role:users.role }, JWT, {expiresIn: '1h'})
}