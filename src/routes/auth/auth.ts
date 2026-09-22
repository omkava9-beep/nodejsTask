import express, { Router } from 'express';
import { googleAuthCallbackController, googleAuthController, loginController, signupController } from '../../controllers';
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


AuthRouter.get('/google' , googleAuthController)


AuthRouter.get('/google/callback' , googleAuthCallbackController)