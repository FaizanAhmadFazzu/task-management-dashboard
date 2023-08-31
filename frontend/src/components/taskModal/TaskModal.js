import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/useContext';
import axios from "axios";
import "./taskModal.css";

const TaskModal = ({ show, handleClose, modalTitle, listTasks, editTask }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priorityLevel, setPriorityLevel] = useState("");
    const [status, setStatus] = useState("");
    // const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { user } = useContext(AuthContext);

    const resetHandler = () => {
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriorityLevel("");
        setStatus("");
    }

    const createTask = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            console.log(title, description, dueDate, priorityLevel, status, "data")
            if (!title || !description || !dueDate || !priorityLevel || !status) return;
            // setLoading(true);
            const { data } = await axios.post("/tasks/create", { title, description, dueDate, priorityLevel, status }, config);
            // setLoading(false);
            listTasks();
            resetHandler();
            handleClose();
        } catch (error) {
            // setLoading(false);
            const message = error.response && error.response.data.message ? error.response.data.message : error.message
            setErrorMessage(message);
        }
    }

    const updateTask = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            if (!title || !description || !dueDate || !priorityLevel || !status) return;
            // setLoading(true);
            const { data } = await axios.put(`/tasks/${editTask._id}`, { title, description, dueDate, priorityLevel, status }, config);
            // setLoading(false);
            listTasks();
            resetHandler();
            handleClose();
        } catch (error) {
            // setLoading(false);
            const message = error.response && error.response.data.message ? error.response.data.message : error.message
            setErrorMessage(message);
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (editTask) {
            updateTask();
        } else {
            createTask();
        }
    }

    useEffect(() => {
        if (editTask) {
            const date = new Date(editTask.dueDate.split("T")[0])
            const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            const month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
            const newDate = `${date.getFullYear()}-${month}-${day}`
            setTitle(editTask.title);
            setDescription(editTask.description);
            setDueDate(newDate);
            setPriorityLevel(editTask.priorityLevel);
            setStatus(editTask.status);
        } else {
            resetHandler();
        }
    }, [editTask])


    return (
        show ? <div className='taskModal'>
            <h2 className='modalTitle'>{modalTitle}</h2>
            <label for="title">Title</label>
            <input
                type="text"
                id="title"
                value={title}
                className="modalInput"
                placeholder="Enter the title"
                onChange={(e) => setTitle(e.target.value)}
            />
            <label for="desc">Description</label>
            <textarea
                id="desc"
                rows="4"
                value={description}
                className="modalInput"
                placeholder='Enter the description'
                onChange={(e) => setDescription(e.target.value)}
            />
            <label for="date">Due Date</label>
            <input
                id="date"
                type="date"
                value={dueDate}
                className="modalInput"
                onChange={(e) => setDueDate(e.target.value)}
            />
            <label for="priorityLevel">Priority Level</label>
            <select id="priorityLevel" className="modalInput" onChange={(e) => setPriorityLevel(e.target.value)}>
                <option value=""></option>
                <option value={1}>One</option>
                <option value={2}>Two</option>
                <option value={3}>Three</option>
            </select>
            <label for="status">Status</label>
            <select id="status" className="modalInput" onChange={(e) => setStatus(e.target.value)}>
                <option value=""></option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
            <div className='submitBtnContainer'>
                <button className='submitBtn' onClick={submitHandler}>Save</button>
            </div>
            <span className='close' onClick={handleClose}>X</span>
        </div> : null
    )
}

export default TaskModal