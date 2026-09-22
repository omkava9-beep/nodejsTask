
import { AppDataSource } from "../config/data-source";
import { redis } from "../config/redis";
import { Bid } from "../entities/Bid";
import { Product } from "../entities/Product";
import { Role, User } from "../entities/User";
import { createClient } from "redis";

export async function bidCreate(bidPrice : number , 
    prodId : string , user : {
        id : string,
        role : string
    }
){
        
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

        return result
}