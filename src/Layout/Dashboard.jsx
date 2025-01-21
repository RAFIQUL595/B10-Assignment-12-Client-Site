import React from 'react';
import useAuth from './../hooks/useAuth';
import { NavLink, Outlet } from 'react-router-dom';
import { IoCreateOutline } from 'react-icons/io5';
import { RiMenu3Line } from 'react-icons/ri';
import { TbListDetails } from 'react-icons/tb';
import useAxiosSecure from './../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaCloudUploadAlt } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // User get
    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`)
            return res.data
        }
    })

    const sideNavOption = <>
        <li className="text-[16px]">
            <NavLink
                className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
                }
                to="/dashboard/createSession"
            >
                <IoCreateOutline className="mr-2" />
                Create Study Session
            </NavLink>
        </li>
        <li className="text-[16px]">
            <NavLink
                className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
                }
                to="/dashboard/viewAllSession"
            >
                <TbListDetails className="mr-2" />
                View all study sessions
            </NavLink>
        </li>
        <li className="text-[16px]">
            <NavLink
                className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
                }
                to="/dashboard/uploadMaterials"
            >
                <FaCloudUploadAlt className="mr-2" />
                Upload materials
            </NavLink>
        </li>
    </>

    return (
        <div className="md:flex max-w-screen-xl mx-auto my-10">
            {/* Sidebar Navigation */}
            <div className="md:w-80 flex md:flex-col items-center space-y-5 bg-slate-400 py-10">
                {/* User Profile */}
                <div className="w-16 ml-5 md:ml-0">
                    <img
                        className="rounded-[50%]"
                        alt="User Profile"
                        src={user?.photoURL}
                    />
                </div>
                <div className="text-center ml-5 md:ml-0">
                    <h2 className="font-bold text-2xl">{users?.name}</h2>
                    <p className="text-lg text-white">{users?.role}</p>
                </div>

                {/* Dropdown Menu for Small Screens */}
                <div className="dropdown md:hidden absolute right-10">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost"
                    >
                        <RiMenu3Line className='size-7' />
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu absolute -left-32 menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
                    >
                        {sideNavOption}
                    </ul>
                </div>

                {/* Sidebar Menu for Larger Screens */}
                <ul className="hidden md:block space-y-3 ">
                    {sideNavOption}
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="md:flex-1 mx-10">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;
