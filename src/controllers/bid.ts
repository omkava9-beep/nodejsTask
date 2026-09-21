import { Request, Response } from "express";

import { Product } from "../entities/Product";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Bid } from "../entities/Bid";




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
        
        const result = await AppDataSource.transaction(
            async (manager)=>{
                const productRepo = manager.getRepository(Product);
                const userRepo = manager.getRepository(User);
                const bidRepo = manager.getRepository(Bid);
                
                const product =await  productRepo.createQueryBuilder('product')
                                .setLock('pessimistic_write').where('product.id = :id', {
                                    id : prodId
                                }).getOne();

                const foundUser = await userRepo.findOneBy({
                    id:user.id
                })
                if(!product || !foundUser){
                    throw new Error(
                        'Invalid product ID or user ID'
                    );
                }

                if(
                    new Date(product.startTime).getTime() > Date.now()
                ){
                    throw new Error(
                        'The product bid has not started yet.'
                    );
                }

                if(
                    new Date(product.endTime).getTime() < Date.now()
                ){
                    throw new Error(
                        'The product bid is finished.'
                    );
                }
                
                if(bidPrice <= product.current_highest){
                    throw new Error(`The bid must be higher that ${product.current_highest}`);
                }
                product.current_highest = bidPrice;
                product.currentWinnerId = foundUser;
        
                await productRepo.save(product);
        
                const bid = bidRepo.create({
                    bidPrice : bidPrice,
                    product : product,
                    user : foundUser
                })
            
                const newBid = await bidRepo.save(bid);
                
                return newBid;
            }
        )
    
        // const product = await  productRepo.findOneBy({
        //     id:prodId
        // })
    
        // const FoundUser = await userRepo.findOneBy({
        //     id:user.id
        // })
    
        // if(!product || !FoundUser){
        //     return res.status(403).json({
        //         message : 'invalid productid or userid',
        //         bid : null
        //     })
        // }

        // //time duration should be checked
        // if(new Date(product.startTime).getTime() > Date.now()){
        //     return res.status(404).json({
        //         message: 'The Product bid has not started yet.'
        //     })
        // }
        // if(new Date(product.endTime).getTime() < Date.now() ){
        //     return res.status(404).json({
        //         message: 'The product bid is finished.'
        //     })
        // }
        // if(bidPrice <= product.current_highest){
        //     return res.status(400).json({
        //         message : 'The bid price must be higher than the current highest bid.'
        //     })
        // }


        // console.log('the bid price :-' + bidPrice);

        // console.log('the found username :-' , FoundUser.name);



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