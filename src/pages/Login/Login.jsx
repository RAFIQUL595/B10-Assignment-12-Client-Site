import React, { useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import lottieLogin from '../../assets/login/Login.json'
import { Helmet } from 'react-helmet-async';
import useAuth from './../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const Login = () => {
    const [isEyeOpen, setIsEyeOpen] = useState(false);
    const { handelLogin } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const result = await handelLogin(data.email, data.password);

            // Pop up message
            Swal.fire({
                title: "Login Successful!",
                icon: "success",
                draggable: true
            });

            // Navigate to Home Page
            navigate('/')
        } catch (error) {
            toast.error('Login Failed:', error.message);
        }
    };

    return (
        <div className="hero-content my-10 flex-col gap-5 lg:flex-row-reverse">
            <Helmet>
                <title>Login | Study Platform</title>
            </Helmet>
            <div className="w-96 text-center lg:text-left">
                <Lottie animationData={lottieLogin} />
            </div>
            <div className="card bg-base-100 w-full border-2 max-w-sm shrink-0 shadow-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                    <h1 className="text-2xl text-center font-bold">Login now!</h1>

                    {/* Email */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Email <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered"
                            {...register('email', { required: true })}
                        />
                        {errors.email && <p className="text-red-600">Email is required</p>}
                    </div>

                    {/* Password */}
                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text">
                                Password <span className="text-red-500">*</span>
                            </span>
                        </label>
                        <input
                            type={isEyeOpen ? "text" : "password"}
                            placeholder="Enter your password"
                            className="input input-bordered"
                            {...register('password', { required: true, minLength: 6 })}
                        />
                        {errors.password?.type === 'required' && <p className="text-red-600">Password is required</p>}
                        {errors.password?.type === 'minLength' && <p className="text-red-600">Password must be 6 characters</p>}
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

                    {/* Login Button */}
                    <div className="form-control mt-6">
                        <button className="btn btn-primary text-lg">Login</button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-5 text-center">
                        <p>
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-blue-500">
                                SignUp
                            </Link>
                        </p>
                    </div>
                </form>


            </div>
        </div>
    );
};

export default Login;