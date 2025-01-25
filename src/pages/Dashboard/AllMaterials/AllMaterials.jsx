import React, { useState } from 'react';
import SectionTitle from './../../../components/SectionTitle/SectionTitle';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from './../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import MaterialsCard from '../../../components/MaterialsCard/MaterialsCard';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { useForm } from 'react-hook-form';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AllMaterials = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const { register, handleSubmit } = useForm();

    // Get all materials data
    const { data: materials = [], refetch } = useQuery({
        queryKey: ['materials'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/viewAllMaterials/${user.email}`);
            return res.data;
        },
    });

    const handleOpenModal = (material) => {
        setSelectedMaterial(material);
    };

    const handleCloseModal = () => {
        setSelectedMaterial(null);
    };

    // Submit material update
    const onSubmit = async (data) => {
            let imageUrl = selectedMaterial?.image;
            if (data.image.length > 0) {
                const formData = new FormData();
                formData.append('image', data.image[0]);

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

            const materialData = {
                title: data.title,
                image: imageUrl,
                googleDrive: data.googleDrive,
                uploadTime: new Date().toLocaleTimeString(),
            };

            const materialRes = await axiosSecure.patch(`/updateMaterial/${data.sessionId}`, materialData);
            if (materialRes.data.modifiedCount) {
                setSelectedMaterial(null);
                Swal.fire({
                    title: 'Material Updated Successfully!',
                    icon: 'success',
                });
                refetch();
            } else {
                toast.error('Failed to update material. Please try again.');
            }
    };

    // Handle material delete
    const handleDeleteMaterials = async (id) => {
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
            const response = await axiosSecure.delete(`/deleteMaterial/${id}`);
            // Validate response
            if (response.data.deletedCount > 0) {
                Swal.fire({
                    title: "Deleted!",
                    text: "The material has been deleted.",
                    icon: "success"
                });
                refetch()
            } else {
                toast.error("Deletion failed. No records were deleted.");
            }
        }
    };

    return (
        <div>
            <Helmet>
                <title>View All Materials | Study Platform</title>
            </Helmet>
            <SectionTitle heading="View All Uploaded Materials" />
            <MaterialsCard
                materials={materials}
                noMaterials="No materials uploaded yet."
                image={(material) => (
                    <figure>
                        <img
                            src={material.image}
                            alt={material.title}
                            className="w-full h-48 object-cover"
                        />
                    </figure>
                )}
                tutorInfo={(material) => <p>Google Drive: {material.googleDrive}</p>}
                button={(material) => (
                    <div className="card-actions justify-between">
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleOpenModal(material)}
                        >
                            Update
                        </button>
                        <button
                            className="btn btn-error btn-sm"
                            onClick={() => handleDeleteMaterials(material._id)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            >
            </MaterialsCard >
            {selectedMaterial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <SectionTitle heading="Update Materials"></SectionTitle>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-lg font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    defaultValue={selectedMaterial?.title}
                                    className="input input-bordered w-full"
                                    {...register('title')}
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-1">Study Session ID</label>
                                <input
                                    type="text"
                                    defaultValue={selectedMaterial?._id}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                    {...register('sessionId')}
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-1">Tutor Email</label>
                                <input
                                    type="email"
                                    defaultValue={selectedMaterial?.tutorEmail}
                                    readOnly
                                    className="input input-bordered w-full bg-gray-100"
                                    {...register('tutorEmail')}
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-1">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full"
                                    {...register('image')}
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-1">
                                    Google Drive Link
                                </label>
                                <input
                                    type="url"
                                    placeholder="Enter Google Drive link"
                                    defaultValue={selectedMaterial?.googleDrive}
                                    className="input input-bordered w-full"
                                    {...register('googleDrive')}
                                />
                            </div>

                            <div>
                                <button type="submit" className="btn btn-success w-full">
                                    Submit Update
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline btn-danger w-full mt-2"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllMaterials;