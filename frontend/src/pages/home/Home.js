import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import MainScreen from '../../components/mainScreen/MainScreen';
import { AuthContext } from '../../context/useContext';
import "./home.css"
// import TaskModal from '../../components/taskModal/TaskModal';
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Link } from 'react-router-dom';
import leftIcon from '../../images/leftIcon.png';
import rightIcon from '../../images/rightIcon.png';



const TaskCard = (props) => {
  const { task, getDueDate, deleteHandler } = props;
  const { user } = useContext(AuthContext);
  const [seeMore, setSeeMore] = useState(false);
  return (
    <div className='taskCardContainer' key={task._id}>
      <div className='taskCard'>
        <h2 className='cardTitle'>{task.title}</h2>
        {(task.description.length > 200) ? <p className='taskDesc'>{task.description.slice(0, 150)}...</p> : <p className='taskDesc'>{task.description}</p>}
        {user.isAdmin && <div className="priorityLevel"><span>User: </span><span style={{ fontWeight: 300 }}>{task.user.name}</span></div>}
        <div className="priorityLevel"><span>Priority Level:</span><span style={{ fontWeight: 300 }}>{task.priorityLevel}</span></div>
        <div className="status"><span>Status:</span> <status className="statusBadge" style={{ backgroundColor: task.status === "Open" ? "#ddba3d" : task.status === "In Progress" ? "#525243" : "green" }}>{task.status}</status></div>
        <div className='dueDate'><span>Due Data:</span> <span style={{ fontWeight: 300 }}>{getDueDate(task.dueDate)}</span></div>
        <div className='taskCardBtn'>
          <Link to={`/task-detail/${task._id}`}><button className='button viewBtn'>View More</button></Link>
          <Link to={`/task/${task._id}`}><button className='button editBtn'>Edit</button></Link>
          {(user.isAdmin && task.status === "Completed") && <button className='button deleteBtn' onClick={() => deleteHandler(task._id)}>Delete</button>}
        </div>
      </div>
    </div>
  )
}


const SwiperButtonNext = () => {
  const swiper = useSwiper();

  const goPrevious = () => {
    const previousIndex = swiper.previousIndex;
    console.log('Previous Slide Index:', previousIndex);
  };
  return <div className='slideBtn'>
    <button className="prevSlideBtn" onClick={goPrevious}><img src={leftIcon} alt="" /></button>
    <button className="nextSlideBtn" onClick={() => swiper.slideNext()}> <img src={rightIcon} alt="" /></button>
  </div>
};



const Home = () => {
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [editTask, setEditTask] = useState(undefined);
  const [priorityLevel, setPriorityLevel] = useState("");
  const [status, setStatus] = useState("");
  const { user, dispatch } = useContext(AuthContext);
  const [modalTitle, setModalTitle] = useState("");
  const [thumbsSwiper, setThumbsSwiper] = useState(0);


  const [show, setShow] = useState(false);

  const handleShow = () => {
    setModalTitle("Create Task");
    setShow(true);
  }

  const listTasks = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      setLoading(true);
      if (status && priorityLevel) {
        const { data } = await axios.get(`/tasks?status=${status}&&priorityLevel=${priorityLevel}`, config);
        dispatch({ type: "SET_TASKS", payload: data });
        setTaskData(data);
      }
      else if (status) {
        const { data } = await axios.get(`/tasks?status=${status}`, config);
        dispatch({ type: "SET_TASKS", payload: data });
        setTaskData(data);
      } else if (priorityLevel) {
        const { data } = await axios.get(`/tasks?priorityLevel=${priorityLevel}`, config);
        dispatch({ type: "SET_TASKS", payload: data });
        setTaskData(data);
      } else {
        const { data } = await axios.get("/tasks", config);
        dispatch({ type: "SET_TASKS", payload: data });
        setTaskData(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const message = error.response && error.response.data.message ? error.response.data.message : error.message
      setErrorMessage(message);
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      setLoading(true);
      const { data } = await axios.delete(`/tasks/${taskId}`, config);
      setLoading(false);
      listTasks();
    } catch (error) {
      setLoading(false);
      const message = error.response && error.response.data.message ? error.response.data.message : error.message
      setErrorMessage(message);
    }
  }

  const deleteHandler = (taskId) => {
    if (window.confirm("Are you sure?")) {
      deleteTask(taskId);
    }
  }

  // const handleEdit = (task) => {
  //   setEditTask(task);
  //   setModalTitle("Update Task");
  // }

  useEffect(() => {
    listTasks();
  }, [status, priorityLevel])



  const getDueDate = (date) => {
    const dateObj = new Date(date.split("T")[0])
    const day = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
    const month = dateObj.getMonth();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const newDate = `${months[month + 1]} ${day}, ${dateObj.getFullYear()}`;
    return newDate
  }


  return (
    <MainScreen title={`Welcome back ${user.name}`}>
      <div className='addBtnContainer'>
        <Link to={"/createTask"}><button className='addBtn'>Create New Task</button></Link>
      </div>
      <div className='taskContainer'>
        <div className="sidebar">
          <div className='selectStatus'>
            <label for="status">Status</label>
            <select id="status" onChange={(e) => setStatus(e.target.value)}>
              <option value="">Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className='selectPriorityLevel'>
            <label for="priorityLevel">Priority Level</label>
            <select id="priorityLevel" onChange={(e) => setPriorityLevel(e.target.value)}>
              <option value="">Priority Level</option>
              <option value={1}>One</option>
              <option value={2}>Two</option>
              <option value={3}>Three</option>
            </select>
          </div>
        </div>
        <div className='tasks'>
          {window.innerWidth <= 576 ? (
            <Swiper
            >
              <SwiperButtonNext>Next Task</SwiperButtonNext>
              {taskData && taskData.length > 0 ? taskData.map((task, i) => (<SwiperSlide
                key={i}
                className="tasks"
              >
                <TaskCard
                  task={task}
                  key={task._id}
                  getDueDate={getDueDate}
                  deleteHandler={deleteHandler}
                />
              </SwiperSlide>)) : <div className='noData'>No Record found.</div>}
            </Swiper>
          ) : taskData && taskData.length > 0 ? taskData.map((task, index) => (
            <TaskCard
              task={task}
              key={task._id}
              getDueDate={getDueDate}
              deleteHandler={deleteHandler}
            />
          )) : <div className='noData'>No Record found.</div>}
        </div>
      </div>
      {/* <TaskModal
        show={show}
        handleClose={handleClose}
        modalTitle={modalTitle}
        listTasks={listTasks}
        editTask={editTask}
      /> */}
    </MainScreen>
  )
}

export default Home