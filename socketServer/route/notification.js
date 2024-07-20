import express from "express";
import {
  requestNotificationController,
  userRequestsController,
  getAllNotificationController,
  checkIsSeenController,
  DeleteNotificationController,
  deleteBatchNotificationController,
} from "../controller/notificationController.js";
const router = express.Router();

router.get("/:userId", requestNotificationController);
router.get("/requests/:userId/:recipientId", userRequestsController);
router.put("/mark-as-seen/:userId", checkIsSeenController);
router.get("/get-notification/:userId", getAllNotificationController);
router.delete("/remove/:notification_Id", DeleteNotificationController);
router.delete(
  "/delete-notifications/:userId",
  deleteBatchNotificationController
);
export default router;
