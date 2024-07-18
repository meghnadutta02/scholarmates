import ActiveUsers from "../activeUser.js";
export async function checkUserStatus(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "Invalid user socket ID",
      });
    }

    const isActive = ActiveUsers.getActiveUsers().has(userId);

    res.status(200).send({
      isActive,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
}
