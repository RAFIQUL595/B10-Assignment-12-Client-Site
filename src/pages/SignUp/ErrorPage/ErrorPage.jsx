import React from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import error from '../../../assets/404.gif'

const ErrorPage = () => {
    return (
        <div className="flex items-center flex-col justify-center w-full ">
            <img src={error} alt="404 Error" className="max-w-full max-h-full" />
            <Link>
                <button
                    className="py-3 px-6 text-xl sm:px-8 rounded-full bg-[#2ecc71] text-white flex items-center gap-[10px]">
                    <FaArrowLeftLong /> Back to home
                </button>
            </Link>
        </div>
    );
};

export default ErrorPage;