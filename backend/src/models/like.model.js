import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        movieId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
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

const Like = mongoose.model("Like",likeSchema);

export default Like;