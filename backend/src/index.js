import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import movieRoutes from "./routes/movie.route.js";
import actionRoutes from "./routes/actions.route.js";
import pageRoutes from "./routes/page.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import { testTMDB } from "./lib/tmdb.js";
import cors from "cors";

import passport from "passport";
import session from "express-session";
import "./lib/passport.js"; 

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json({limit: '50mb'}));
 
 app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(express.json()); 
app.use(cookieParser());

// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
//   }));

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}))

const corsOptions = {
    origin: process.env.ORIGIN, 
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, 
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/actions", actionRoutes);
app.use("/api/page", pageRoutes);


app.all("*",(req,res) => {
    res.status(404).json({message: "Backend working"});
});

app.listen(PORT, ()=>{
    console.log("server is running on port PORT: " + PORT);
    connectDB();
    testTMDB();
})