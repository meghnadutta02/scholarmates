import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sendername: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    },
    status: {
        type: String,
        // required: true
    },
    friendRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Request"
    },
    discussionId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Discussion"
    },
    message: {
        type: String,
        // required: true
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        required: true
    }


}, {
    timestamps: true
});

// TRIGGER ON EVERY FIND EVENT AND CHECK DELETE OLDER THAN 4 DAYS

notificationSchema.pre('find', async function (next) {
    const cutoffTime = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000); //4 days
    try {
        await this.model.deleteMany({ timestamp: { $lt: cutoffTime } });
        console.log('Old notifications deleted on find operation.');
    } catch (error) {
        console.error('Error deleting old notifications during find:', error);
    }
    next();
});

const Notification = mongoose.models.notification || mongoose.model("AllNotification", notificationSchema);
export default Notification;
