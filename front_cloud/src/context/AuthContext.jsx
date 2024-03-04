import { React, createContext, useState, useEffect } from "react";
import Cookies from "universal-cookie";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const cookie = new Cookies();
  const [cookieAuth, setCookieAuth] = useState(cookie.get("auth"));

  useEffect(() => {
    if (cookieAuth !== null && cookieAuth !== undefined) {
      setAuth(true);
    }
  }, []);

  useEffect(() => {
    if (auth) {
      console.log("Auth");
    }
  }, [auth]);

  const data = {
    auth,
    setAuth
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
export default AuthContext;
