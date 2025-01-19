import React, { useState } from 'react';
import Lottie from "lottie-react";
import signupLottie from '../../assets/signup/Signup.json'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import useAuth from './../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import toast from 'react-hot-toast';



const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const SignUp = () => {
    const [isEyeOpen, setIsEyeOpen] = useState(false);
    const { register, handleSubmit } = useForm();
    const { handelRegister, updateUser } = useAuth();
    const axiosPublic = useAxiosPublic()
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // Image upload to imgbb and then get the URL
        const imageFile = { image: data.image[0] };
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        });

        if (res.data.success) {
            // Register the user
            await handelRegister(data.email, data.password);

            // Update user profile
            await updateUser(data.name, res.data.data.display_url);

            // Prepare user item data for server
            const userInfo = {
                name: data.name,
                email: data.email,
                role: data.role,
                image: res.data.data.display_url,
            };

            // Send user data to the server
            const userRes = await axiosPublic.post('/users', userInfo);
            if (userRes.data.insertedId) {

                // Show success popup
                Swal.fire({
                    title: "Sign Up Successful!",
                    text: "Your account has been created successfully.",
                    icon: "success"
                });
                navigate("/")
            }
        } else {
            toast.error(res.data.error);
        }

    };



    return (
        <div className="hero min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse gap-10">
                <div className="text-center md:w-2/6">
                    <Lottie animationData={signupLottie} loop={true}></Lottie>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body border-2 rounded-lg">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name <span className="text-red-500">*</span></span>
                            </label>
                            <input {...register('name', { required: true })} type="text" placeholder="Enter Your Name" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email <span className="text-red-500">*</span></span>
                            </label>
                            <input {...register('email', { required: true })} type="email" placeholder="Enter Your Email" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Photo <span className="text-red-500">*</span></span>
                            </label>
                            <input {...register('image', { required: true })} type="file" className="file-input w-full max-w-xs" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Role <span className="text-red-500">*</span></span>
                            </label>
                            <select
                                {...register('role', { required: true })}
                                className="select select-bordered"
                            >
                                <option value="Student">Student</option>
                                <option value="Admin">Admin</option>
                                <option value="Tutor">Tutor</option>
                            </select>
                        </div>

                        <div className="form-control relative">
                            <label className="label">
                                <span className="label-text">Password <span className="text-red-500">*</span></span>
                            </label>
                            <input {...register('password', { required: true })} type={isEyeOpen ? "text" : "password"} placeholder="Enter Your Password" className="input input-bordered" />
                            {isEyeOpen ? (
                                <IoEyeOutline
                                    className=" absolute top-12 right-4 text-[1.5rem] text-[#777777] cursor-pointer"
                                    onClick={() => setIsEyeOpen(false)}
                                />
                            ) : (
                                <IoEyeOffOutline
                                    className=" absolute top-12 right-4 text-[1.5rem] text-[#777777] cursor-pointer"
                                    onClick={() => setIsEyeOpen(true)}
                                />
                            )}
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary uppercase">Sign up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;