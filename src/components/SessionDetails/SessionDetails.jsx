import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import useAdmin from '../../hooks/useAdmin';
import useTutor from '../../hooks/useTutor';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const SessionDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const [isAdmin] = useAdmin();
    const [isTutor] = useTutor();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch session details
    const { data: session = {} } = useQuery({
        queryKey: ["session", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/viewSessionsDetails/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    // Fetch reviews
    const { data: reviews = [] } = useQuery({
        queryKey: ['reviews'],
        queryFn: async () => {
            const res = await axiosSecure.get('/getReview');
            return res.data;
        }
    });

    // Filter reviews by session ID
    const filteredReviews = reviews.filter(review => review.sessionId === id);

    // Calculate the average rating
    const averageRating = filteredReviews.length
        ? filteredReviews.reduce((acc, review) => acc + review.rating, 0) / filteredReviews.length
        : 0;

    // Function to format dates as DD-MM-YYYY
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    // Destructure session data
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
    } = session || {};

    // Determine if registration has ended
    const isRegistrationClosed = registrationEndDate && new Date(registrationEndDate) < new Date();

    const handleBookSession = async () => {
        const sessionData = {
            sessionId: id,
            studentEmail: user?.email,
            studentName: user?.displayName,
            tutorEmail,
            title,
            tutorName,
            description,
            registrationStartDate,
            registrationEndDate,
            classStartDate,
            classEndDate,
            sessionDuration,
            registrationFee,
            sessionImage,
        };

        const res = await axiosSecure.post('/bookedSession', sessionData);

        if (res.data.insertedId) {
            Swal.fire({
                title: "Session Booked Successfully!",
                icon: "success",
                draggable: true
            });
            navigate('/');
        } else {
            toast.error("Booking Failed!");
        }
    };

    return (
        <div className='md:flex py-32'>
            <div className='flex items-center justify-center md:w-2/3'>
                <Helmet>
                    <title>Sessions Details | Study Platform</title>
                </Helmet>

                <div className="card bg-base-100 w-96 shadow-xl">
                    <figure>
                        {sessionImage ? (
                            <img src={sessionImage} alt={title} className="w-full h-48 object-cover" />
                        ) : (
                            <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-700">
                                No Image Available
                            </div>
                        )}
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{title}</h2>
                        <p><strong>Tutor Name:</strong> {tutorName}</p>
                        <p><strong>Registration Start:</strong> {formatDate(registrationStartDate)}</p>
                        <p><strong>Registration End:</strong> {formatDate(registrationEndDate)}</p>
                        <p><strong>Class Start:</strong> {formatDate(classStartDate)}</p>
                        <p><strong>Class End:</strong> {formatDate(classEndDate)}</p>
                        <p><strong>Registration Fee:</strong> ${registrationFee}</p>
                        <p><strong>Session Duration:</strong> {sessionDuration}</p>
                        <p><strong>Session Description:</strong> {description}</p>
                        <p><strong>Average Rating:</strong> {averageRating.toFixed(1)} / 5</p>
                        <div className="card-actions w-full mt-3">
                            {
                                (isAdmin || isTutor) ? (
                                    <button className="btn w-full btn-disabled">
                                        Book Now
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleBookSession}
                                        className={`btn ${isRegistrationClosed ? 'btn-disabled w-full' : 'btn-primary w-full'}`}
                                        disabled={isRegistrationClosed}
                                    >
                                        {isRegistrationClosed ? "Registration Closed" : "Book Now"}
                                    </button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className='px-4 md:px-0 mt-5 md:mt-0 md:w-1/3'>
                <h3 className="text-xl font-bold text-cyan-400">Students Reviews:</h3>
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review, index) => (
                        <div key={index} className="border-t pt-4">
                            <p><strong>{review.studentName}</strong></p>
                            <p>Rating: {review.rating} / 5</p>
                            <p className='text-blue-600'>{review.reviewText}</p>
                        </div>
                    ))
                ) : (
                    <p className='text-red-500 text-center mt-3'>No reviews available.</p>
                )}
            </div>
        </div>
    );
};

export default SessionDetails;