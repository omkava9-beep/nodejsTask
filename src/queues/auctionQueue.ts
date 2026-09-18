import { Queue  , Worker} from "bullmq";
import { redis } from "../config/redis";
import { product } from "../controllers/products";
import { notificationQueue } from "./notificationQueue";


export const auctionQueue = new Queue('auction' , {
    connection : redis
})


const worker = new Worker('auction' , async (job)=>{
    if(job.name == 'auction-start'){
        const prod = await product.findOneBy({id : job.data.id});
        
        
        console.log('the auction of the product : - ' + prod?.id + 'is Started....') ;
    }
    
    if(job.name == 'auction-end'){
        const prod = await product.findOne({
            where :  {
                id: job.data.id,
            } ,
            relations : {
                userId : true,
                currentWinnerId : true
            }
        });
        console.log("auction ended")
        console.dir(prod, {depth:null})
       

        if(!prod){
            console.log('product not found');
            return;
        }
        const winner= prod.currentWinnerId;

        const creator= prod.userId;
        if(!creator ){
            console.log('no creator recieved for this product.');
            return;
        }

        console.log(`The creator is ${creator}` )
        if(!winner){
            notificationQueue.add('auction-empty' , {
                creatorId : creator.id,
                message : 'No user created bid on your product auction.'
            })
        }

        notificationQueue.add('auction-won' , {
            winnerId : winner?.id,
            productId :  prod.id,
            creatorId : creator.id,
            finalPrice : prod.current_highest,
            message: 'Congratulations! you won the auction!'
        })
        console.log(`The winner of this auction is  is ${winner?.name}` );
    }
} , {
    connection : redis,
});

export default auctionQueue;