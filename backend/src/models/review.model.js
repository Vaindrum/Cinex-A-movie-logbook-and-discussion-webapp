import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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
        review:{
            type: String,
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

const Review = mongoose.model("Review",reviewSchema);

export default Review;