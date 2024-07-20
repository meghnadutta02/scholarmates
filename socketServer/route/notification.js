import express from "express";
import {
  requestNotificationController,
  userRequestsController,
  getAllNotificationController,
  checkIsSeenController,
  DeleteNotificationController,
} from "../controller/notificationController.js";
const router = express.Router();

router.get("/:userId", requestNotificationController);
router.get("/requests/:userId/:recipientId", userRequestsController);
router.put("/mark-as-seen/:userId", checkIsSeenController);
router.get("/get-notification/:userId", getAllNotificationController);
router.delete("/remove/:notification_Id", DeleteNotificationController);
export default router;
