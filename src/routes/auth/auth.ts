import express, { Router } from 'express';
import { loginController, signupController } from '../../controllers/auth';
import { loginValidations, signupValidations } from '../../validations/signup';
import { googleOAuth2Client } from '../../config/google-oauth';
import { error } from 'console';
import { google } from 'googleapis';
import { AppDataSource } from '../../config/data-source';
import { Role, User } from '../../entities/User';
import jwt from 'jsonwebtoken';
import { userRepo } from '../../controllers/products';


export const AuthRouter = Router();



AuthRouter.post('/signup' , signupValidations,  signupController)

AuthRouter.post('/login' , loginValidations , loginController )


AuthRouter.get('/google' , (req , res)=>{

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

    res.send(authorizationUrl);

})


AuthRouter.get('/google/callback' , async (req , res)=>{
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
})