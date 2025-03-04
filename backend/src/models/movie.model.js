import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        movieId:{
            type: Number,
            required: true,
            unique: true
        },
        title:{
            type: String,
            required: true
        },
        release_date:{
            type: Date,
        },
        genres:{
            type: [String]
        },
        poster_path:{
            type: String
        }
    },
    {timestamps:true}
);

const Movie = mongoose.model("Movie",movieSchema);

export default Movie;