import { createClient } from "redis";
import { redis } from "../config/redis";
import { on } from "events";


export async function publishNotification(data : {
    winnerId : string;
    auctionId :string;
    message : string;
    finalPrice : string;
}) {
    await redis.publish(
        'notifications',
        JSON.stringify(data)
    )
    
}

export async function startNotificationSubscriber(
    onNotification : (data : any)=>void
){
    const subscriber = redis.duplicate();

    await subscriber.subscribe('notifications');

    subscriber.on(
        'message',
        (channel , message)=>{
            if(channel !== 'notifications'){
                return;

            }

            const data = JSON.parse(message);
            onNotification(data)
        }
    )
}