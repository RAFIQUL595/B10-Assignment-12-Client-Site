import React, { useState, useEffect } from 'react';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import SessionsStatusCard from '../../Shared/SessionsStatus/SessionsStatusCard';
import { Helmet } from 'react-helmet-async';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

const ViewAllSessions = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);

    // Fetch sessions
    const { data: sessions = [], refetch } = useQuery({
        queryKey: ['sessions', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get(`/sessions/${user.email}`);
            return res.data;
        }
    });

    // Pagination calculations
    const totalSessions = sessions.length;
    const totalPages = Math.ceil(totalSessions / postsPerPage);
    const currentSessions = sessions.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    // Ensure valid current page when total sessions change
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(totalPages, 1));
        }
    }, [totalSessions, totalPages, currentPage]);

    return (
        <div className="md:p-6 my-10">
            <Helmet>
                <title>View All Study Sessions | Study Platform</title>
            </Helmet>
            <SectionTitle heading='View All Study Sessions'></SectionTitle>

            {/* Pending Sessions */}
            <SessionsStatusCard refetch={refetch} sessions={currentSessions} sectionTitle='Pending Sessions' status='pending' statusTitle={<p className="text-orange-400 font-medium mt-2">Status: Pending</p>} noSession='Pending' message={<p className='text-orange-400'>Your study sessions has been pending!</p>}></SessionsStatusCard>

            {/* Approved Sessions */}
            <SessionsStatusCard refetch={refetch} sessions={currentSessions} sectionTitle='Approved Sessions' status='approved' statusTitle={<p className="text-green-500 font-medium mt-2">Status: Approved</p>} noSession='Approved' message={<p className='text-green-500'>Your study sessions has been approved.</p>}></SessionsStatusCard>

            {/* Rejected Sessions */}
            <SessionsStatusCard refetch={refetch} sessions={currentSessions} sectionTitle='Rejected Sessions' status='rejected' statusTitle={<p className="text-red-500 font-medium mt">Status: Rejected</p>} noSession='Rejected'></SessionsStatusCard>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition disabled:opacity-50"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 bg-gray-200 rounded-md font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition disabled:opacity-50"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ViewAllSessions;