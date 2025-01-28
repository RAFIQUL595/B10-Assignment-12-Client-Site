import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { IoHomeOutline } from 'react-icons/io5';
import { CiLogin, CiLogout } from 'react-icons/ci';
import { FaUserPlus } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import useAdmin from './../../../hooks/useAdmin';
import useTutor from './../../../hooks/useTutor';


const Navbar = () => {
    const { user, handelLogOut } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAdmin] = useAdmin();
    const [isTutor] = useTutor();

    const toggleDropdownHandler = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const closeDropdownHandler = () => {
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest(".dropdown-container")) {
                closeDropdownHandler();
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("click", handleOutsideClick);
        } else {
            document.removeEventListener("click", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [isDropdownOpen]);

    const navOptions = (
        <>
            <li className='text-lg'>
                <Link to="/">
                    <IoHomeOutline /> Home
                </Link>
            </li>
        </>
    );

    return (
        <div className="navbar fixed z-10 max-w-screen-xl bg-opacity-30 bg-base-100 shadow-md px-4 text-blue-500">
            {/* Navbar Start */}
            <div className="navbar-start">
                {/* Dropdown for Mobile Navigation */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {navOptions}
                    </ul>
                </div>
                {/* Logo */}
                <Link to="/" className="text-xl flex items-center">
                    <img className='w-20' src={logo} alt="" />
                    <span className='font-bold hidden md:block'>Study Platform</span>
                </Link>
            </div>

            {/* Navbar End */}
            <div className="navbar-end gap-5">
                <div className="hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navOptions}
                    </ul>
                </div>
                {user ? (
                    <div className="flex items-center space-x-4">
                        {/* Profile Dropdown */}
                        <div
                            className={`dropdown-container dropdown dropdown-end ${isDropdownOpen ? "dropdown-open" : "dropdown-close"}`}
                        >
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                                onClick={toggleDropdownHandler}
                            >
                                <div className="w-10 rounded-full">
                                    <img src={user.photoURL} alt="Profile" />
                                </div>
                            </div>
                            {isDropdownOpen && (
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-40 p-2 shadow space-y-2"
                                >
                                    <li className="font-bold text-center text-[16px]">
                                        {user.displayName}
                                    </li>

                                    {/* Conditional Rendering */}
                                    {
                                        isAdmin && (
                                            <li>
                                                <Link to="/dashboard/viewAllUsers">
                                                    <span className="text-[16px]">Dashboard</span>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    {
                                        isTutor && (
                                            <li>
                                                <Link to="/dashboard/createSession">
                                                    <span className="text-[16px]">Dashboard</span>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    {
                                        !isAdmin && !isTutor && (
                                            <li>
                                                <Link to="/dashboard/viewBookedSession">
                                                    <span className="text-[16px]">Dashboard</span>
                                                </Link>
                                            </li>
                                        )
                                    }
                                    <li>
                                        <button onClick={handelLogOut} className="text-[16px]">
                                            Logout <CiLogout />
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="btn btn-outline md:text-lg text-blue-500">
                            <CiLogin /> Login
                        </Link>
                        <Link to="/signup" className="btn btn-outline md:text-lg text-blue-500 mr-16 md:mr-0">
                            <FaUserPlus /> Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
