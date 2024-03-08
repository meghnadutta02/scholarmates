import express from 'express'
import {sendConnectionController,receiveConnectionController} from '../controller/sendConnectionController.js'
const router=express.Router();


//ROUTER
router.post("/:senderconnections",sendConnectionController);
// router.post("/receive",receiveConnectionController);


export default router;