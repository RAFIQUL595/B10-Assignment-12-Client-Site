import React from 'react';
import { useForm } from 'react-hook-form';
import SectionTitle from '../SectionTitle/SectionTitle';


const UploadModal = ({ selectedMaterial, onSubmit, handleCloseModal, }) => {
    const { register, handleSubmit, formState: { errors }, } = useForm();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <SectionTitle heading="Upload Materials"></SectionTitle>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-lg font-medium mb-1">Title<span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            {...register('title', { required: true })}
                        />
                        {errors.title && (
                            <span className="text-red-600">Session Title is required</span>
                        )}
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
                        {errors.sessionId && (
                            <span className="text-red-600">Study Session ID is required</span>
                        )}
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
                        {errors.tutorEmail && (
                            <span className="text-red-600">Tutor Email is required</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-lg font-medium mb-1">
                            Upload Image<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            className="file-input file-input-bordered w-full"
                            {...register('image', { required: true })}
                        />
                        {errors.image && (
                            <span className="text-red-600">Upload Image is required</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-lg font-medium mb-1">
                            Google Drive Link<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            placeholder="Enter Google Drive link"
                            className="input input-bordered w-full"
                            {...register('googleDrive', { required: true })}
                        />
                        {errors.googleDrive && (
                            <span className="text-red-600">Google Drive Link is required</span>
                        )}
                    </div>

                    <div>
                        <button type="submit" className="btn btn-success w-full">
                            Submit Material
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
    );
};

export default UploadModal;
