import React ,{ useState} from "react"
import { useNavigate } from "react-router-dom";

export default function Task({isToCreate, token, taskInfo, setTaskInfo}) { 

    const navigate = useNavigate()
    const [file, setFile] = useState(null)

    function delete_task() {
        const requestOptionUser = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' , 'Authorization' : token},
          };
          fetch(process.env.REACT_APP_BACKURL + "task/" + taskInfo.id, requestOptionUser)
          .then((response) => response.json())  
          .then(data => {
            navigate("/dashboard")
          })
          .catch((error)=>{
            console.log(error)
          })
    }

    function submit_form(e) {
        e.preventDefault();
        const formData = new FormData()
        // formData.append("name", taskInfo.name)
        formData.append("file", file)
        let requestOptions = {
          method: 'POST',
          body: formData,
          headers: { 'Authorization' : token},
        };
        let url = process.env.REACT_APP_BACKURL + "task"
          fetch(url, requestOptions)
          .then((response) => response.json())  
          .then(data => {
            console.log(data)
            setTaskInfo("name","")
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
        {/* <div className="my-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
            <input type="text" value={taskInfo.text} onChange={({target})=>setTaskInfo("name",target.value)} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Introduce a name (Optional)"></input>            
        </div> */}
        <div className="my-6">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload file</label>
                <input 
                  id="file"
                  name="file"
                  type="file"
                  onChange={({ target }) => setFile(target.files[0])}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help"/>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">DOCX.</p>
        </div>
          <button type="submit" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isToCreate? "Create a new task": "Update task"}</button>
          {!isToCreate?<button onClick={()=>delete_task()} type="button" className="ml-4 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium text-sm rounded-lg px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>:<></>}        </form>
          </div>
        </div>
    )
}