import React, { useState } from 'react';
import useAuth from './../hooks/useAuth';
import { NavLink, Outlet } from 'react-router-dom';
import { IoCreateOutline, IoHomeOutline } from 'react-icons/io5';
import { RiMenu3Line } from 'react-icons/ri';
import { TbListDetails } from 'react-icons/tb';
import useAxiosSecure from './../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaCloudUploadAlt, FaUsers } from 'react-icons/fa';
import { CiLogout } from 'react-icons/ci';
import { SiMaterialformkdocs } from 'react-icons/si';
import useAdmin from '../hooks/useAdmin';
import useTutor from '../hooks/useTutor';

const Dashboard = () => {
  const { user, handelLogOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isAdmin] = useAdmin();
  const [isTutor] = useTutor();
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Fetch user data
  const { data: users = {} } = useQuery({
    queryKey: ['users', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  const sideNavOption = (
    <>
      {isTutor && (
        <>
          <li>
            <NavLink
              to="/dashboard/createSession"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`
              }
            >
              <IoCreateOutline className="mr-2" />
              Create Study Session
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/viewAllSession"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`
              }
            >
              <TbListDetails className="mr-2" />
              View All Study Sessions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/uploadMaterials"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`
              }
            >
              <FaCloudUploadAlt className="mr-2" />
              Upload Materials
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/allMaterials"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`
              }
            >
              <SiMaterialformkdocs className="mr-2" />
              View All Materials
            </NavLink>
          </li>
        </>
      )}
      {isAdmin && (
        <>
          <li>
            <NavLink
              to="/dashboard/viewAllUsers"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`
              }
            >
              <FaUsers className="mr-2" />
              View All Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/adminViewSession"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`
              }
            >
              <TbListDetails className="mr-2" />
              View All Study Sessions
            </NavLink>
          </li>
        </>
      )}
      {!isAdmin && !isTutor && (
        <li>
          <NavLink
            to="/dashboard/viewAllUsers"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`
            }
          >
            <FaUsers className="mr-2" />
            View All Users
          </NavLink>
        </li>
      )}

      {/* Shared nav links */}
      <div className="divider"></div>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
            }`
          }
        >
          <IoHomeOutline className="mr-2" />
          Home
        </NavLink>
      </li>
      <li>
        <button
          onClick={handelLogOut}
          className="flex items-center p-3 rounded-lg hover:bg-gray-200"
        >
          <CiLogout className="mr-2" />
          Logout
        </button>
      </li>
    </>
  );

  return (
    <div className="lg:flex max-w-screen-xl mx-auto my-10">
      {/* Sidebar Navigation */}
      <div className="lg:w-80 flex lg:flex-col justify-between lg:justify-start items-center space-y-5 bg-slate-400 py-10 md:px-10">
        {/* User Profile */}
        <div className="w-16 ml-5 md:ml-0">
          <img
            className="rounded-[50%]"
            alt="User Profile"
            src={users?.image}
          />
        </div>
        <div className="text-center ml-5 md:ml-0">
          <h2 className="font-bold text-2xl">{users?.name}</h2>
          <p className="text-lg text-white">{users?.role}</p>
        </div>

        {/* Dropdown Menu for Small Screens */}
        <div className="dropdown lg:hidden relative z-10 mr-10">
          <button
            onClick={toggleDropdown}
            className="btn btn-ghost flex items-center"
          >
            <RiMenu3Line className="text-2xl" />
          </button>
          {isOpen && (
            <ul className="menu absolute -left-32 menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
              {sideNavOption}
            </ul>
          )}
        </div>

        {/* Sidebar Menu for Larger Screens */}
        <ul className="hidden lg:block space-y-3">{sideNavOption}</ul>
      </div>

      {/* Main Content Area */}
      <div className="lg:flex-1 mx-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
