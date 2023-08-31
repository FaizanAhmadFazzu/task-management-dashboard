import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import MainScreen from '../../components/mainScreen/MainScreen'
import { AuthContext } from '../../context/useContext';

const TaskDetail = () => {
    const { user, tasks } = useContext(AuthContext);
    const [task, setTask] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const task = tasks.find(task => task._id === id);
            if (!task) navigate("/")
            setTask(task);
        }
    }, [id])

    const getDueDate = (date) => {
        const dateObj = new Date(date.split("T")[0])
        const day = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
        const month = dateObj.getMonth();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const newDate = `${months[month + 1]} ${day}, ${dateObj.getFullYear()}`;
        return newDate
    }

    return (
        <MainScreen title={task?.title}>
            <div className='taskDetail'>
                <p className='taskDesc'>{task?.description}</p>
                {user.isAdmin && <div className="priorityLevel">User: <span style={{ fontWeight: 300 }}>{task?.user?.name}</span></div>}
                <div className="priorityLevel"><span>Priority Level:</span><span style={{ fontWeight: 300 }}>{task?.priorityLevel}</span></div>
                <div className="status"><span>Status:</span> <status className="statusBadge" style={{ backgroundColor: task?.status === "Open" ? "#ddba3d" : task?.status === "In Progress" ? "#525243" : "green" }}>{task?.status}</status></div>
                {task?.dueDate && <div className='dueDate'><span>Due Data:</span> <span style={{ fontWeight: 300 }}>{getDueDate(task?.dueDate)}</span></div>}
            </div>
        </MainScreen>
    )
}

export default TaskDetail