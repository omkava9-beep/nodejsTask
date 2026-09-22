import { NextFunction, Request, Response } from "express";

import jwt from 'jsonwebtoken';
import { Role } from "../entities/User";

export async function authMiddleWare(req : Request , res : Response ,next : NextFunction){
    try{
        const token = req.cookies.token;
    
        console.log(token)
        const JWT_SECRET = process.env.JWT_SECRET!;
    
    
        const payload =  jwt.verify(token , JWT_SECRET ) as {
            id : string ,
            role:string
        };

        console.log('payloaddd' , payload);
        if(!payload){
            throw new Error('Please try logging in again token does not seems to be valid.');
        }
        
        req.user = payload ;

        next();
    }catch(e : any){
        res.status(403).json({
            message : e.message
        })

    }

}

export async function isManager(req : Request , res: Response , next : NextFunction){
    try{
        const user=  req.user!;


        if(!user){
            throw new Error('Unauthenticated!')
        }

        if(user.role !== Role.MANAGER){
            throw new Error('only the manager is authorized for this route. please login with manager account.')
        }

    
        next();

    }catch(e  : unknown){
        return res.status(503).json({
            message: e instanceof Error ? e.message : 'Something Went Wrong!'
        })


    }
}
export async function isAdmin(req : Request , res: Response , next : NextFunction){
    try{
        const user=  req.user!;


        if(!user){
            throw new Error('Unauthenticated!')
        }

        if(user.role !== Role.SUPERADMIN){
            throw new Error('only the manager is authorized for this route. please login with manager account.')
        }

    
        next();

    }catch(e  : unknown){
        return res.status(503).json({
            message: e instanceof Error ? e.message : 'Something Went Wrong!'
        })


    }
}
