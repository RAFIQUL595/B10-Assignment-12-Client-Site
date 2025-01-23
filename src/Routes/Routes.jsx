import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home/Home";
import SignUp from "../pages/SignUp/SignUp";
import Dashboard from "../Layout/Dashboard";
import CreateSession from "../pages/Dashboard/CreateSession/CreateSession";
import ViewAllSessions from "../pages/Dashboard/ViewAllSessions/ViewAllSessions";
import Login from "../pages/Login/Login";
import UploadMaterials from "../pages/Dashboard/UploadMaterials/UploadMaterials";
import AllMaterials from "../pages/Dashboard/AllMaterials/AllMaterials";
import TutorRoute from "./TutorRoute";

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
                element: <TutorRoute><CreateSession></CreateSession></TutorRoute>
            },
            {
                path: "viewAllSession",
                element: <TutorRoute><ViewAllSessions></ViewAllSessions></TutorRoute>
            },
            {
                path: "uploadMaterials",
                element: <TutorRoute><UploadMaterials></UploadMaterials></TutorRoute>
            },
            {
                path: "allMaterials",
                element: <TutorRoute><AllMaterials></AllMaterials></TutorRoute>
            }
        ]
    }
]);
export default router;