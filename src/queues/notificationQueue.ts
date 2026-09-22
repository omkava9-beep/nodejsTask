import { Queue, Worker } from "bullmq";
import { redis } from "../config/redis";
import { publishNotification } from "../sockets/realtime";
import { notificationWoekerHandler } from "../services/worker.handler";

export const notificationQueue = new  Queue('notification' , {
    connection : redis
})

export const notificationWorker = new Worker('notification', async (job)=>{
    if(job.name == 'auction-won'){
       notificationWoekerHandler(job)
    }
} , {
    connection : redis,
    autorun:true
})