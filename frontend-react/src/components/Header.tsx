import { Link } from "react-router-dom"
import { useAuth } from "../context/context"

export default function Header() {
const {isAuthenticated} = useAuth();

    return (
        <>
            <header className="py-4 flex justify-between px-20">
                <div className="container mx-auto">
                    <Link to="/" className="text-2xl font-bold hover:text-blue-600 transition-all duration-300">Stock Market Prediction</Link>
                </div>
                <nav>
                    <ul className="flex gap-5">
                        {

                        }
                        { isAuthenticated==false && (
                                <>

                        <li className="rounded-lg border border-green-500 text-green-500 py-1 px-5 hover:bg-green-600 hover:text-white hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300">
                            <Link to="/login" className=" text-md font-medium">Login</Link>
                        </li>
                        <li className="rounded-lg border border-blue-500 bg-blue-500 py-1 px-5 hover:bg-blue-600 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300">
                            <Link to="/signup" className="text-white text-md font-medium">Signup</Link>
                        </li>
                            </>
                        )}
                        { isAuthenticated==true && (
                        <li className="rounded-lg border border-green-500 text-green-500 py-1 px-5 hover:bg-green-600 hover:text-white hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300">
                            <Link to="/logout" className=" text-md font-medium">Logout</Link>
                        </li>
                        )}
                    </ul>
                </nav>
            </header>
        </>
    )
}
