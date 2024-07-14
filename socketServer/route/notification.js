import express from "express";
import {
  requestNotificationController,
  userRequestsController,
} from "../controller/notificationController.js";
const router = express.Router();

router.get("/:userId", requestNotificationController);
router.get("/requests/:userId/:recipientId", userRequestsController);

export default router;
