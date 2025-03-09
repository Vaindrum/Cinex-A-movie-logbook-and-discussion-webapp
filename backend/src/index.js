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
const allowedOrigins = [process.env.ORIGIN, "http://localhost:5173"];

app.use(express.json());
app.use(cookieParser());

// ✅ Apply CORS properly
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Fix: Ensure every response includes CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// ✅ Handle Preflight Requests (OPTIONS)
app.options("*", cors());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/actions", actionRoutes);
app.use("/api/page", pageRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Backend working" });
});

app.listen(PORT, () => {
  console.log("server is running on port PORT: " + PORT);
  connectDB();
  testTMDB();
});
