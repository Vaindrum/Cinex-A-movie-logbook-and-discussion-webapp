import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        movieId:{
            type: Number,
            required: true
        },
        logId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Log",
            default: null
        }
    },
    {timestamps: true}
);

const Likes = mongoose.model("Likes",likeSchema);

export default Likes;