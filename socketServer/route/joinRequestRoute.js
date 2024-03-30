import { joinRoomRequest } from "../controller/joinRoomRequest.js";
import express from "express";
const router = express.Router();
router.post("/", joinRoomRequest);
export default router;
