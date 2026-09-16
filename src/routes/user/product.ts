import express, { Router } from 'express';
import { approveProductController, createProductController } from '../../controllers/products';
import { authMiddleWare, isManager, isUser } from '../../middleware/middleware';
import { createBid } from '../../controllers/bid';


export const productsRouter = Router();


productsRouter.post('/create' , authMiddleWare, isUser , createProductController )

productsRouter.post('/createBid/:prodId' , authMiddleWare , isUser , createBid )

productsRouter.put('/accept/:id' , authMiddleWare , isManager , approveProductController )
