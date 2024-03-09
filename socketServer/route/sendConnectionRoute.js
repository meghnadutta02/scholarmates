import express from 'express'
import {sendConnectionController,receiveConnectionController} from '../controller/sendConnectionController.js'
const router=express.Router();


//ROUTER
router.post("/receive",receiveConnectionController);
 router.post("/:senderconnections",sendConnectionController);
 


export default router;