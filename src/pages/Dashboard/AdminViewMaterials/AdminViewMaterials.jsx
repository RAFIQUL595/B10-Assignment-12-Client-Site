import React from 'react';
import { Helmet } from 'react-helmet-async';
import MaterialsCard from '../../../components/MaterialsCard/MaterialsCard';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminViewMaterials = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch all materials data
    const { data: materials = [], refetch } = useQuery({
        queryKey: ['materials'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/viewAllMaterials`);
            return res.data;
        },
    });

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
        <div className="my-10">
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
                SessionId={(material) => <p>SessionId: {material?.sessionId}</p>}
                tutorInfo={(material) => <p><Link to={material.googleDrive} target="_blank">
                    <span className='font-bold underline'>Material Link</span>
                </Link></p>}
                button={(material) => (
                    <div className="card-actions justify-between">
                        <button
                            className="btn btn-error btn-sm"
                            onClick={() => handleDeleteMaterials(material._id)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            />
        </div>
    );
};

export default AdminViewMaterials;