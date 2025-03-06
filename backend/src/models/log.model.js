import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
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
        watchedOn:{
            type: Date,
            default: Date.now
        },
        rewatch:{
            type: Boolean,
            default: false
        },
        tags:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }]
    },
    {timestamps: true}
);

const Log = mongoose.model("Log",logSchema);

export default Log;