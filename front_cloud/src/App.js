import Login from './components/login'
import Dashboard from './components/dashboard';
import Task from './components/task';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';


function App() {

  function toStringDate(today) {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  const [userInfo, setUserInfo] = useState("")
  const [token, setToken] = useState(null)
  const [stateTaskComponent, setStateTask] = useState(false);
  const [taskInfo, setTaskInfo] = useState({
    text: "",
    create_date: toStringDate(new Date()),
    finish_date: toStringDate(new Date()),
    state: "",
    category: 0,
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
        <Route path="/dashboard" element={token?<Dashboard setInfoTask={setTaskInfo} setToken={changeToken} token={token} userInfo={userInfo} setUserInfo={changeUserInfo} setTaskStateComponent={changeTaskStateComponent}/>: <Navigate to="/login"></Navigate>} />
        <Route path="/task" element={token?<Task token={token} userInfo={userInfo} isToCreate={stateTaskComponent} taskInfo={taskInfo} setTaskInfo={change_value_task}/>: <Navigate to="/login"></Navigate>} />
        <Route path="*" element={token?<Navigate to="/login"></Navigate>:<Navigate to="/dashboard"></Navigate>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
