import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AdminViewSession = () => {
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('free');
    const [amount, setAmount] = useState(0);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [feedback, setFeedback] = useState('');
    const [selectedUpdate, setSelectedUpdate] = useState(null);

    const { register, handleSubmit, reset } = useForm();


    // Get all sessions data
    const { data: sessions = [], refetch } = useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/adminViewSessions`);
            return res.data;
        }
    });


    const handleOpenModal = (session) => {
        reset(session);
        setSelectedUpdate(session);
    };

    // Submit material update
    const onSubmit = async (data) => {
        let imageUrl = selectedUpdate?.sessionImage;
        if (data.sessionImage && data.sessionImage.length > 0) {
            const formData = new FormData();
            formData.append('image', data.sessionImage[0]);
            const res = await axiosPublic.post(image_hosting_api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                imageUrl = res.data.data.display_url;
            } else {
                toast.error('Image upload failed. Please try again.');
                return;
            }
        }

        const sessionData = {
            title: data?.title,
            registrationStartDate: data?.registrationStartDate,
            registrationEndDate: data?.registrationEndDate,
            classStartDate: data?.classStartDate,
            classEndDate: data?.classEndDate,
            sessionDuration: data?.sessionDuration,
            registrationFee: data?.registrationFee,
            sessionImage: imageUrl,
            description: data?.description,
        };

        // Send the session data update request
        const sessionRes = await axiosSecure.patch(`/updateSession/${selectedUpdate._id}`, sessionData);
        if (sessionRes.data.matchedCount > 0) {
            setSelectedUpdate(null);
            Swal.fire({
                title: 'Session Updated Successfully!',
                icon: 'success',
            });
            refetch();
        } else {
            toast.error('Failed to update session. Please try again.');
        }
    };

    // Handle Approve Button
    const handleApprove = (sessionId) => {
        setSelectedSession(sessionId);
        setIsModalOpen(true);
    };

    // Handle Reject Button
    const handleReject = (sessionId) => {
        setSelectedSession(sessionId);
        setIsRejectModalOpen(true);
    };

    // Handle modal close
    const handleCloseRejectModal = () => {
        setIsRejectModalOpen(false);
        setRejectionReason('');
        setFeedback('');
    };

    // Handle rejection submission
    const handleRejectSubmit = async () => {
        if (!rejectionReason.trim() || !feedback.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please provide both rejection reason and feedback.',
            });
            return;
        }

        const rejectedData = {
            status: 'rejected',
            rejectionReason,
            feedback,
        };

        const res = await axiosSecure.patch(`/sessionsReject/${selectedSession}`, rejectedData);
        if (res.data.matchedCount > 0) {
            Swal.fire({
                title: 'Rejected!',
                text: 'The session has been rejected successfully.',
                icon: 'success',
            });
            refetch();
        }
        handleCloseRejectModal();
    };

    // Handle modal close
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPaymentStatus('free');
        setAmount(0);
        setSelectedUpdate(null);
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

    // Handel Delete
    const handleDelete = async (id) => {
        // Show confirmation dialog first
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be deleted this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            // Proceed with delete if user confirms
            const response = await axiosSecure.delete(`/sessionDelete/${id}`);
            // Validate response
            if (response.data.deletedCount > 0) {
                Swal.fire({
                    title: "Deleted!",
                    text: "The session has been deleted.",
                    icon: "success"
                });
                refetch()
            } else {
                toast.error("Deletion failed. No records were deleted.");
            }
        }
    }

    return (
        <div className='my-10'>
            <Helmet>
                <title>View All Study Sessions | Study Platform</title>
            </Helmet>
            <SectionTitle heading="View All Study Sessions" />

            {/* Pending Sessions Table */}
            <h3 className="text-lg font-semibold mt-4">Pending Sessions: <span className='bg-blue-300 text-white px-2 py-1 rounded-[50%]'>{sessions.filter((s) => s.status === 'pending').length}</span></h3>
            <div className="overflow-x-auto">
                {sessions.filter((s) => s.status === 'pending').length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No sessions pending</p>
                ) : (
                    <table className="min-w-full border-collapse border border-gray-200 rounded-lg mt-4">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="px-4 py-2 border border-gray-200">#</th>
                                <th className="px-4 py-2 border border-gray-200">Image</th>
                                <th className="px-4 py-2 border border-gray-200">Name</th>
                                <th className="px-4 py-2 border border-gray-200">Email</th>
                                <th className="px-4 py-2 border border-gray-200">Status</th>
                                <th className="px-4 py-2 border border-gray-200">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.filter((s) => s.status === 'pending').map((session, index) => (
                                <tr
                                    key={session._id}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                                >
                                    <td className="px-4 py-2 border border-gray-200 text-center">{index + 1}</td>
                                    <td className="px-4 py-2 border border-gray-200 flex justify-center">
                                        <img
                                            src={session.sessionImage}
                                            alt={`${session.tutorName}'s avatar`}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">{session.tutorName}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">{session.tutorEmail}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-center text-yellow-400">Pending</td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                                                onClick={() => handleApprove(session._id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                                                onClick={() => handleReject(session._id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


            {/* Approved Sessions Table */}
            <h3 className="text-lg font-semibold mt-8">Approved Sessions: <span className='bg-blue-300 text-white px-2 py-1 rounded-[50%]'>{sessions.filter((s) => s.status === 'approved').length}</span></h3>
            <div className="overflow-x-auto">
                {sessions.filter((s) => s.status === 'approved').length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No sessions approved</p>
                ) : (
                    <table className="min-w-full border-collapse border border-gray-200 rounded-lg mt-4">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="px-4 py-2 border border-gray-200">#</th>
                                <th className="px-4 py-2 border border-gray-200">Image</th>
                                <th className="px-4 py-2 border border-gray-200">Name</th>
                                <th className="px-4 py-2 border border-gray-200">Email</th>
                                <th className="px-4 py-2 border border-gray-200">Status</th>
                                <th className="px-4 py-2 border border-gray-200">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.filter((s) => s.status === 'approved').map((session, index) => (
                                <tr
                                    key={session._id}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                                >
                                    <td className="px-4 py-2 border border-gray-200 text-center">{index + 1}</td>
                                    <td className="px-4 py-2 border border-gray-200 flex justify-center">
                                        <img
                                            src={session.sessionImage}
                                            alt={`${session.tutorName}'s avatar`}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">{session.tutorName}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">{session.tutorEmail}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-center text-green-500">Approved</td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                                                onClick={() => handleOpenModal(session)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                                                onClick={() => handleDelete(session._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Rejected Sessions Table */}
            <h3 className="text-lg font-semibold mt-8">Rejected Sessions: <span className='bg-blue-300 text-white px-2 py-1 rounded-[50%]'>{sessions.filter((s) => s.status === 'rejected').length}</span></h3>
            <div className="overflow-x-auto">
                {sessions.filter((s) => s.status === 'rejected').length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No sessions rejected</p>
                ) : (
                    <table className="min-w-full border-collapse border border-gray-200 rounded-lg mt-4">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="px-4 py-2 border border-gray-200">#</th>
                                <th className="px-4 py-2 border border-gray-200">Image</th>
                                <th className="px-4 py-2 border border-gray-200">Name</th>
                                <th className="px-4 py-2 border border-gray-200">Email</th>
                                <th className="px-4 py-2 border border-gray-200">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.filter((s) => s.status === 'rejected').map((session, index) => (
                                <tr
                                    key={session._id}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                                >
                                    <td className="px-4 py-2 border border-gray-200 text-center">{index + 1}</td>
                                    <td className="px-4 py-2 border border-gray-200 flex justify-center">
                                        <img
                                            src={session.sessionImage}
                                            alt={`${session.tutorName}'s avatar`}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">{session.tutorName}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-center">{session.tutorEmail}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-center text-red-500">Rejected</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

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

            {/* Rejection Modal */}
            {isRejectModalOpen && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Reject Session</h3>
                        <div className="mt-4">
                            <label className="block mb-2 font-semibold">Rejection Reason</label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="textarea textarea-bordered w-full"
                                placeholder="Enter the reason for rejection"
                            ></textarea>
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2 font-semibold">Feedback</label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="textarea textarea-bordered w-full"
                                placeholder="Provide additional feedback"
                            ></textarea>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={handleCloseRejectModal}>
                                Close
                            </button>
                            <button className="btn btn-error" onClick={handleRejectSubmit}>
                                Reject
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* Update Modal */}
            {selectedUpdate && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <SectionTitle heading="Update Session" />
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* Tutor Name */}
                            <div>
                                <label htmlFor="tutorName" className="block text-lg font-medium mb-1">Tutor Name</label>
                                <input
                                    id="tutorName"
                                    type="text"
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                                    {...register('tutorName')}
                                    tabIndex="-1"
                                />
                            </div>

                            {/* Tutor Email */}
                            <div>
                                <label htmlFor="tutorEmail" className="block text-lg font-medium mb-1">Tutor Email</label>
                                <input
                                    id="tutorEmail"
                                    type="email"
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                                    {...register('tutorEmail')}
                                    tabIndex="-1"
                                />
                            </div>

                            {/* Session Title */}
                            <div>
                                <label htmlFor="title" className="block text-lg font-medium mb-1">Session Title </label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Enter session title"
                                    className="input input-bordered w-full"
                                    {...register('title')}
                                />
                            </div>

                            {/* Registration Start Date */}
                            <div>
                                <label htmlFor="registrationStartDate" className="block text-lg font-medium mb-1">Registration Start Date</label>
                                <input
                                    id="registrationStartDate"
                                    type="date"
                                    className="input input-bordered w-full"
                                    {...register('registrationStartDate')}
                                />
                            </div>

                            {/* Registration End Date */}
                            <div>
                                <label htmlFor="registrationEndDate" className="block text-lg font-medium mb-1">Registration End Date</label>
                                <input
                                    id="registrationEndDate"
                                    type="date"
                                    className="input input-bordered w-full"
                                    {...register('registrationEndDate')}
                                />
                            </div>

                            {/* Class Start Date */}
                            <div>
                                <label htmlFor="classStartDate" className="block text-lg font-medium mb-1">Class Start Date</label>
                                <input
                                    id="classStartDate"
                                    type="date"
                                    className="input input-bordered w-full"
                                    {...register('classStartDate')}
                                />
                            </div>

                            {/* Class End Date */}
                            <div>
                                <label htmlFor="classEndDate" className="block text-lg font-medium mb-1">Class End Date</label>
                                <input
                                    id="classEndDate"
                                    type="date"
                                    className="input input-bordered w-full"
                                    {...register('classEndDate')}
                                />
                            </div>

                            {/* Session Duration */}
                            <div>
                                <label htmlFor="sessionDuration" className="block text-lg font-medium mb-1">Session Duration</label>
                                <input
                                    id="sessionDuration"
                                    type="text"
                                    placeholder="Enter session duration e.g., (0 hours 0 minutes)"
                                    className="input input-bordered w-full"
                                    {...register('sessionDuration')}
                                />
                            </div>

                            {/* Registration Fee */}
                            <div>
                                <label htmlFor="registrationFee" className="block text-lg font-medium mb-1">Registration Fee</label>
                                <input
                                    id="registrationFee"
                                    type="text"
                                    className="input input-bordered w-full"
                                    {...register('registrationFee')}
                                    tabIndex="-1"
                                />
                            </div>

                            {/* Image */}
                            <div className="form-control w-full my-6">
                                <label htmlFor="sessionImage" className="block text-lg font-medium mb-1">Session Image</label>
                                <input
                                    id="sessionImage"
                                    {...register('sessionImage')}
                                    type="file"
                                    className="file-input file-input-bordered w-full"
                                />
                            </div>

                            {/* Session Description */}
                            <div>
                                <label htmlFor="description" className="block text-lg font-medium mb-1">Session Description</label>
                                <textarea
                                    id="description"
                                    placeholder="Enter session description"
                                    className="textarea textarea-bordered w-full"
                                    {...register('description')}
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="text-center">
                                <input className="btn btn-primary w-full" type="submit" value="Update Session" />
                            </div>
                        </form>
                        <div className="modal-action">
                            <label htmlFor="session-modal" onClick={handleCloseModal} className="btn">Close</label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminViewSession;