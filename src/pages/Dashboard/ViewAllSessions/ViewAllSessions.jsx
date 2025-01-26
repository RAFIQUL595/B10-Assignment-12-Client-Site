import React from 'react';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import SessionsStatusCard from '../../Shared/SessionsStatus/SessionsStatusCard';
import { Helmet } from 'react-helmet-async';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

const ViewAllSessions = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    // Get all sessions data
    const { data: sessions = [], refetch } = useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/sessions/${user.email}`);
            return res.data;
        }
    });

    return (
        <div className="md:p-6">
            <Helmet>
                <title>View All Study Sessions | Study Platform</title>
            </Helmet>
            <SectionTitle heading='View All Study Sessions'></SectionTitle>

            {/* Pending Sessions */}
            <SessionsStatusCard sessions={sessions} sectionTitle='Pending Sessions' status='pending' statusTitle={<p className="text-orange-400 font-medium mt-2">Status: Pending</p>} noStatus='Pending' message={<p className='text-orange-400'>Your study sessions has been pending!</p>}></SessionsStatusCard>

            {/* Approved Sessions */}
            <SessionsStatusCard sessions={sessions} sectionTitle='Approved Sessions' status='approved' statusTitle={<p className="text-green-500 font-medium mt-2">Status: Approved</p>} noStatus='Approved' message={<p className='text-green-500'>Your study sessions has been approved.</p>}></SessionsStatusCard>

            {/* Rejected Sessions */}
            <SessionsStatusCard sessions={sessions} sectionTitle='Rejected Sessions' status='rejected' statusTitle={<p className="text-red-500 font-medium mt">Status: Rejected</p>} noStatus='Rejected' message={<p className='text-red-500'>Your study sessions has been rejected!</p>}></SessionsStatusCard>
        </div>
    );
};

export default ViewAllSessions;