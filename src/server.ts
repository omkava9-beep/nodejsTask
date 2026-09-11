import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';




const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

AppDataSource.initialize()
.then(()=>{
    console.log('Database connected!!');

    app.listen(port , ()=>{
        console.log('listening to port '+ process.env.PORT);
    });

}).catch((e)=>{
    console.log(e);
})


