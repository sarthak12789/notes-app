import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Signin } from "./components/Signin";
import Signup from "./components/Signup";
export const router=createBrowserRouter([
    {path:"/",element:<App/>},
    {path:"/Signup",element:<Signup/>},
    {path:"/login",element:<Signin/>}
])