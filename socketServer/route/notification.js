import express from 'express';
import {requestNotificationController} from '../controller/notificationController.js'
const router=express.Router();

router.get('/:userId',requestNotificationController)

export default router;
