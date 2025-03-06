import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const {username,email,password} = req.body;
    try {
        if(!username || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 8){
            return res.status(400).json({message: "Password must be at least 8 characters"});
        }

        const existingMail = await User.findOne({email})
        if (existingMail) return res.status(400).json({message: "An account with this email already exists"});

        const existingName = await User.findOne({username})
        if (existingName) return res.status(400).json({message: "This username is already taken"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        if(newUser){
            await newUser.save();
            generateToken(newUser._id,res);

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
                bio: newUser.bio,
                joinedOn: newUser.createdAt
            });
        } else{
            res.status(400).json({message:"Invalid user data"});
        }
    } catch (error) {
        console.error("Error in signup controller", error.message); 
        res.status(500).json({message: "Internal Server Error1"});      
    }
};

export const login = async (req, res) => {
    const {username,password} = req.body;
    try {
        const user = await User.findOne({username});

        if(!user){
            return res.status(400).json({message:"Invalid Username"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Password"});
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePic:user.profilePic,
            bio:user.bio,
            joinedOn:user.createdAt,
            followers:user.followers,
            following:user.following
        });
    } catch (error) {
        console.error("Error in login controller", error.message);
        res.status(500).json({message:"Internal Server Error2"});
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.error("Error in logout controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const updateProfile = async (req,res) => {
    try {
        const {profilePic, username, email, bio, favourites} = req.body;
        const userId = req.user._id;

        if(!profilePic && !username && !email && !bio && !favourites){
            return res.status(400).json({message:"Nothing given to update"});
        }

        let updateData = {};

        if(profilePic){   
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            updateData.profilePic = uploadResponse.secure_url;
        }

        if(username){
            const existingUser = await User.findOne({username});
            if(existingUser && existingUser._id.toString() !== userId.toString()){
                return res.status(400).json({message: "This username is already taken"});
            }
            updateData.username = username;
        }

        if(email){
            const existingUser = await User.findOne({email});
            if(existingUser && existingUser._id.toString() !== userId.toString()){
                return res.status(400).json({message: "An account with this email already exists"});
            }
            updateData.email = email;
        }

        if(bio !== undefined){
            updateData.bio = bio;
        }

        if(favourites){
            if(!Array.isArray(favourites) || favourites.length > 4){
                return res.status(400).json({message: "Favourites must be an array of up to 4 movies"});
            }
            updateData.favourites = favourites;
        }


        const updatedUser = await User.findByIdAndUpdate(userId,updateData,{new:true});
        
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error in updated profile:",error);
        res.status(500).json({message:"Internal Server Error3"});
    }
};

export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller:",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}