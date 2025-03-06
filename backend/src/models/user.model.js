import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        bio:{
            type: String,
            default:""
        },
        profilePic: {
            type: String,
            default: "",
        },
        followers:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
        following:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
        favourites: [{
            type: Number,
            ref: "Movie",
            default: [],
        }],
        recent: [{
            type: Number,
            ref: "Movie",
            default: [],
        }]
    },
    {timestamps: true}
    // for member since... / join date
)

const User = mongoose.model("User",userSchema);

export default User;