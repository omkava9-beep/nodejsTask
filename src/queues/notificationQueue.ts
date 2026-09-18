import { Queue, Worker } from "bullmq";
import { redis } from "../config/redis";
import { publishNotification } from "../sockets/realtime";

export const notificationQueue = new  Queue('notification' , {
    connection : redis
})

const notificationWorker = new Worker('notification', async (job)=>{
    if(job.name == 'auction-won'){
        const {winnerId , creatorId , finalPrice , message , productId} = job.data;

        console.log(`Creaing notification for user ${winnerId}`);


        await publishNotification({
            winnerId : winnerId ,
            auctionId : productId,
            message: message,
            finalPrice : finalPrice
        })
        
        console.log('notification sent to the winner ' , winnerId);
        

    }
    if(job.name === 'auction-empty'){
        
    }
} , {
    connection : redis
})