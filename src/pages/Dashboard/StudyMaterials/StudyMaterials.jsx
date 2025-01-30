import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import useAuth from '../../../hooks/useAuth';

const StudyMaterials = () => {
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    // Get all booked sessions data
    const { data: bookedSessions = [] } = useQuery({
        queryKey: ['bookedSessions'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/viewBookedSessions/${user.email}`);
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
    const handleOpenModal = (sessionId) => {
        const sessionMaterials = materials.filter(
            (material) => material.sessionId === sessionId
        );
        setFilteredMaterials(sessionMaterials);

        // Open the modal
        document.getElementById('materialModal').showModal();
    };

    const handleCloseModal = () => {
        // Close the modal
        document.getElementById('materialModal').close();
    };

    // Handle downloading of images
    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop();
        link.click();
    };

    return (
        <div className="p-4 my-10">
            {/* Display all booked sessions */}
            <div className="mb-4">
                <SectionTitle heading="Booked Session Materials" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {bookedSessions.length > 0 ? (
                        bookedSessions.map((session) => (
                            <div key={session._id} className="card bg-base-100 shadow-xl">
                                <figure>
                                    <img
                                        src={session.sessionImage}
                                        alt={session.title}
                                        className="w-full h-48 object-cover"
                                    />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">{session.title}</h2>
                                    <p>{session.description}</p>
                                    <div className="card-actions justify-center">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleOpenModal(session.sessionId)}
                                        >
                                            View Materials
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No booked sessions found.</p>
                    )}
                </div>
            </div>

            {/* Modal */}
            <dialog id="materialModal" className="modal">
                <div className="modal-box">
                    <SectionTitle heading='Materials for Session'></SectionTitle>
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
                                    {material.googleDrive && (
                                        <div className="mt-2">
                                            <a
                                                href={material.googleDrive}
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
                    <div className="modal-action">
                        <button className="btn" onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default StudyMaterials;