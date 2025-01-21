import React from 'react';
import { Helmet } from 'react-helmet-async';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

const UploadMaterials = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Get all sessions data
    const { data: sessions = [], refetch } = useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tutorSessions/${user.email}`);
            return res.data;
        },
    });

    const onSubmit = async (data) => {
        // console.log(data);
    };

    return (
        <div className="p-6 bg-base-200 rounded-lg shadow-lg">
            <Helmet>
                <title>Upload Materials | Study Platform</title>
            </Helmet>
            <SectionTitle heading="Upload Study Materials"></SectionTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {sessions.map((session) => (
                    <div key={session._id} className="space-y-4">

                        {/* Session Title */}
                        <div>
                            <label className="block text-lg font-medium mb-1">Session Title</label>
                            <input
                                type="text"
                                defaultValue={session?.title}
                                readOnly
                                className="input input-bordered w-full bg-gray-100"
                                {...register('title')}
                            />
                            {errors.title && <span className="text-red-600">Session Title is required</span>}
                        </div>

                        {/* Study Session ID */}
                        <div>
                            <label className="block text-lg font-medium mb-1">Study Session ID</label>
                            <input
                                type="text"
                                defaultValue={session?._id}
                                readOnly
                                className="input input-bordered w-full bg-gray-100"
                                {...register('sessionId')}
                            />
                            {errors.sessionId && <span className="text-red-600">Study Session ID is required</span>}
                        </div>

                        {/* Tutor Email */}
                        <div>
                            <label className="block text-lg font-medium mb-1">Tutor Email</label>
                            <input
                                type="email"
                                defaultValue={session?.tutorEmail}
                                readOnly
                                className="input input-bordered w-full bg-gray-100"
                                {...register('tutorEmail')}
                            />
                            {errors.tutorEmail && <span className="text-red-600">Tutor Email is required</span>}
                        </div>
                    </div>
                ))}

                {/* Image Upload */}
                <div>
                    <label className="block text-lg font-medium mb-1">
                        Upload Image<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        className="file-input file-input-bordered w-full"
                        {...register('image', { required: true })}
                    />
                    {errors.image && <span className="text-red-600">Upload Image is required</span>}
                </div>

                {/* Google Drive Link */}
                <div>
                    <label className="block text-lg font-medium mb-1">
                        Google Drive Link<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="url"
                        placeholder="Enter Google Drive link"
                        className="input input-bordered w-full"
                        {...register('googleDrive', { required: true })}
                    />
                    {errors.googleDrive && <span className="text-red-600">Google Drive Link is required</span>}
                </div>

                {/* Submit Button */}
                <div>
                    <button type="submit" className="btn btn-success w-full">
                        Submit Material
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadMaterials;
