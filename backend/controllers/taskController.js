import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";



// @description               Create Single Task
// @route                     POST /api/tasks/create
// @access                    Private

export const createTask = asyncHandler(async (req, res) => {
    const { title, description, dueDate, priorityLevel, status } = req.body;

    if (!title || !description || !dueDate || !priorityLevel || !status) {
        throw new Error("Please Fill all the fields.")
        return;
    } else {
        const createdTask = await Task.create({ user: req.user._id, title, description, dueDate, priorityLevel, status });
        if (createdTask) {
            res.status(201).json(createdTask);
        }
    }
});

// @description               Get Tasks
// @route                     POST /api/tasks/
// @access                    Private

export const getTasks = asyncHandler(async (req, res) => {
    const { priorityLevel, status } = req.query;
    let tasks;
    if (req.user.isAdmin) {
        if (priorityLevel && status) {
            tasks = await Task.find({
                priorityLevel: priorityLevel,
                status: status
            }).sort("-createdAt").populate("user", "name");
        } else if (priorityLevel && !status) {
            tasks = await Task.find({
                priorityLevel: priorityLevel,
            }).sort("-createdAt").populate("user", "name");
        } else if (status && !priorityLevel) {
            tasks = await Task.find({
                status: status,
            }).sort("-createdAt").populate("user", "name");
        } else {
            tasks = await Task.find({}).sort("-createdAt").populate("user", "name");
        }
    } else {
        if (priorityLevel && status) {
            tasks = await Task.find({
                user: req.user._id,
                priorityLevel: priorityLevel,
                status: status
            }).populate("user", "name").sort("-createdAt");
        } else if (priorityLevel && !status) {
            tasks = await Task.find({
                user: req.user._id,
                priorityLevel: priorityLevel,
            }).populate("user", "name").sort("-createdAt");
        } else if (status && !priorityLevel) {
            tasks = await Task.find({
                user: req.user._id,
                status: status,
            }).populate("user", "name").sort("-createdAt");
        } else {
            tasks = await Task.find({ user: req.user._id, }).populate("user", "name").sort("-createdAt");;
        }
    }
    res.json(tasks);
});

// @description               Get Single Task
// @route                     POST /api/tasks/
// @access                    Private

export const getSingleTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
        res.json(task)
    } else {
        res.status(400).json({ message: "Note not found." });
    }
});

// @description               Update Task
// @route                     POST /api/tasks/
// @access                    Private

export const UpdateTask = asyncHandler(async (req, res) => {
    const { title, description, dueDate, priorityLevel, status } = req.body;
    const task = await Task.findById(req.params.id);
    if ((task.user.toString() === req.user._id.toString()) || req.user.isAdmin) {
        if (task) {
            task.title = title;
            task.description = description;
            task.dueDate = dueDate;
            task.priorityLevel = priorityLevel;
            task.status = status
            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({
                message: "Task not found."
            })
        }

    } else {
        res.status(401).json({
            message: "You cant't perform this action."
        });
    }
});


// @description               Delete Task
// @route                     Delete /api/tasks/
// @access                    Private

export const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (req.user.isAdmin && task && (task.status === "Completed")) {
        res.json({ message: "Task has been deleted." })
    } else {
        res.status(400).json({ message: "Task not found." });
    }
});