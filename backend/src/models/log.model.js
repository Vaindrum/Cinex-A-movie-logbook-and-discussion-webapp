import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
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
        watchedOn:{
            type: Date,
            default: Date.now
        }
    },
    {timestamps: true}
);

const Log = mongoose.model("Log",logSchema);

export default Log;