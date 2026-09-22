import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";

import { User } from "../entities/User";
import auctionQueue from "../queues/auctionQueue";

import { Product, Status } from "../entities/Product";
import { approveProductService, createProductService } from "../services/product";
export const userRepo = AppDataSource.getRepository(User);
export const product = AppDataSource.getRepository(Product);
export async function createProductController(req :Request , res : Response){

    try{
        const user = req.user!;
        console.log('userrr' , user);
        const data = req.body;
        const response = await createProductService(user , data);

        return res.status(201).json({
            product :  response.newProduct,
            message : 'product created successfully!'
        })
    }catch(e : unknown){
        res.status(500).json({
            product: null,
            message : e instanceof Error ? e.message :'Something went wrong while creting product.'
        })
    }
}

export async function approveProductController(req : Request , res: Response){
    try{
        const id = req.params.id as string;
        const user = req.user;
        if(!user){
            throw new Error('user not found in the request.')
        }
        const resp = await approveProductService(user , id )
        if(!resp.savedProduct){
            return res.send(501).json({
                message : resp.message
            })
        }
        await auctionQueue.add('auction-start' , {
            id : resp.savedProduct.id
        },{
            delay : resp.savedProduct.startTime.getTime() - Date.now()
        })

        await auctionQueue.add('auction-end' , {
            id : resp.savedProduct.id
        },{
            delay : resp.savedProduct.endTime.getTime() - Date.now()
        })
        return res.status(201).json({
            message : 'Product approved Successfully!!',
            product : resp.savedProduct
        })

    }catch(e){
        res.status(500).json({
            message :'Internal Server Error!'
        })
        
    }
}