import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ setToken, token, userInfo, setTaskStateComponent }) {
  const [tasks, setTask] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const requestOptionUser = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    
    fetch(process.env.REACT_APP_BACKURL + "tasks/user/" + userInfo.id, requestOptionUser)
      .then((response) => response.json())
      .then(data => {
        setTask(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="h-screen bg-blue-950 px-4 py-4">
      <div className="flex justify-between px-4 py-4">
        <div className="text-white text-2xl">
          Task Manager
        </div>
        <div>
          <img
            className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <button className="mx-6 text-white text-xl" onClick={() => setToken(null)}>
            Log out
          </button>
        </div>
      </div>
      <div className="relative my-4 mx-4 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-white dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                State
              </th>
              <th scope="col" className="px-6 py-3">
                Download
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.length !== 0 ? tasks.map((task) => <Task_detail_list key={task.id} task={task}></Task_detail_list>) : <></>}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mr-5">
        <button
          type="button"
          onClick={() => {
            setTaskStateComponent(true);
            navigate("/task");
          }}
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Add task</button>
      </div>
    </div>
  );
}

function Task_detail_list({ task }) {
    const handleDownload = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKURL}download-converted-file/${task.name}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `converted_${task.name.split('.')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    };

    return (
        <tr key={task.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {task.name}
          </th>
          <td className="px-6 py-4">{task.state}</td>
          <td className="px-6 py-4">
            {task.url ? (
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Download
              </button>
            ) : (
              <span></span>
            )}
          </td>
        </tr>
      );
    }
    

