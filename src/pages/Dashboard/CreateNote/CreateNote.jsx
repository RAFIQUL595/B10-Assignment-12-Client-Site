import React from "react";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";

const CreateNote = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const onSubmit = async (data) => {
        const { email, title, description } = data;

        const newNote = { email, title, description };

        const res = await axiosSecure.post('/submitNote', newNote);
        if (res.data.insertedId) {
            Swal.fire({
                icon: 'success',
                title: 'Note Created',
                text: 'Your note has been successfully added!',
            });
            reset();
        } else {
            toast.error('There was an issue creating your note. Please try again later.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg my-20 border">
            <Helmet>
                <title>Create Note | Study Platform</title>
            </Helmet>
            <SectionTitle heading="Create Note" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        defaultValue={user?.email}
                        {...register("email", { required: true })}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                    />
                </div>

                {/* Title Field */}
                <div>
                    <label className="block text-sm font-medium">
                        Title<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        {...register("title", { required: true })}
                    />
                    {errors.title && <span className="text-red-600">Title is required</span>}
                </div>

                {/* Description Field */}
                <div>
                    <label className="block text-sm font-medium">
                        Description<span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="w-full p-2 border rounded"
                        {...register("description", { required: true })}
                    />
                    {errors.description && <span className="text-red-600">Description is required</span>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                    Create Note
                </button>
            </form>
        </div>
    );
};

export default CreateNote;