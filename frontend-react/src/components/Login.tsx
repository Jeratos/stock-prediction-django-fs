import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios';
import { useAuth } from "../context/context"
import axiosInstance from '../axiosInstance';

interface FormDataType {
  email: string;
  password: string;

}
interface ErrorType {
  email?: string;
  password?: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",

  });

  const { setIsAuthenticated } = useAuth();
 const [error, setError] = useState<ErrorType>({});
 const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/token/", formData);
      // console.log("response", response);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data ?? { email: "An unexpected error occurred." });
      } else {
        setError({ email: "An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
      
    }
  };


  return (
    <>
     <div className="h-full w-full flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-5">Login</h1>
        <form onSubmit={handleSubmit} className="w-96 flex flex-col gap-5">
 
          
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border bg-gray-50 text-black border-gray-300 rounded-lg p-2"
          />
          { error?.email && <p className="text-red-500 text-sm">{error?.email}</p> }
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border bg-gray-50 text-black border-gray-300 rounded-lg p-2"
          />
          { error?.password && <p className="text-red-500 text-sm">{error?.password}</p> }
           

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
           {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-5">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </>
  )
}
