import React from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const SocialLogin = () => {
    const { handleGoogle, handleGitHub } = useAuth()
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const handleSocialLogin = async (provider) => {
        try {
            const result = await provider();

            if (!result?.user) {
                throw new Error("User information not found");
            }

            const userInfo = {
                name: result.user.displayName || "GitHub User",
                email: result.user.email,
                photo: result.user.photoURL || "https://i.ibb.co/7p0bQpX/default-avatar.png",
                role: "Student"
            };

            // Send user data to the backend
            const userRes = await axiosPublic.post("/users", userInfo);

            if (userRes.data.success) {
                Swal.fire({
                    title: "Login Successful!",
                    text: `Welcome, ${userInfo.name}! Your account has been successfully created.`,
                    icon: "success",
                });
                navigate("/");
            } else {
                throw new Error("User registration failed");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Something went wrong during login.");
        }
    };

    return (
        <div>
            <div className="divider">OR</div>
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => handleSocialLogin(handleGoogle)}
                    className="border border-[#e5eaf2] mx-auto rounded-md py-2 px-16 flex items-center gap-[10px] text-[1rem] text-[#424242] hover:bg-gray-50 transition-all duration-200"
                >
                    <img
                        src="https://i.ibb.co/dQMmB8h/download-4-removebg-preview-1.png"
                        alt="google logo"
                        className="w-[23px]"
                    />
                    Login with Google
                </button>

                <button
                    onClick={() => handleSocialLogin(handleGitHub)}
                    className="border border-[#e5eaf2] mx-auto rounded-md py-2 px-16 flex items-center gap-[10px] text-[1rem] text-[#424242] hover:bg-gray-50 transition-all duration-200"
                >
                    <img
                        src="https://i.ibb.co/SN3xT9q/github.png"
                        alt="github logo"
                        className="w-[23px]"
                    />
                    Login with GitHub
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;