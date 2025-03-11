import express from "express"
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import passport from "passport";
import { generateToken } from "../lib/utils.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/google", passport.authenticate("google", {scope: ["profile","email"]}));

router.get("/google/callback", passport.authenticate("google", {failureRedirect: "http://localhost:5173/auth-failed"} ),
(req,res) => {
    if(!req.user){
        return res.status(401).json({message: "Google authentication failed"});
    }

    const token = generateToken(req.user._id, res);
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
    });
    return res.redirect(`http://localhost:5173/auth-success?token=${token}`);
})


router.patch("/update-profile",protectRoute,updateProfile);

//for refresh site check user
router.get("/check",protectRoute,checkAuth);

export default router;