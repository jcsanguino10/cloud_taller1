import React ,{ useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Task({isToCreate, token, taskInfo, setTaskInfo}) { 

    const navigate = useNavigate();
    const [file, setFile] = useState(null);

    function delete_task() {
        const requestOptionUser = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' , 'Authorization' : token},
          };
          fetch(process.env.REACT_APP_BACKURL + "task/" + taskInfo.id, requestOptionUser)
          .then((response) => response.json())  
          .then(data => {
            navigate("/dashboard");
          })
          .catch((error)=>{
            console.log(error);
          });
    }

    async function submit_form(e) {
        e.preventDefault();
      
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
          const file = fileInput.files[0];
      
          const formData = new FormData();
          formData.append("file", file);
      
          const requestOptions = {
              method: 'POST',
              body: formData,
              headers: { 'Authorization': token },
          };
      
          const url = process.env.REACT_APP_BACKURL + "convert-file";
      
          try {
            const response = await fetch(url, requestOptions);
            const data = await response.json();
            console.log(data);

            if (data.message && data.fileName) {
              setFile(data.fileName);
            } else {
              console.error("La conversión no fue exitosa.");
            }
          } catch (error) {
            console.error('Error al enviar archivo al backend:', error);
          }
        } else {
          console.error('Elemento fileInput no encontrado');
        }
      }
      
    const handleDownload = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKURL}/download-converted-file/${file}`, {
            responseType: "blob",
            headers: { Authorization: token }
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", file);
          document.body.appendChild(link);
          link.click();
        } catch (error) {
          console.error("Error downloading file:", error);
        }
      };

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
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload file</label>
                <input 
                  id="fileInput"
                  name="file"
                  type="file"
                  onChange={({ target }) => setFile(target.files[0].name)}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help"/>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">DOCX.</p>
        </div>
          <button type="submit" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isToCreate? "Create a new task": "Update task"}</button>
          {!isToCreate?<button onClick={()=>delete_task()} type="button" className="ml-4 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium text-sm rounded-lg px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>:<></>}
        </form>
        {file && (
          <button onClick={handleDownload} className="mt-4 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-800">Download Converted File</button>
        )}
          </div>
        </div>
    );
}
