import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

const SessionsStatusCard = ({ sectionTitle, status, statusTitle, noStatus }) => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: sessions = [], refetch } = useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            const res = await axiosSecure(`/sessions/${user.email}`);
            return res.data;
        }
    });

    return (
        <div className="mb-20">
            <h2 className="text-2xl font-bold mb-10">{sectionTitle}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-fit">
                {sessions && sessions.length > 0 ? (
                    sessions
                        .filter((session) => session.status === status)
                        .map((session) => (
                            <div
                                key={session._id}
                                className="card shadow-lg p-4 bg-base-100 border space-y-2 hover:shadow-xl transition duration-300"
                            >
                                <img
                                    src={session.sessionImage}
                                    alt={`Image for session: ${session.title}`}
                                    className="rounded-lg"
                                />
                                <h3 className="font-bold text-lg">{session.title}</h3>
                                <p className="text-sm">
                                    <span className="underline">Description:</span> {session.description}
                                </p>
                                <p>
                                    Registration Start Date:{" "}
                                    {new Date(session.registrationStartDate)
                                        .toLocaleDateString("en-GB")
                                        .replace(/\//g, "-")}
                                </p>
                                <p>
                                    Registration End Date:{" "}
                                    {new Date(session.registrationEndDate)
                                        .toLocaleDateString("en-GB")
                                        .replace(/\//g, "-")}
                                </p>
                                <p>
                                    Class Start Date:{" "}
                                    {new Date(session.classStartDate)
                                        .toLocaleDateString("en-GB")
                                        .replace(/\//g, "-")}
                                </p>
                                <p>
                                    Class End Date:{" "}
                                    {new Date(session.classEndDate)
                                        .toLocaleDateString("en-GB")
                                        .replace(/\//g, "-")}
                                </p>
                                <p>Session Duration: {session.sessionDuration}</p>
                                <div className="flex items-center justify-between">
                                    <p>Registration Fee: ${session.registrationFee}</p>
                                    {statusTitle}
                                </div>
                                {status === 'rejected' && (
                                    <button
                                        className="btn btn-primary py-2"
                                    >
                                        Resend Approval
                                    </button>
                                )}
                            </div>
                        ))
                ) : (
                    <div className="text-center text-gray-500 col-span-full">
                        <p className="text-lg font-semibold">No {noStatus} Sessions Available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionsStatusCard;
