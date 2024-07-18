import express from "express";
import { checkUserStatus } from "../controller/userStatus.js";
const router = express.Router();

router.get("/:userId", checkUserStatus);

export default router;
