import mongoose from "mongoose";

// I created this model coz i thought we would be calling tmdb api and then storing the result here
// Now it seems that we can directly and dynamically use fetchfromtmdbapi for all other user actions like rating,reveiws,logs etc
// So this movie model schema is not really required and is not used anywhere in the code
// I was thinking if i should delete this since it has no use but its not causing any harm right now so i'll keep it for now
// might delete in future before deployment i think

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