import React , { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({setUserInfo,setToken}) {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [signOn, setSignOn] = useState(false);

    function doSignIn(e) {
      e.preventDefault();
      const formData = new FormData()
      formData.append("name", user)
      formData.append("password", password)
      let requestOptions = {
        method: 'POST',
        body: formData
      };
      fetch(process.env.REACT_APP_BACKURL+ "user", requestOptions)
      .then((response) => response.json())  
      .then(
        (data) => {
          console.log(data)
          setUserInfo(data);
            const requestOptionsLogin = {
              method: 'POST',
              headers: {'Content-Type': 'application/x-www-form-urlencoded' , 'accept': 'application/json'},
              body: new URLSearchParams({
                'grant_type': '',
                'username': user,
                'password': password,
                'scope': '',
                'client_id': '',
                'client_secret': ''
            })
            };
            fetch(process.env.REACT_APP_BACKURL + "userlogin", requestOptionsLogin)
            .then((response) => response.json())  
            .then(
              (data) => {
                setToken("" + data.token_type + " " + data.access_token)
                navigate("/dashboard")
              }).catch(error=>console.log(error));
        }).catch(error=>console.log(error));
    }

    function doLogIn(e) {
      e.preventDefault();
      const requestOptionsLogin = {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded' , 'accept': 'application/json'},
        body: new URLSearchParams({
          'grant_type': '',
          'username': user,
          'password': password,
          'scope': '',
          'client_id': '',
          'client_secret': ''
      })
      };
      fetch(process.env.REACT_APP_BACKURL + "userlogin", requestOptionsLogin)
      .then((response) => response.json())  
      .then(
        (data) => {
          setToken("" + data.token_type + " " + data.access_token);
          const requestOptionUser = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' , 'Authorization' : ("" + data.token_type + " " + data.access_token)}
          };
          fetch(process.env.REACT_APP_BACKURL + "user", requestOptionUser)
          .then((response) => response.json())  
          .then(data => {
            console.log(data)
            setUserInfo(data) 
            navigate("/dashboard")    
          })
          .catch((error)=>{
            console.log(error)
          })
        })
      .catch(error=>console.log(error));
    }
    return (
      <div className="h-screen bg-blue-950 flex">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
          <div className="">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Welcome to task manager
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={(e)=>{signOn? doSignIn(e) : doLogIn(e)}}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                  User
                </label>
                <div className="mt-2">
                  <input
                    id="user"
                    name="user"
                    type="user"
                    value={user}
                    onChange={({ target }) => setUser(target.value)}
                    autoComplete="user"
                    required
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {signOn? "Sign in" : "Log in"}
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-white">
              {signOn? "You are a member" : "Not a member?"}{' '}
              <a href="#" onClick={()=>setSignOn(!signOn)} className="font-semibold leading-6 text-blue-500 hover:text-blue-600">
              {!signOn? "Sign in" : "Log in"}
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }
  
