import { Request, Response } from "express";
import { Role, User } from "../entities/User";
import { validationResult } from "express-validator";
import { login, signup } from "../services/auth";
import { Server } from "socket.io";
import jwt from 'jsonwebtoken'
import http from 'http'
import { googleOAuth2Client } from "../config/google-oauth";
import { google } from "googleapis";
import { userRepo } from "./products";
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

export async function googleAuthController(req : Request , resp : Response){
    try {
        const authorizationUrl = 
        googleOAuth2Client.generateAuthUrl({
            access_type : 'online',
            scope : [
                'openid',
                'email',
                'profile'
            ],
            include_granted_scopes : true
        });
    
        resp.redirect(authorizationUrl);
        
    } catch (error) {
        resp.status(500).send({
            message: 'Something went wrong while logging in with google.'
        })
        
    }
}


export async function googleAuthCallbackController(req : Request , res : Response){
    try{
        const code = req.query.code;

        if (typeof code !== 'string'){
            return res.status(400).json({
                message : 'authorization code missing.'
            })
        }
        const {tokens} = await googleOAuth2Client.getToken(code);
        googleOAuth2Client.setCredentials(tokens);
        // Continue here...

        const oauth2 = google.oauth2({
            version:'v2',
            auth: googleOAuth2Client
        })


        const {data} = await oauth2.userinfo.get();
        console.log('data' , data);
        if(!data.id || !data.email){
            return res.status(400).json({
                message : 'Google account information unavailable.'
            })
        }
        let user;

        try{
            console.log( "thid is dataid" , data.id)
            user = await userRepo.findOne({
               where : {
                   googleId : data.id
               }
           });

        }catch(e){
            return res.send({
                message : 'user not found by data.id'
            })

        }
        
        if(!user){
            console.log('was not already existing so creating it' );
            user = userRepo.create({
                name : data.name ?? 'Google User',
                email : data.email,
                password : null,
                googleId: data.id,
                role  : Role.USER
            })
            await userRepo.save(user);
        }

        console.log( "the user before creating its jwt token" , user)

        const JWT_SECRET = process.env.JWT_SECRET!;
        const token = jwt.sign({
            id: user.id,
            role : user.role
        } , JWT_SECRET , {
            expiresIn : '15h'
        })


        res.cookie('token' , token , {
            httpOnly: true,
        }).json({
            message : 'Gogle login successful',
            user : {
                id:user.id,
                name : user.name,
                email : user.email,
                role : user.role
            }
        })
    }catch(e){
        return res.status(500).json({
            message: "Google authentication failed."
        })
    }
}