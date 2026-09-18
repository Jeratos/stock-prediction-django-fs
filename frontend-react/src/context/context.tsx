import { createContext, useContext, useState } from "react";
// import axios from 'axios';


interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
     !!localStorage.getItem("access")
     )
  // const login=async (formData:{
  //   email:string;
  //   password:string;
  // })=>{
  //   const ser = await axios.post("http://localhost:8000/api/v1/auth/token/",formData,{ headers: {
  //       "Content-Type": "multipart/form-data",
  //   },})
  //   localStorage.setItem("access_token",ser.data.access)
  //   localStorage.setItem("refresh_token",ser.data.refresh)
  //   setIsAuthenticated(true)
  // }
 
  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
