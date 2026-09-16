import { Request, Response } from "express";
import { Role, User } from "../entities/User";
import { validationResult } from "express-validator";
import { login, signup } from "../services/auth";


export async function signupController(req : Request,resp : Response ){

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return resp.status(400).json({
            message :errors.array()
        })
    }

    if(!Object.values(Role).includes(role as Role)){
        return resp.status(400).json({
            message: 'Role should be valid'
        })
    }

    const data = await signup(name , email , password, role);

    resp.status(data.status).json({
        message: data.message
    }) 
}

export async function loginController(req  : Request , resp : Response){

    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return resp.status(400).json({
            message :errors.array()
        })
    }
    const data = await login(  email , password);
    if(!data.success){
        return resp.status(data.status).json({
            message : data.message
        })
    }
    const cookie = data.token;
    if(!cookie){
        return resp.status(data.status).json({
            message : 'something went wrong while creaing token'
        })
    }
    resp.cookie('token' , cookie).status(200).json({
        message : data.message
    })    
}

