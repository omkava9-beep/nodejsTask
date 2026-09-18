import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';
import { signupController } from './controllers/auth';
import { AuthRouter } from './routes/auth/auth';
import cookieParser from 'cookie-parser';
import { productsRouter } from './routes/user/product';
import { Server } from 'socket.io'
import { initializeConnection } from './sockets/initializeConnection';





const app = express();


dotenv.config();




app.use(cookieParser());


const port = process.env.PORT || 3000;

app.use(express.json());


app.use('/auth' , AuthRouter  )
app.use('/products' , productsRouter);

    

await AppDataSource.initialize()
.then(()=>{
    console.log('Database connected!!');

    const server = app.listen(port , ()=>{
        console.log('listening to port '+ process.env.PORT);
    });


    initializeConnection(server);

}).catch((e)=>{
    console.log(e);
})


