import Group from "../model/groupModel.js";

import { io } from "../server.js";
import Discussion from "../model/discussionModel.js";

export async function joinRoomRequest(req, resp) {
  try {
    const { discussionId, userId } = req.body;

    const discussion = await Discussion.findById(discussionId);
    const groupId = discussion.groupId;

    const group = await Group.findById(groupId).select("moderators");

    if (!group || !group.moderators) {
      return resp.status(404).json({ error: "Group or moderators not found" });
    }

    group.moderators.forEach((moderator) => {
      io.to(moderator).emit("joinRequest", { groupId, userId });
    });

    resp.status(200).json({ message: "Join request sent successfully" });
  } catch (error) {
    console.error("Error sending join request:", error);
    resp.status(500).json({ error: "Internal server error" });
  }
}
