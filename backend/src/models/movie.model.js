import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        movieId:{
            type: String,
            required: true,
            unique: true
        },
        title:{
            type: String,
            required: true
        },
        year:{
            type: Number,
            required: true
        },
        genre:{
            type: [String]
        },
        poster:{
            type: String
        }
    },
    {timestamps:true}
);

const Movie = mongoose.model("Movie",movieSchema);

export default Movie;