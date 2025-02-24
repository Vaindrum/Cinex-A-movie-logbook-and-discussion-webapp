import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
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
        rating:{
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        logId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Log",
            default: null
        }
    },
    {timestamps: true}
);

const Rating = mongoose.model("Rating",ratingSchema);

export default Rating;