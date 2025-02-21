import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        releaseYear:{
            type: Number,
            required: true
        },
        genre:[{
            type: String
        }],
        director:{
            type: String
        },
        actors:[{
            type: String
        }],
        posterUrl:{
            type: String
        },
        plot:{
            type: String
        },
        imdbRating:{
            type: Number
        }
    },
    {timestamps:true}
);

const Movie = mongoose.model("Movie",movieSchema);

export default Movie;