import Request from "../model/requestModel.js";
import User from "../model/userModel.js";

export const requestNotificationController = async (req, resp) => {
    try {
        const user = req.params.userId;
        console.log("first", user);
        
        if (user) {
            // Find requests directed to the user
            const data = await Request.find({ requestTo: user });
            console.log("data", data);
            
            if (data && data.length > 0) {
                // Extract unique user ids from the requests
                const userIds = [...new Set(data.map(item => item.user))];
                
                // Find user data for the extracted ids
                const userData = await User.find({ _id: { $in: userIds } });
                
                // Construct an object to map user ids to user data for easy access
                const userDataMap = userData.reduce((acc, user) => {
                    acc[user._id] = user;
                    return acc;
                }, {});
                
                // Combine request data with user data
                const requestData = data.map(item => ({
                    requestData: item,
                    userData: userDataMap[item.user]
                }));
                console.log(requestData);
                resp.status(200).send({
                    success: true,
                    message: "Data retrieved successfully",
                    data: requestData
                });
            } else {
                resp.status(404).send({
                    success: false,
                    message: "No data found for the user"
                });
            }
        } else {
            resp.status(400).send({
                success: false,
                message: "Invalid user ID"
            });
        }
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: error.message
        });
    }
};
