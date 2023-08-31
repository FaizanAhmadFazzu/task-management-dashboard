import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainScreen from '../../components/mainScreen/MainScreen';
import { AuthContext } from '../../context/useContext';
import "./singleTask.css";

const SingleTask = ({ listTasks }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priorityLevel, setPriorityLevel] = useState("");
    const [status, setStatus] = useState("");
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        dueDate: "",
        priorityLevel: "",
        status: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const { user, tasks } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const resetHandler = () => {
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriorityLevel("");
        setStatus("");
    }

    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (title === '') {
            newErrors.title = 'Title is required.';
            valid = false;
        }

        if (description === "") {
            newErrors.description = 'Description is required.';
            valid = false;
        }

        if (dueDate === "") {
            newErrors.dueDate = 'Due Date is required.';
            valid = false;
        }

        if (priorityLevel === "") {
            newErrors.priorityLevel = 'Priority Level is required.';
            valid = false;
        }

        if (status === "") {
            newErrors.status = 'Status Level is required.';
            valid = false;
        }

        setErrors(newErrors);
        return valid
    }


    const createTask = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            // setLoading(true);
            const { data } = await axios.post("/tasks/create", { title, description, dueDate, priorityLevel, status }, config);
            // setLoading(false);
            listTasks();
            resetHandler();
            navigate("/")
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

            const { data } = await axios.put(`/tasks/${id}`, { title, description, dueDate, priorityLevel, status }, config);
            listTasks();
            resetHandler();
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message
            setErrorMessage(message);
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        // if (!title || !description || !dueDate || !priorityLevel || !status) return;
        if (id) {
            updateTask();
        } else {
            createTask();
        }
        navigate("/");
    }

    useEffect(() => {
        if (id) {
            const task = tasks.find(task => task._id === id);
            const date = new Date(task.dueDate.split("T")[0])
            const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            const month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
            const newDate = `${date.getFullYear()}-${month}-${day}`
            setTitle(task.title);
            setDescription(task.description);
            setDueDate(newDate);
            setPriorityLevel(task.priorityLevel);
            setStatus(task.status);
        }
    }, [id])
    return (
        <MainScreen title={id ? "Update Task" : "Create New Task"}>
            <div className='taskForm'>
                <label for="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    className="formInput"
                    placeholder="Enter the title"
                    onChange={(e) => {
                        setTitle(e.target.value)
                        if (title) setErrors({ ...errors, title: "" })
                    }
                    }
                />
                {errors.title && <p className='error'>{errors.title}</p>}
                <label for="desc">Description</label>
                <textarea
                    id="desc"
                    rows="4"
                    value={description}
                    className="formInput"
                    placeholder='Enter the description'
                    onChange={(e) => {
                        setDescription(e.target.value)
                        if (description) setErrors({ ...errors, description: "" });
                    }}
                />
                {errors.description && <p className='error'>{errors.description}</p>}
                <label for="date">Due Date</label>
                <input
                    id="date"
                    type="date"
                    value={dueDate}
                    className="formInput"
                    onChange={(e) => {
                        setDueDate(e.target.value)
                        if (dueDate) setErrors({ ...errors, dueDate: "" });
                    }}
                />
                {errors.dueDate && <p className='error'>{errors.dueDate}</p>}
                <label for="priorityLevel">Priority Level</label>
                <select id="priorityLevel" className="formInput" value={priorityLevel} onChange={(e) => {
                    setPriorityLevel(e.target.value)
                    if (priorityLevel) setErrors({ ...errors, priorityLevel: "" });
                }}>
                    <option value=""></option>
                    <option value={1}>One</option>
                    <option value={2}>Two</option>
                    <option value={3}>Three</option>
                </select>
                {errors.priorityLevel && <p className='error'>{errors.priorityLevel}</p>}
                <label for="status">Status</label>
                <select id="status" value={status} className="formInput"
                    onChange={(e) => {
                        setStatus(e.target.value);
                        if (status) setErrors({ ...errors, status: "" });
                    }
                    }>
                    <option value=""></option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                {errors.status && <p className='error'>{errors.status}</p>}
                <div className='submitBtnContainer'>
                    <button className='backBtn' onClick={() => navigate("/")}>Back</button>
                    <button className='submitBtn' onClick={submitHandler}>{id ? "Update" : "Save"}</button>
                </div>
            </div>
        </MainScreen>
    )
}

export default SingleTask