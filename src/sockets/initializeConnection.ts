import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { startNotificationSubscriber } from "./realtime";
import jwt from 'jsonwebtoken';


export const initializeConnection = async (server : HttpServer )=>{

    const io = new Server(server , {
        cors : {
            origin : '*'
        }
    });

    io.use((socket , next)=>{
        try {
            const authHEader = socket.handshake.headers.authorization;
    
    
            console.log("autheHeader:-- " , authHEader);
            if(!authHEader){
                return next(new Error('Authorization header missing!!'));
    
            }
            const [schema , token] = authHEader.split(' ');
            if(schema !== 'Bearer' || !token){
                return next(new Error('Invalid authorization header'));
            }
            const decoded =  jwt.verify(token , process.env.JWT_SECRET!) as {
                id : string
            };
    
            socket.data.userId = decoded.id;
            
            console.log('done socket middleware....');

            next();
        } catch (error) {
            next(new Error('UnAuthorized!!!'));
        }
    })

    // const pubClient = createClient({
    //     url : 'redis://localhost:6379',
    // })

    // const subClient = pubClient.duplicate();
    // await pubClient.connect();
    // await subClient.connect();

    io.on('connection' , (socket)=>{
        console.log('connection done with sockets:-' , socket.id);
        const userId = socket.data.userId;



       console.log('User Connected :-',
            userId,
            'Socket:-',
            socket.id
       );

       socket.join(`user:${userId}`);

       console.log('Joined room user:-' + userId);

        socket.on('disconnect', ()=>{
            console.log('socket disconnected!~' , socket.id);
        })
    })
    startNotificationSubscriber((data)=>{
        console.log('notification received from Redis:',data);

        io.to(`user:${data.winnerId}`).emit('notification' , data)
    })

    return io;

}