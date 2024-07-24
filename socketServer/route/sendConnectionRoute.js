import express from "express";
import {
  sendConnectionController,
  receiveConnectionController,
  removeConnectionController
} from "../controller/sendConnectionController.js";

const router = express.Router();

//ROUTER
router.post("/receive", receiveConnectionController);
router.post("/:senderconnections", sendConnectionController);
router.post("/unsendconnection/:senderId",removeConnectionController);

export default router;
