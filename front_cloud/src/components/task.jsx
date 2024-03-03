import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Task({ isToCreate, token, taskInfo, setTaskInfo }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  function delete_task() {
    const requestOptionUser = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
    };
    fetch(process.env.REACT_APP_BACKURL + "task/" + taskInfo.id, requestOptionUser)
      .then((response) => response.json())
      .then(data => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function submit_form(e) {
    e.preventDefault();
  
    const fileInput = document.getElementById("fileInput");
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      console.error("No se ha seleccionado ningún archivo.");
      return;
    }
  
    const file = fileInput.files[0];
    const allowedFormats = [".docx", ".odt", ".pptx", ".xlsx"];
    const fileExtension = file.name.split(".").pop();
  
    if (!allowedFormats.includes("." + fileExtension)) {
      setErrorMessage("Formato de archivo no válido.");
      return;
    }
  
    setErrorMessage(null);
  
    const formData = new FormData();
    formData.append("file", file);
  
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: { Authorization: token },
    };
  
    const url = process.env.REACT_APP_BACKURL + "task";
  
    try {
      navigate("/dashboard");
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      console.log(data);
  
      if (data.message && data.fileName) {     
        setFile(data.fileName);
        console.error("La conversión fue exitosa.");
      } else {
        console.error("La conversión no fue exitosa.");
      }
    } catch (error) {
      console.log("La conversión fue exitosa.");
    }
  }

      return (
        <div className="flex h-screen items-center justify-center bg-blue-950 px-4 py-4">
          <div className="w-2/4">
            <div className="flex w-full justify-end">
              <div className="text-white cursor-pointer" onClick={() => navigate("/dashboard")}>
                Back to list tasks
              </div>
            </div>
            <form onSubmit={(e) => submit_form(e)}>
              <div className="text-white text-2xl text-bold mb-6">
                {isToCreate ? "Convert your files into PDF" : "Update a task"}
              </div>
              <div className="my-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload file</label>
                <input
                  id="fileInput"
                  name="file"
                  type="file"
                  onChange={({ target }) => setFile(target.files[0].name)}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-describedby="file_input_help"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">DOCX, ODT, PPTX, XLSX</p>
              </div>
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{errorMessage}</span>
                </div>
              )}
              <button
                type="submit"
                className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {isToCreate ? "Convert File" : "Update task"}
              </button>
              {!isToCreate ? (
                <button
                  onClick={() => delete_task()}
                  type="button"
                  className="ml-4 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium text-sm rounded-lg px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Delete
                </button>
              ) : (
                <></>
              )}
            </form>
          </div>
        </div>
      );
}