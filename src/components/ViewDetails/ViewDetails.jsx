import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ViewDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch session details
    const { data: session = {} } = useQuery({
        queryKey: ["session", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/viewBookedDetails/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const {
        title,
        tutorName,
        tutorEmail,
        description,
        registrationStartDate,
        registrationEndDate,
        classStartDate,
        classEndDate,
        sessionDuration,
        registrationFee,
        sessionImage,
        studentEmail,
        studentName,
        sessionId
    } = session || {};

    // Function to format dates as DD-MM-YYYY
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    // Handle form submission
    const onSubmit = async (data) => {
        console.log(data);
        const { review, rating } = data;

        const newReview = {
            studentName: user?.displayName,
            reviewText: review,
            rating,
            sessionId,
            studentEmail: user?.email,
        };

        const res = await axiosSecure.post('/submitReview', newReview);
        if (res.data.insertedId) {
            Swal.fire({
                icon: 'success',
                title: 'Review Submitted',
                text: 'Thank you for your feedback!',
            });
            reset();
        }
        else {
            toast.error('There was an issue submitting your review. Please try again later.');
        }
    };

    return (
        <div className='py-20 max-w-4xl mx-auto'>
            <Helmet>
                <title>View Details | Study Platform</title>
            </Helmet>

            {/* Session Details */}
            <div className="bg-white p-6 shadow-lg rounded-lg text-lg">
                <img className='w-full rounded-lg' src={sessionImage} alt="" />
                <h2 className="text-2xl font-bold">{title}</h2>
                <div className='flex justify-between'>
                    <p className="mt-2 text-gray-600">Tutor Name: {tutorName}</p>
                    <p className="mt-2 text-gray-500">Tutor Email: {tutorEmail}</p>
                </div>
                <div className='flex justify-between'>
                    <p className="mt-2 text-gray-500">Registration Start: {formatDate(registrationStartDate)}</p>
                    <p className="mt-2 text-gray-500">Registration End: {formatDate(registrationEndDate)}</p>
                </div>
                <div className='flex justify-between'>
                    <p className="mt-2 text-gray-500">Class Start Date: {formatDate(classStartDate)}</p>
                    <p className="mt-2 text-gray-500">Class End Date: {formatDate(classEndDate)}</p>
                </div>
                <div className='flex justify-between'>
                    <p className="mt-2 text-gray-500">Session Duration: {sessionDuration}</p>
                    <p className="mt-2 text-gray-500">Registration Fee: ${registrationFee}</p>
                </div>
                <p className="mt-2 text-gray-600">Session Description: {description}</p>
            </div>

            {/* Review Form */}
            <div className="mt-6 bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-center">Leave a Review & Rating</h3>
                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Student Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Student Name:</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                            defaultValue={user?.displayName}
                            readOnly
                            {...register('studentName')}
                        />
                    </div>

                    {/* Student Email */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Student Email:</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                            defaultValue={user?.email}
                            readOnly
                            {...register('studentEmail')}
                        />
                    </div>

                    {/* Review */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Review:</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered w-full p-2"
                            rows="4"
                            placeholder="Write your review..."
                            {...register('review', { required: true })}
                        ></textarea>
                        {errors.review && <span className="text-red-600">Review is required</span>}
                    </div>

                    {/* Rating */}
                    <div className="form-control mt-3">
                        <label className="label">
                            <span className="label-text">Rating:</span>
                        </label>
                        <select
                            className="select select-bordered w-full p-2"
                            {...register('rating', { required: true })}
                        >
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num} Stars</option>
                            ))}
                        </select>
                        {errors.rating && <span className="text-red-600">Rating is required</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary mt-4 w-full"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ViewDetails;