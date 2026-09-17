import { error } from 'console';
import IORedis from 'ioredis';

export const redis = new IORedis({
    port : 6379,
    host: 'localhost',
    maxRetriesPerRequest : null
})


redis.on('connect',()=>{
    console.log('successfully connected to Redis!');

})

redis.on('error',(err)=>{
    console.log('Redis connection error:' , err);
})


