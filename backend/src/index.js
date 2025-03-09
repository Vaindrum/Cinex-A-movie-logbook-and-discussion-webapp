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

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: process.env.ORIGIN, // Allow only your frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));

// If using custom headers, explicitly allow preflight requests
app.options("*", cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/actions", actionRoutes);
app.use("/api/page", pageRoutes);


app.all("*", (req, res) => {
    res.status(404).json({ message: "Route Not Found" });
});

app.listen(PORT, () => {
    console.log("server is running on port PORT: " + PORT);
    connectDB();
    testTMDB();
})