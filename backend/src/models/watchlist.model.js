import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
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

const Watchlist = mongoose.model("Watchlist",watchlistSchema);

export default Watchlist;