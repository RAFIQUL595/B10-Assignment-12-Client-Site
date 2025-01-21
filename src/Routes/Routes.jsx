import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home/Home";
import SignUp from "../pages/SignUp/SignUp";
import Dashboard from "../Layout/Dashboard";
import CreateSession from "../pages/Dashboard/CreateSession/CreateSession";
import ViewAllSessions from "../pages/Dashboard/ViewAllSessions/ViewAllSessions";
import Login from "../pages/Login/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "signup",
                element: <SignUp></SignUp>
            },
            {
                path: "login",
                element: <Login></Login>
            }
        ]
    },
    {
        path: "dashboard",
        element: <Dashboard></Dashboard>,
        children: [
            // Tutor routes
            {
                path: "createSession",
                element: <CreateSession></CreateSession>
            },
            {
                path: "viewAllSession",
                element: <ViewAllSessions></ViewAllSessions>
            }
        ]
    }
]);
export default router;