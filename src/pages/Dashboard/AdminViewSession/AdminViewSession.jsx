import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import SessionsStatusCard from '../../Shared/SessionsStatus/SessionsStatusCard';
import Swal from 'sweetalert2';

const AdminViewSession = () => {
    const axiosSecure = useAxiosSecure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('free');
    const [amount, setAmount] = useState(0);

    // Get all sessions data
    const { data: sessions = [], refetch } = useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/adminViewSessions`);
            return res.data;
        }
    });

    // Handle Approve Button
    const handleApprove = (sessionId) => {
        setSelectedSession(sessionId);
        setIsModalOpen(true);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPaymentStatus('free');
        setAmount(0);
    };

    // Handle Payment Status change
    const handlePaymentStatusChange = (status) => {
        setPaymentStatus(status);
        if (status === 'free') {
            setAmount(0);
        }
    };

    // Handle Approval Submission
    const handleApproveSubmit = async () => {
        const updatedSession = {
            status: 'approved',
            registrationFee: paymentStatus === 'paid' ? amount : "0",
        };

        if (isNaN(updatedSession.registrationFee) || updatedSession.registrationFee < 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please enter a valid amount.",
            });
            return;
        }

        const res = await axiosSecure.patch(`/sessionsApproved/${selectedSession}`, updatedSession);
        if (res.data.matchedCount > 0) {
            Swal.fire({
                title: "Success",
                text: "Session approved successfully.",
                icon: "success",
                confirmButtonText: "Okay",
            });
            refetch();
        }
        handleCloseModal();
    };

    return (
        <div>
            <Helmet>
                <title>View All Study Sessions | Study Platform</title>
            </Helmet>
            <SectionTitle heading="View All Study Sessions" />

            {/* Pending Sessions */}
            <SessionsStatusCard
                sectionTitle="Pending Sessions"
                status="pending"
                sessions={sessions.filter((s) => s.status === 'pending')}
                actions={(session) => (
                    <div className="flex justify-between">
                        <button
                            className="btn btn-success mr-2"
                            onClick={() => handleApprove(session._id)}
                        >
                            Approve
                        </button>
                        <button
                            className="btn btn-danger"
                        >
                            Reject
                        </button>
                    </div>
                )}
                message={<p className='text-orange-400'>Study sessions has been pending!</p>}
            ></SessionsStatusCard>

            {/* Approved Sessions */}
            <SessionsStatusCard
                sectionTitle="Approved Sessions"
                status="approved"
                sessions={sessions.filter((s) => s.status === 'approved')}
                message={<p className='text-green-500'>Study sessions has been approved.</p>}
            ></SessionsStatusCard>

            {/* Rejected Sessions */}
            <SessionsStatusCard
                sectionTitle="Rejected Sessions"
                status="rejected"
                sessions={sessions.filter((s) => s.status === 'rejected')}
                message={<p className='text-red-500'>Study sessions has been rejected!</p>}
            ></SessionsStatusCard>

            {/* Approval Modal */}
            {isModalOpen && (
                <dialog id="approval-modal" open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Approve Session</h3>
                        <p>Is the session free or paid?</p>
                        <div className="flex items-center mt-4">
                            <label className="mr-2">
                                <input
                                    type="radio"
                                    name="paymentStatus"
                                    value="free"
                                    checked={paymentStatus === 'free'}
                                    onChange={() => handlePaymentStatusChange('free')}
                                />
                                Free
                            </label>
                            <label className="ml-4">
                                <input
                                    type="radio"
                                    name="paymentStatus"
                                    value="paid"
                                    checked={paymentStatus === 'paid'}
                                    onChange={() => handlePaymentStatusChange('paid')}
                                />
                                Paid
                            </label>
                        </div>

                        {paymentStatus === 'paid' && (
                            <div className="mt-4">
                                <label htmlFor="amount">Amount</label>
                                <input
                                    type="number"
                                    value={amount}
                                    min="0"
                                    className="input input-bordered w-full mt-2"
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleApproveSubmit}
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default AdminViewSession;