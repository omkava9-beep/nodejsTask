import { Queue  , Worker} from "bullmq";
import { redis } from "../config/redis";
import { product } from "../controllers/products";
import { notificationQueue } from "./notificationQueue";
import { auctionEndHandler, auctionStartHandler } from "../services/worker.handler";


export const auctionQueue = new Queue('auction' , {
    connection : redis
})


export const worker = new Worker('auction' , async (job)=>{
    if(job.name == 'auction-start'){
       auctionStartHandler(job.data.id);
    }
    
    if(job.name == 'auction-end'){
        auctionEndHandler(job.data.id);
    }
} , {
    connection : redis,
    autorun: false
});


export default auctionQueue;