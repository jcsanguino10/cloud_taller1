import { useState, useEffect} from "react"
import Datepicker from "react-tailwindcss-datepicker"; 
import { useNavigate } from "react-router-dom";

export default function Task({userInfo, isToCreate, token, taskInfo, setTaskInfo}) { 

    const navigate = useNavigate()
    const [value, setValue] = useState({ 
        startDate: taskInfo.create_date, 
        endDate: taskInfo.finish_date 
    }); 

    const [categoryName, setCategoryName] = useState("")

    const [categories, setCategories] = useState([])

    useEffect(()=>{
        const requestOptionUser = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' , 'Authorization' : token}
          };
          fetch(process.env.REACT_APP_BACKURL + "categories", requestOptionUser)
          .then((response) => response.json())  
          .then(data => {
            setCategories(data)
          })
          .catch((error)=>{
            console.log(error)
          })
    },[])

    const handleValueChange = (newValue) => {
        setValue(newValue); 
        setTaskInfo("create_date", value.startDate)
        setTaskInfo("finish_date", value.endDate)
    } 

    function createCategory() {
        const requestOptionUser = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , 'Authorization' : token},
            body: JSON.stringify({"name": categoryName})
          };
          fetch(process.env.REACT_APP_BACKURL + "category", requestOptionUser)
          .then((response) => response.json())  
          .then(data => {
            setCategories(categories =>[...categories, data])
            setCategoryName("")
          })
          .catch((error)=>{
            console.log(error)
          })
    }

    function delete_task() {
        const requestOptionUser = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' , 'Authorization' : token},
          };
          fetch(process.env.REACT_APP_BACKURL + "task/" + taskInfo.id, requestOptionUser)
          .then((response) => response.json())  
          .then(data => {
            setCategories([])
            navigate("/dashboard")
          })
          .catch((error)=>{
            console.log(error)
          })
    }

    function submit_form(e) {
        e.preventDefault();
        let body_request = taskInfo
        body_request.user = userInfo.id
        let requestOptionUser = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , 'Authorization' : token},
            body: JSON.stringify(body_request)
          }; 
        let url = process.env.REACT_APP_BACKURL + "task"
        if (!isToCreate) {
            requestOptionUser.method = "PUT"
            url += "/" + taskInfo.id
        }
        else{
            delete body_request.id
            requestOptionUser.body = JSON.stringify(body_request)
        }
        console.log(taskInfo)
          fetch(url, requestOptionUser)
          .then((response) => response.json())  
          .then(data => {
            console.log(data)
            setCategories([])
            navigate("/dashboard")
          })
          .catch((error)=>{
            console.log(error)
          })
    }

    return(
        <div className="flex h-screen items-center justify-center bg-blue-950 px-4 py-4">
            <div className="w-2/4">
            <div className="flex w-full justify-end">
            <div className="text-white cursor-pointer" onClick={()=>navigate("/dashboard")}>
                Back to list taks
            </div>
        </div>
        <form onSubmit={(e)=>submit_form(e)}>
        <div className="text-white text-2xl text-bold mb-6">
            {isToCreate? "Create a new task for you": "Update a task"}
        </div>
        <div className="my-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <textarea value={taskInfo.text} onChange={({target})=>setTaskInfo("text",target.value)} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>            
        </div>
        <div className="my-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date to start - Date to finish</label>
                    <Datepicker 
                    value={value} 
                    onChange={handleValueChange} 
                    /> 
                </div>

                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select category</label>

                <select value={taskInfo.category} onChange={({target})=>setTaskInfo("category",target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option >Choose a category</option>
                {
                categories.map((category, index)=><option key={index} value={category.id} >{category.name}</option>)
                }
                </select>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white mt-6">
                  Create category (The category would be add to the list)
                </label>
                <div className="flex w-full">
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    value={categoryName}
                    onChange={({ target }) => setCategoryName(target.value)}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Category name"
                  />
                </div>
                <button 
                    type="button" 
                    onClick={()=>{createCategory()}}
                    className="w-96 mt-2 ml-8 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Create category</button>
                </div>
                <label className="mt-6 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select state</label>
                <select value={taskInfo.status} onChange={({target})=>setTaskInfo("state",target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option >Choose a state</option>
                    <option value="start">Start</option>
                    <option value="progress">Progress</option>
                    <option value="finish">Finish</option>
                </select>

            <button type="submit" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isToCreate? "Create a new task": "Update task"}</button>
            {!isToCreate?<button onClick={()=>delete_task()} type="button" className="ml-4 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium text-sm rounded-lg px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>:<></>}        </form>
            </div>
        </div>
    )
}