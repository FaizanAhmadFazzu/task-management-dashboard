import express from "express";
import { createTask, deleteTask, getSingleTask, getTasks, UpdateTask } from "../controllers/taskController.js";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getTasks);

router.route("/:id")
    .get(protect, getSingleTask)
    .put(protect, UpdateTask)
    .delete(verifyAdmin, deleteTask)


router.route("/create").post(protect, createTask);

export default router;