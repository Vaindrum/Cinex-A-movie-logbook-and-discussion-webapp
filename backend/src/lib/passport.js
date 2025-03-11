import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import dotenv from "dotenv";
// import { generateToken } from "./utils.js";

dotenv.config()

passport.use('google',
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
        },
        async (accessToken, refreshToken, profile, done) => {
            try{
                let user = await User.findOne({googleId: profile.id});

                if(!user){
                    user = new User({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        profilePic: profile.photos?.[0]?.value || "",
                    });
                    await user.save();
                }

                done(null, user);
            } catch(error){
                done(error,null);
            }
        }
    )
)

passport.serializeUser((user,done) => {
    done(null,user.id);
})

passport.deserializeUser(async (id,done) => {
    try {
        const user = await User.findById(id);
        done(null,user);
    } catch (error) {
        done(error,null);
    }
})

export default passport;
