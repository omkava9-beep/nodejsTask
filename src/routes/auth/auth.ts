import express, { Router } from 'express';
import { loginController, signupController } from '../../controllers/auth';
import { loginValidations, signupValidations } from '../../validations/signup';


export const AuthRouter = Router();



AuthRouter.post('/signup' , signupValidations,  signupController)

AuthRouter.post('/login' , loginValidations , loginController )
