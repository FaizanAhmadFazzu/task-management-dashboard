import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import connectDB from "./config/db.js";
import mongoose from "mongoose";


const app = express();

dotenv.config();

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started on PORT ${PORT}`)
}
);



app.get("/", (req, res) => {
    res.send("API is running...");
})

app.use(express.json());  // to accept json data


app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);





