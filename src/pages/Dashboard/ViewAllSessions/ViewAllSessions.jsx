import React from 'react';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import SessionsStatusCard from '../../Shared/SessionsStatus/SessionsStatusCard';

const ViewAllSessions = () => {

    return (
        <div className="md:p-6">
            <SectionTitle heading='View All Study Sessions'></SectionTitle>

            {/* Pending Sessions */}
            <SessionsStatusCard sectionTitle='Pending Sessions' status='pending' statusTitle={<p className="text-orange-400 font-medium mt-2">Status: Pending</p>} noStatus='Pending'></SessionsStatusCard>

            {/* Approved Sessions */}
            <SessionsStatusCard sectionTitle='Approved Sessions' status='approved' statusTitle={<p className="text-green-500 font-medium mt-2">Status: Approved</p>} noStatus='Approved'></SessionsStatusCard>

            {/* Rejected Sessions */}
            <SessionsStatusCard sectionTitle='Rejected Sessions' status='rejected' statusTitle={<p className="text-red-500 font-medium mt">Status: Rejected</p>} noStatus='Rejected'></SessionsStatusCard>
        </div>
    );
};

export default ViewAllSessions;