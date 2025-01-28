import React from 'react';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const ViewBookedSession = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch all booked sessions with loading and error handling
    const { data: sessions = [], refetch } = useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/viewBookedSessions');
            return res.data;
        },
    });

    return (
        <div className="p-5">
            <SectionTitle heading="My Booked Sessions" />
            {sessions.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sessions.map((session) => (
                        <div key={session._id} className="card bg-base-100 shadow-xl p-4 space-y-2">
                            <img src={session.sessionImage} alt="" />
                            <h3 className="text-lg font-semibold">Title: {session.title}</h3>
                            <div className="card-actions justify-center">
                                <Link to={`/viewDetails/${session._id}`}><button className="btn btn-primary">View Details</button></Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No booked sessions found.</p>
            )}
        </div>
    );
};

export default ViewBookedSession;