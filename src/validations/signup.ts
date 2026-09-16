import {body} from 'express-validator'

export const signupValidations = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage("Name is required"),


    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is Required.')
    .isEmail()
    .withMessage('Invalid email'),

    body("password")
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min:8})
    .withMessage("password must be at least 8 characters")
]


export const loginValidations = [
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is Required.')
    .isEmail()
    .withMessage('Invalid email'),

    
    body("password")
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min:8})
    .withMessage("password must be at least 8 characters")
]