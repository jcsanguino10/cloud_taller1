import { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

export default function Dashboard({setToken, token, userInfo, setUserInfo, setTaskStateComponent, setInfoTask}) {
    const [tasks, setTask] = useState([])
    const navigate = useNavigate()
    useEffect(()=>{
        const requestOptionUser = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' , 'Authorization' : token}
        };
        fetch(process.env.REACT_APP_BACKURL + "tasks/user/" + userInfo.id, requestOptionUser)
        .then((response) => response.json())  
        .then(data => {
          setTask(data)
        })
        .catch((error)=>{
          console.log(error)
        })
    },[])

    return(
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
                    <button className="mx-6 text-white text-xl" onClick={()=>setToken(null)}>
                        Log out
                    </button>
                </div>
            </div>
            <div className="relative my-4 mx-4 overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-white dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date to start
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date to finish
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3">
                                state
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tasks.length !=0? tasks.map((task)=><Task_detail_list key={task.id} task={task} setInfoTask={setInfoTask} stateTaskTab={setTaskStateComponent}></Task_detail_list>):<></>
                        }
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mr-5">
                <button 
                    type="button" 
                    onClick={()=>{
                        setTaskStateComponent(true);
                        navigate("/task")
                    }}
                    className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Add task</button>
            </div>
        </div>
    )
}

function Task_detail_list({task, setInfoTask ,stateTaskTab}) {
    const navigate = useNavigate()
    return(
        <tr key={task.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" 
            onClick={()=>{
                setInfoTask(task)
                stateTaskTab(false)
                navigate("/task")
            }}>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {task.text}
            </th>
            <td className="px-6 py-4">
                {task.create_date}
            </td>
            <td className="px-6 py-4">
                {task.finish_date}
            </td>
            <td className="px-6 py-4">
                {task.category}
            </td>
            <td className="px-6 py-4">
                {task.state}
            </td>
        </tr>
    )
}