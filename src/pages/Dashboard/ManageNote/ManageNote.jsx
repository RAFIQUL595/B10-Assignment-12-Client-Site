import React, { useState } from "react";
import Swal from "sweetalert2";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const ManageNote = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();
    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const axiosPublic = useAxiosPublic();

    // Get all sessions data
    const { data: notes = [], refetch } = useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/viewNote/${user.email}`);
            return res.data;
        }
    });

    // Handle delete
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to recover this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            // Proceed with delete if user confirms
            const response = await axiosSecure.delete(`/deleteNote/${id}`);
            // Validate response
            if (response.data.deletedCount > 0) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your note has been deleted.",
                    icon: "success"
                });
                refetch();
            } else {
                toast.error("Deletion failed. No records were deleted.");
            }
        }
    };

    // Handle update - open modal
    const handleOpenModal = (note) => {
        setSelectedNote(note);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNote(null);
    };

    const onSubmit = async (data) => {
        const { description, title } = data;
        const updateData = { description, title };

        // Check if the current values are different from the original ones
        const isDataChanged = description !== selectedNote.description || title !== selectedNote.title;

        // If there's no change, still proceed with the update
        const res = await axiosPublic.patch(`/updateNote/${selectedNote._id}`, updateData);

        if (res.data.modifiedCount > 0 || !isDataChanged) {
            Swal.fire({
                title: "Updated!",
                text: "Your note has been updated.",
                icon: "success"
            });
            refetch();
            closeModal();
        } else {
            toast.error("Update failed. Please try again.")
        }
    };

    return (
        <div className="my-10">
            <SectionTitle heading="Manage Personal Notes"></SectionTitle>
            {notes.length === 0 ? (
                <p className="text-lg font-bold">No notes available</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notes.map((note) => (
                        <div key={note._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body border rounded-xl">
                                <h2 className="card-title">Title: {note?.title}</h2>
                                <p>Email: {note?.email}</p>
                                <p>Description: {note?.description}</p>
                                <div className="card-actions justify-between">
                                    <button
                                        onClick={() => handleOpenModal(note)}
                                        className="btn btn-primary"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="btn btn-error"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Update */}
            {isModalOpen && selectedNote && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <SectionTitle heading="Update Note"></SectionTitle>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            
                            {/* Title */}
                            <div className="mb-4">
                                <label className="block text-lg">Title</label>
                                <input
                                    type="text"
                                    defaultValue={selectedNote.title}
                                    className="input input-bordered w-full"
                                    {...register('title')}
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className="block text-lg">Description</label>
                                <textarea
                                    defaultValue={selectedNote.description}
                                    className="textarea textarea-bordered w-full"
                                    {...register('description')}
                                />
                            </div>

                            {/* Update and close button */}
                            <div className="modal-action flex justify-between">
                                <button className="btn btn-primary">
                                    Update Note
                                </button>
                                <button className="btn" onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageNote;