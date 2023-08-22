import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";


const app = express();

dotenv.config();

connectDB();

app.get("/", (req, res) => {
    res.send("API is running...");
})

app.use(express.json());  // to accept json data


app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;



app.listen(PORT, console.log(`Server started on PORT ${PORT}`));