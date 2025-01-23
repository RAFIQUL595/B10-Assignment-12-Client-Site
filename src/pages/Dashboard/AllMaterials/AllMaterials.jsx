import React from 'react';
import SectionTitle from './../../../components/SectionTitle/SectionTitle';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from './../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import MaterialsCard from '../../../components/MaterialsCard/MaterialsCard';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const AllMaterials = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Get all materials data
    const { data: materials = [], refetch } = useQuery({
        queryKey: ['materials'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/viewAllMaterials/${user.email}`);
            return res.data;
        },
    });

    const handleUpdateMaterials = (id) => {
        console.log('Update material with id:', id);
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
            <SectionTitle heading="Uploaded Materials" />
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
                tutorInfo={(material) => <p>Tutor Email: {material.tutorEmail}</p>}
                button={(material) => (
                    <div className="card-actions justify-between">
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleUpdateMaterials(material._id)}
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
        </div>
    );
};

export default AllMaterials;