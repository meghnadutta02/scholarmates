import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
    {
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        requestTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        accepted: {
            type: Boolean,
            default: false
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

const request = mongoose.models.request || mongoose.model("request", requestSchema);

export default request;
