import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface FormDataType {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

interface ErrorType {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
}

export default function Signup() {
  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    is_staff: false,
  });

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
    const response = await axios.post("http://localhost:8000/api/v1/auth/register/", formData);
      console.log("response", response);
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data ?? { username: "An unexpected error occurred." });
      } else {
        setError({ username: "An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-full w-full flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-5">Signup</h1>
        <form onSubmit={handleSubmit} className="w-96 flex flex-col gap-5">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          { error?.username && <p className="text-red-500 text-sm">{error?.username}</p>} 
          <input
            type="text"
            placeholder="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          { error?.first_name && <p className="text-red-500 text-sm">{error?.first_name}</p>} 
          <input
            type="text"
            placeholder="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          { error?.last_name && <p className="text-red-500 text-sm">{error?.last_name}</p> }
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          { error?.email && <p className="text-red-500 text-sm">{error?.email}</p> }
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          { error?.password && <p className="text-red-500 text-sm">{error?.password}</p> }
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_staff"
              id="is_staff"
              checked={formData.is_staff}
              onChange={handleChange}
            />
            <label htmlFor="is_staff">Are you a staff member?</label>
          </div>
          { error?.is_staff && <p className="text-red-500 text-sm">{error?.is_staff}</p> }
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
           {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
