import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const StudyMaterials = () => {
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const axiosSecure = useAxiosSecure();

    // Get all booked sessions data
    const { data: bookedSessions = [] } = useQuery({
        queryKey: ['bookedSessions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/viewBookedSessions');
            return res.data;
        }
    });

    // Get all study materials data
    const { data: materials = [] } = useQuery({
        queryKey: ['studyMaterials'],
        queryFn: async () => {
            const res = await axiosSecure.get('/getStudyMaterials');
            return res.data;
        }
    });

    // Handle session click to filter materials by session ID
    const handleSessionClick = (sessionId) => {
        setSelectedSessionId(sessionId);
        const sessionMaterials = materials.filter(
            (material) => material.sessionId === sessionId
        );
        setFilteredMaterials(sessionMaterials);
    };

    // Handle downloading of images
    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop();
        link.click();
    };

    return (
        <div className="p-4">
            {/* Display all booked sessions */}
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">Booked Sessions</h2>
                <div className="space-y-2 mt-2">
                    {bookedSessions.length > 0 ? (
                        bookedSessions.map((session) => (
                            <button
                                key={session._id}
                                className="btn btn-primary w-full"
                                onClick={() => handleSessionClick(session._id)}
                            >
                                View Materials
                            </button>
                        ))
                    ) : (
                        <p>No booked sessions found.</p>
                    )}
                </div>
            </div>

            {/* Display materials for selected session */}
            {selectedSessionId && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Materials for this Session</h3>
                    <div className="space-y-4 mt-2">
                        {filteredMaterials.length > 0 ? (
                            filteredMaterials.map((material) => (
                                <div key={material._id} className="card bg-base-100 shadow-xl p-4">
                                    <h4 className="text-lg font-semibold">{material.title}</h4>

                                    {/* Image and download button */}
                                    {material.image && (
                                        <div>
                                            <img
                                                src={material.image}
                                                alt={material.title}
                                                className="w-full h-auto"
                                            />
                                            <button
                                                onClick={() => handleDownload(material.image)}
                                                className="btn btn-accent mt-2"
                                            >
                                                Download Image
                                            </button>
                                        </div>
                                    )}

                                    {/* Google Drive link */}
                                    {material.link && (
                                        <div className="mt-2">
                                            <a
                                                href={material.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-link"
                                            >
                                                Visit Google Drive Link
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No materials available for this session.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyMaterials;