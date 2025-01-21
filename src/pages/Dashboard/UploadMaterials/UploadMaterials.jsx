import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import UploadModal from '../../../components/SectionTitle/UploadModal/UploadModal';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UploadMaterials = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // Fetch study materials
    const { data: materials = [], refetch } = useQuery({
        queryKey: ['materials'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tutorSessions/${user?.email}`);
            return res.data;
        },
    });

    const handleOpenModal = (material) => {
        setSelectedMaterial(material);
    };

    const handleCloseModal = () => {
        setSelectedMaterial(null);
    };

    const onSubmit = async (data) => {
        const imageFile = { image: data.image[0] };
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        });

        if (res.data.success) {
            const imageUrl = res.data.data.display_url;

            const materialData = {
                title: data.title,
                sessionId: data.sessionId,
                tutorEmail: data.tutorEmail,
                image: imageUrl,
                googleDrive: data.googleDrive,
            };

            const materialRes = await axiosSecure.post('/uploadMaterial', materialData);
            if (materialRes.data.insertedId) {
                setSelectedMaterial(null);
                Swal.fire({
                    title: 'Material Uploaded Successfully!',
                    icon: 'success',
                });
                refetch();
            } else {
                toast.error('Failed to upload material. Please try again.');
            }
        } else {
            toast.error('Image upload failed. Please try again.');
        }
    };

    return (
        <div className="p-6 bg-base-200 rounded-lg shadow-lg">
            <Helmet>
                <title>Upload Materials | Study Platform</title>
            </Helmet>
            <SectionTitle heading="Upload Study Materials" />

            {/* Materials Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => (
                    <div
                        key={material._id}
                        className="card card-compact bg-base-100 shadow-xl"
                    >
                        <figure>
                            <img
                                src={material.sessionImage}
                                alt={material.title}
                                className="w-full h-48 object-cover"
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">{material.title}</h2>
                            <p className="text-[16px]">Tutor Name: {material.tutorName}</p>
                            <div className="card-actions justify-center">
                                <button
                                    className="btn btn-outline btn-primary"
                                    onClick={() => handleOpenModal(material)}
                                >
                                    Upload Materials
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedMaterial && (
                <UploadModal
                    selectedMaterial={selectedMaterial}
                    onSubmit={onSubmit}
                    handleCloseModal={handleCloseModal}>
                </UploadModal>
            )}
        </div>
    );
};

export default UploadMaterials;
