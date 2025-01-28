import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ViewDetails = () => {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const axiosSecure = useAxiosSecure();

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

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!reviewText || !rating) {
            return Swal.fire('Error', 'Review text and rating are required', 'error');
        }

        const newReview = { reviewText, rating, date: new Date().toISOString() };

        // Send review to backend
        axiosSecure.post(`/api/reviews/${sessionId}`, newReview)
            .then((response) => {
                setReviews((prevReviews) => [...prevReviews, response.data]);
                setReviewText('');
                setRating(5);
                Swal.fire('Success', 'Review submitted successfully!', 'success');
            })
            .catch(() => Swal.fire('Error', 'Failed to submit review', 'error'));
    };

    return (
        <div className='py-16 max-w-4xl mx-auto'>
            <Helmet>
                <title>View Details | Study Platform</title>
            </Helmet>

            {/* Session Details */}
            <div className="bg-white p-6 shadow-lg rounded-lg">
                <img src={sessionImage} alt="" />
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="mt-2 text-gray-600">{description}</p>
                <p className="mt-2 text-gray-600">Tutor: {tutorName}</p>
                <p className="mt-2 text-gray-500">Registration Start: {formatDate(registrationStartDate)}</p>
                <p className="mt-2 text-gray-500">Registration End: {formatDate(registrationEndDate)}</p>
                <p className="mt-2 text-gray-500">Class Dates: {formatDate(classStartDate)} to {formatDate(classEndDate)}</p>
                <p className="mt-2 text-gray-500">Session Duration: {sessionDuration}</p>
                <p className="mt-2 text-gray-500">Registration Fee: ${registrationFee}</p>
            </div>

            {/* Review Form */}
            <div className="mt-6 bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-center">Leave a Review && Rating</h3>
                <form onSubmit={handleReviewSubmit} className="mt-4">

                    <textarea
                        className="w-full p-2 border rounded-lg"
                        rows="4"
                        placeholder="Write your review..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                    ></textarea>
                    <div className="mt-3">
                        <label className="mr-2">Rating:</label>
                        <select
                            className="p-2 border rounded"
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num} Stars</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ViewDetails;