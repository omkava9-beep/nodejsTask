import { Job } from "bullmq";
import { product } from "../controllers";
import { notificationQueue } from "../queues/notificationQueue";
import { publishNotification } from "../sockets/realtime";


export const auctionStartHandler = async(jobId : string)=>{
        const prod = await product.findOneBy({id : jobId});
        
        
        console.log('the auction of the product : - ' + prod?.id + 'is Started....') ;
}

export const auctionEndHandler = async(jobId : string)=>{
        const prod = await product.findOne({
                where :  {
                id: jobId,
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


export const notificationWoekerHandler = async(jobData : Job )=>{
        const {winnerId , creatorId , finalPrice , message , productId} = jobData.data;

        console.log(`Creaing notification for user ${winnerId}`);


        await publishNotification({
                winnerId : winnerId ,
                auctionId : productId,
                message: message,
                finalPrice : finalPrice
        })

        console.log('notification sent to the winner ' , winnerId);
                
}