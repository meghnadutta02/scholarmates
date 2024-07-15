import express from "express";
import {
  requestNotificationController,
  userRequestsController,
} from "../controller/notificationController.js";
const router = express.Router();
// https://alikeminds.onrender.com/notification/requests/666ffbe137af73d403e16934/661ada431f11963a2b1b3cff
router.get("/:userId", requestNotificationController);
router.get("/requests/:userId/:recipientId", userRequestsController);

export default router;
