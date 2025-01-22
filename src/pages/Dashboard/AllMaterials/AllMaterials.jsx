import React from 'react';
import SectionTitle from './../../../components/SectionTitle/SectionTitle';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from './../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import MaterialsCard from '../../../components/MaterialsCard/MaterialsCard';

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

    const handleDeleteMaterials = (id) => {
        console.log('Delete material with id:', id);
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