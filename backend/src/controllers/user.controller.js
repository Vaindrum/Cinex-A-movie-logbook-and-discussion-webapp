import User from "../models/user.model.js";

export const followUser = async (req,res) => {
    try {
        const userId = req.user.id; // Authenticated user
        const targetUserId = req.params.id; // User to follow

        if (userId === targetUserId) {
            return res.status(400).json({ message: "You cannot follow yourself." });
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.following.includes(targetUserId)) {
            return res.status(400).json({ message: "Already following this user." });
        }

        user.following.push(targetUserId);
        targetUser.followers.push(userId);

        await user.save();
        await targetUser.save();

        console.log(`User ${userId} followed User ${targetUserId}`);
        res.status(200).json({ message: "User followed successfully." });

    } catch (error) {
        console.error("Error in followUser controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const unfollowUser = async (req,res) => {
    try {
        const userId = req.user._id;
        const targetUserId = req.params.id;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if(!targetUser){
            return res.status(404).json({message: "User not found"});
        }

        if(!user.following.includes(targetUserId)){
            return res.status(400).json({message: "Not following this user"});
        }

        user.following = user.following.filter(id => id.toString()!==targetUserId.toString());
        targetUser.followers = targetUser.followers.filter(id => id.toString()!==userId.toString());

        await user.save();
        await targetUser.save();

        console.log(`User ${userId} successfully unfollowed user ${targetUserId}`);
        res.status(200).json({message: "Unfollowed successfully"});
        
    } catch (error) {
        console.error("Error in unfollowUser controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getUserProfile = async (req,res) => {
    try {
        
        // const {userId} = req.params;
        const user = await User.findById(req.userId).select("-password");
        
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        await user.populate("followers","username");
        await user.populate("following","username");
        
        console.log(`Fetched profile for user: ${req.userId}`);
        res.status(200).json(user);

    } catch (error) {
        console.error("Error in getUserProfile controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}