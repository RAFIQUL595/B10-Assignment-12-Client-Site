import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';

const ViewAllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [searchQuery, setSearchQuery] = useState("");
    const [role, setRole] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);

    // User fetch with search query
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users', searchQuery],
        queryFn: async () => {
            const url = searchQuery
                ? `/users/search?query=${searchQuery}`
                : '/users';
            const res = await axiosSecure.get(url);
            return res.data;
        },
        enabled: true,
    });

    // Pagination calculations
    const totalUsers = users.length;
    const totalPages = Math.ceil(totalUsers / postsPerPage);
    const currentUsers = users.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    // Ensure valid current page when total users change
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(totalPages, 1));
        }
    }, [totalUsers, totalPages, currentPage]);

    // Search Handle
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    // Role Update
    const handleRoleUpdate = async (userId) => {
        if (!role) {
            Swal.fire({
                title: "Warning",
                text: "Please select a role before updating.",
                icon: "warning",
                confirmButtonText: "Okay",
            });
            return;
        }

        const res = await axiosSecure.patch(`/users/role/${userId}`, { role });
        if (res.data.matchedCount > 0) {
            Swal.fire({
                title: "Success",
                text: `Role updated to ${role}`,
                icon: "success",
                confirmButtonText: "Okay",
            });
            setRole("");
            refetch();
        }
    };

    return (
        <div className='my-10'>
            <Helmet>
                <title>View All Users | Study Platform</title>
            </Helmet>
            <SectionTitle heading='View All Users'></SectionTitle>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='text-lg font-bold'>
                    All Users: <span className='bg-blue-300 text-white px-2 py-1 rounded-[50%]'>{users.length}</span>
                </h1>
                <div>
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        className="border px-3 py-1 rounded"
                        onChange={handleSearch}
                        value={searchQuery}
                    />
                </div>
            </div>

            <div className="overflow-x-auto my-10">
                <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-2 border border-gray-200">#</th>
                            <th className="px-4 py-2 border border-gray-200">Image</th>
                            <th className="px-4 py-2 border border-gray-200">Name</th>
                            <th className="px-4 py-2 border border-gray-200">Email</th>
                            <th className="px-4 py-2 border border-gray-200">Role</th>
                            <th className="px-4 py-2 border border-gray-200">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr
                                key={user._id}
                                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-gray-100`}
                            >
                                <td className="px-4 py-2 border border-gray-200 text-center">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-2 border border-gray-200 flex justify-center">
                                    <img
                                        src={user.image}
                                        alt={`${user.name}'s avatar`}
                                        className="w-10 h-10 rounded-full"
                                    />
                                </td>
                                <td className="px-4 py-2 border border-gray-200 text-center">{user.name}</td>
                                <td className="px-4 py-2 border border-gray-200 text-center">{user.email}</td>
                                <td className="px-4 py-2 border border-gray-200 text-center">{user.role}</td>
                                <td className="px-4 py-2 border border-gray-200 text-center">
                                    <div className="flex justify-center gap-2">
                                        <select onChange={(e) => setRole(e.target.value)} className="px-3 py-1 text-sm border rounded">
                                            <option value="">Select Role</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Tutor">Tutor</option>
                                            <option value="Student">Student</option>
                                        </select>
                                        <button
                                            onClick={() => handleRoleUpdate(user._id)}
                                            className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition disabled:opacity-50"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 bg-gray-200 rounded-md font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition disabled:opacity-50"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ViewAllUsers;