import express from "express";
import {
  requestNotificationController,
  userRequestsController,
  getAllNotificationController,
  checkIsSeenController,
  DeleteNotificationController
} from "../controller/notificationController.js";
const router = express.Router();

router.get("/:userId", requestNotificationController);
router.get("/requests/:userId/:recipientId", userRequestsController);
router.put("/markaseen/:userId",checkIsSeenController);
router.get("/getnotification/:userId",getAllNotificationController)
router.delete("/remove/:notification_Id",DeleteNotificationController)
export default router;
