import Login from './components/login'
import Dashboard from './components/dashboard';
import Task from './components/task';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import AuthContext, { AuthProvider } from "./context/AuthContext";
import Cookies from "universal-cookie";

function App() {

    const cookie = new Cookies();

  const [isAuth, setIsAuth] = useState(cookie.get("auth"));
  const [userInfo, setUserInfo] = useState("");
  const [token, setToken] = useState(null);
  const [stateTaskComponent, setStateTask] = useState(false);
  const [taskInfo, setTaskInfo] = useState({
    name: "",
    user: 0,
    id: 0,
  });

  useEffect(() => {
    if (isAuth) {
      cookie.get("user");
    }
  })

  function change_value_task(field, value) {
    let new_value = {
      ...taskInfo,
    };
    new_value[field] = value;
    console.log(new_value);
    setTaskInfo(new_value);
  }
  function changeUserInfo(newValue) {
    setUserInfo(newValue);
    cookie.set("user", newValue);
  }
  function changeToken(newValue) {
    setToken(newValue);
  }
  function changeTaskStateComponent(newValue) {
    setStateTask(newValue);
  }

  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <Login setUserInfo={changeUserInfo} setToken={changeToken} />
              }
            />
            <Route
              path="/dashboard"
              element={
                token || isAuth ? (
                  <Dashboard
                    setToken={changeToken}
                    token={token}
                    userInfo={userInfo}
                    setTaskStateComponent={changeTaskStateComponent}
                  />
                ) : (
                  <Navigate to="/login"></Navigate>
                )
              }
            />
            <Route
              path="/task"
              element={
                token || isAuth ? (
                  <Task
                    token={token}
                    isToCreate={stateTaskComponent}
                    taskInfo={taskInfo}
                    setTaskInfo={change_value_task}
                  />
                ) : (
                  <Navigate to="/login"></Navigate>
                )
              }
            />
            <Route
              path="*"
              element={
                token || isAuth ? (
                  <Navigate to="/login"></Navigate>
                ) : (
                  <Navigate to="/dashboard"></Navigate>
                )
              }
            />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
