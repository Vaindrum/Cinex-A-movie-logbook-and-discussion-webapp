import User from "../models/user.model.js";

export const verifyUser = async (req,res, next) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username}).select("-password");

        if(!user) return res.status(404).json({message: "User Not Found"});

        req.userId = user._id;
        req.profilePic = user.profilePic;
        req.username = username;
        next();
    } catch (error) {
        console.error("Error in verifyUser middleware:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}