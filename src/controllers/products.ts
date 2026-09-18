import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product, Status } from "../entities/Product";
import { User } from "../entities/User";
import auctionQueue from "../queues/auctionQueue";
export const userRepo = AppDataSource.getRepository(User);

export const product = AppDataSource.getRepository(Product);
export async function createProductController(req :Request , res : Response){

    try{
        const user = req.user!;
        console.log('userrr' , user);
        const {title , description , imageUrls , startingPrice , current_highest , startTime , endTime  } = req.body
    
        const newUser = await userRepo.findOneBy({
            id : user.id
        })
        if(!newUser){
            return res.status(403).json({
                message : 'Could not find the User. Try to login again!'
            })
        }
        const prod  = product.create({
            title : title , 
            description  : description, 
            imageUrls  : imageUrls, 
            startingPrice  : startingPrice, 
            current_highest : current_highest , 
            status : Status.PENDING, 
            startTime  : startTime, 
            endTime  : endTime, 
            userId : newUser
        })
        console.log("new product",prod);
        const newProduct = await product.save(prod);
        

        return res.status(201).json({
            product : newProduct,
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

        const FoundUser = await userRepo.findOneBy({id:user.id});
        if(!FoundUser){
            throw new Error('User not found please login again!');
        }
        const prod = await product.findOneBy({id:id});
        
        if(!prod){
            return res.status(404).json({
                message : 'Product not fount for id' + id
            })
        }


        prod.approvedBy =  FoundUser;
        prod.status = Status.LISTED;

        const savedProduct = await product.save(prod);
        if(!savedProduct){
            return res.status(403).json({
                message : 'Something went wrong while approving the product.',
                product : null
            })
        }
        console.log("delay start ", savedProduct.startTime.getTime() - Date.now(), savedProduct.startTime.toISOString(), new Date().toISOString())
        console.log("delay end", savedProduct.endTime.getTime() - Date.now())

        await auctionQueue.add('auction-start' , {
            id : savedProduct.id
        },{
            delay : savedProduct.startTime.getTime() - Date.now()
        })

        await auctionQueue.add('auction-end' , {
            id : savedProduct.id
        },{
            delay : savedProduct.endTime.getTime() - Date.now()
        })
        return res.status(201).json({
            message : 'Product approved Successfully!!',
            product : savedProduct
        })

    }catch(e){
        res.status(500).json({
            message :'Internal Server Error!'
        })
        
    }
}