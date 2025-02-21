import mongoose from "mongoose";

const watchedSchema = new mongoose.Schema(
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
        }
    },
    {timestamps: true}
);

const Watched = mongoose.model("Watched",watchedSchema);

export default Watched;