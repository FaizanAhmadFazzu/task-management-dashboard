import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/header/Header";
import { AuthContext } from "./context/useContext";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Footer from "./components/footer/Footer";
import Register from "./pages/register/Register";
import SingleTask from "./pages/new/SingleTask";
import TaskDetail from "./pages/taskDetail/taskDetail";

function App() {

  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/">
          <Route path="/" element={<ProtectedRoute>
            <Home />
          </ProtectedRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* <Route path="/create" element={<ProtectedRoute><SingleTask /></ProtectedRoute>} /> */}
          <Route path="/createTask" element={<ProtectedRoute><SingleTask /></ProtectedRoute>} />
          <Route path="/task/:id" element={<ProtectedRoute><SingleTask /></ProtectedRoute>} />
          <Route path="/task-detail/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
