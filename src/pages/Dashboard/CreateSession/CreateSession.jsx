import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useForm } from "react-hook-form";

const CreateSession = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    // data.email=user.email
    // data.name=user.displayName
    // console.log(data);
  }
  return (
    <div className="max-w-4xl mx-auto p-10 bg-base-200 rounded-lg shadow-lg">
      <h1 className="text-xl md:text-3xl font-bold mb-6 text-center">Create Study Session</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Tutor Name */}
        <div>
          <label className="block text-lg font-medium mb-1">Tutor Name</label>
          <input
            type="text"
            defaultValue={user?.displayName}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            {...register('name')}
          />
        </div>

        {/* Tutor Email */}
        <div>
          <label className="block text-lg font-medium mb-1">Tutor Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            {...register('email')}
          />
        </div>

        {/* Session Title */}
        <div>
          <label className="block text-lg font-medium mb-1">Session Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter session title"
            className="input input-bordered w-full"
            {...register('title', { required: true })}
          />
        </div>

        {/* Registration Start Date */}
        <div>
          <label className="block text-lg font-medium mb-1">Registration Start Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            className="input input-bordered w-full"
            {...register('registrationStartDate', { required: true })}
          />
        </div>

        {/* Registration End Date */}
        <div>
          <label className="block text-lg font-medium mb-1">Registration End Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            className="input input-bordered w-full"
            {...register('registrationEndDate', { required: true })}
          />
        </div>

        {/* Class Start Date */}
        <div>
          <label className="block text-lg font-medium mb-1">Class Start Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            className="input input-bordered w-full"
            {...register('classStartDate', { required: true })}
          />
        </div>

        {/* Class End Date */}
        <div>
          <label className="block text-lg font-medium mb-1">Class End Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            className="input input-bordered w-full"
            {...register('classEndDate', { required: true })}
          />
        </div>

        {/* Session Duration */}
        <div>
          <label className="block text-lg font-medium mb-1">Session Duration<span className="text-red-500">*</span></label>
          <input
            type="number"
            placeholder="Enter session duration"
            className="input input-bordered w-full"
            {...register('sessionDuration', { required: true })}
          />
        </div>

        {/* Registration Fee */}
        <div>
          <label className="block text-lg font-medium mb-1">Registration Fee</label>
          <input
            type="text"
            defaultValue="0"
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            {...register('registrationFee')}
          />
        </div>

        {/* Image */}
        <div className="form-control w-full my-6">
          <label className="block text-lg font-medium mb-1">Session Image <span className="text-red-500">*</span></label>
          <input {...register('sessionImage', { required: true })} type="file" className="file-input w-full max-w-xs" />
        </div>

        {/* Session Description */}
        <div>
          <label className="block text-lg font-medium mb-1">Session Description <span className="text-red-500">*</span></label>
          <textarea
            placeholder="Enter session description"
            className="textarea textarea-bordered w-full"
            {...register('description', { required: true })}
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <input className="btn btn-primary w-full" type="submit" value="Create Session" />
        </div>
      </form>
    </div>
  );
};

export default CreateSession;