import express, { Router } from 'express';
import { approveProductController, createProductController, createBid } from '../../controllers';
import { authMiddleWare, isManager } from '../../middleware/middleware';


export const productsRouter = Router();


productsRouter.post('/create' , authMiddleWare, createProductController )

productsRouter.post('/createBid/:prodId' , authMiddleWare , createBid )

productsRouter.put('/accept/:id' , authMiddleWare , isManager , approveProductController )
