import { Request, Response } from "express";

import { Product } from "../entities/Product";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Bid } from "../entities/Bid";
import { bidCreate } from "../services/bid";
export async function createBid(req :Request , res : Response){
    try{
        
        const prodId = req.params.prodId as string;
        
        const bidPrice = req.body.bidPrice;
        
        
        const user = req.user;
        
        if(!user){
            return res.status(401).json({
                message : 'UnAuthencticated!',
                bid : null
            })
        }

        const result = bidCreate(bidPrice , prodId , user)



        return res.status(201).json({
            message : 'Bid creation successful!',
            bid : result
        })
    }catch(e :unknown){
        res.status(500).json({
            message : e instanceof Error ? e.message : 'Something went wrong'
        })
    }
}