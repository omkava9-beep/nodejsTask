import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { createManager } from "../services/user";

export async function createManagerController(req: Request , res : Response){
    try{
        const errors = validationResult(req);
    
        const manager = req.body
        if(!errors.isEmpty()){
            return res.send({
                errors : errors.array()
            })
        }
        const response = await  createManager(manager)

        res.status(201).send({
            message : response.message,
            manager : response.manager,
            success : response.success
        })

    }catch(e){
        console.log('something went wrong while creating manager.')
        console.log(e instanceof Error ? e.message : 'something went wrong' );

        res.status(500).send({
            message : 'something went wrong while creating manager',
            success : false,
            manager : null
        })
    }


}