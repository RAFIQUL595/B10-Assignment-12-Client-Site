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
import ViewAllUsers from "../pages/Dashboard/ViewAllUsers/ViewAllUsers";
import AdminRoute from "./AdminRoute";
import AdminViewSession from "../pages/Dashboard/AdminViewSession/AdminViewSession";
import AdminViewMaterials from "../pages/Dashboard/AdminViewMaterials/AdminViewMaterials";
import SessionDetails from "../components/SessionDetails/SessionDetails";
import ViewBookedSession from "../pages/Dashboard/ViewBookedSession/ViewBookedSession";
import ViewDetails from "../components/ViewDetails/ViewDetails";
import CreateNote from "../pages/Dashboard/CreateNote/CreateNote";
import ManageNote from "../pages/Dashboard/ManageNote/ManageNote";
import PrivateRoute from "./PrivateRoute";

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
            },
            {
                path: "sessionDetails/:id",
                element: <PrivateRoute><SessionDetails></SessionDetails></PrivateRoute>
            },
        ]
    },
    {
        path: "dashboard",
        element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
        children: [
            {
                path: "createNote",
                element: <PrivateRoute><CreateNote></CreateNote></PrivateRoute>
            },
            {
                path: "viewBookedSession",
                element: <PrivateRoute><ViewBookedSession></ViewBookedSession></PrivateRoute>
            },
            {
                path: "viewNote",
                element: <PrivateRoute><ManageNote></ManageNote></PrivateRoute>
            },
            {
                path: "viewDetails/:id",
                element: <PrivateRoute><ViewDetails></ViewDetails></PrivateRoute>
            },
            // Admin Routes
            {
                path: "viewAllUsers",
                element: <AdminRoute><ViewAllUsers></ViewAllUsers></AdminRoute>
            },
            {
                path: "adminViewSession",
                element: <AdminRoute><AdminViewSession></AdminViewSession></AdminRoute>
            },
            {
                path: "viewAllMaterials",
                element: <AdminRoute><AdminViewMaterials></AdminViewMaterials></AdminRoute>
            },

            // Tutor Routes
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