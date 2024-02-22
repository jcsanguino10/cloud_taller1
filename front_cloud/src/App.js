import Login from './components/login'
import Dashboard from './components/dashboard';
import Task from './components/task';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';


function App() {

  const [userInfo, setUserInfo] = useState("")
  const [token, setToken] = useState(null)
  const [stateTaskComponent, setStateTask] = useState(false);
  const [taskInfo, setTaskInfo] = useState({
    name: "none",
    user: 0,
    id: 0
  })

  function change_value_task(field, value) {
    let new_value = {
      ...taskInfo
    }
    new_value[field] = value
    console.log(new_value)
    setTaskInfo(new_value)
  }
  function changeUserInfo(newValue) {
    setUserInfo(newValue)
  }
  function changeToken(newValue) {
    setToken(newValue)
  }
  function changeTaskStateComponent(newValue) {
    setStateTask(newValue)
  }

  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUserInfo={changeUserInfo} setToken={changeToken}/>} />
        <Route path="/dashboard" element={token?<Dashboard setToken={changeToken} token={token} userInfo={userInfo} setTaskStateComponent={changeTaskStateComponent}/>: <Navigate to="/login"></Navigate>} />
        <Route path="/task" element={token?<Task token={token} isToCreate={stateTaskComponent} taskInfo={taskInfo} setTaskInfo={change_value_task}/>: <Navigate to="/login"></Navigate>} />
        <Route path="*" element={token?<Navigate to="/login"></Navigate>:<Navigate to="/dashboard"></Navigate>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
