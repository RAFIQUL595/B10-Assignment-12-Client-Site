import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useForm } from "react-hook-form";
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import SectionTitle from '../../../components/SectionTitle/SectionTitle';
import { Helmet } from 'react-helmet-async';


const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const CreateSession = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    // image upload to imgbb and then get an url
    const formData = new FormData();
    formData.append('image', data.sessionImage[0]);

    const res = await axiosPublic.post(image_hosting_api, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });

    if (res?.data?.success) {
      const sessionData = {
        tutorName: user?.displayName,
        tutorEmail: user?.email,
        title: data?.title,
        registrationStartDate: data?.registrationStartDate,
        registrationEndDate: data?.registrationEndDate,
        classStartDate: data?.classStartDate,
        classEndDate: data?.classEndDate,
        sessionDuration: data?.sessionDuration,
        registrationFee: data?.registrationFee,
        sessionImage: res?.data?.data?.display_url,
        description: data?.description,
        status: "pending"
      };

      const sessionRes = await axiosSecure.post('/session', sessionData);
      if (sessionRes.data.insertedId) {
        // show success popup
        reset();
        Swal.fire({
          title: "Session Create Successfully!",
          icon: "success",
          draggable: true
        });
      }
      else {
        toast.error(res.data.error);
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-10 bg-base-200 rounded-lg shadow-lg">
      <Helmet>
        <title>Create Study Session | Study Platform</title>
      </Helmet>
      <SectionTitle heading='Create Study Session'></SectionTitle>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Tutor Name */}
        <div>
          <label className="block text-lg font-medium mb-1">Tutor Name</label>
          <input
            type="text"
            defaultValue={user?.displayName}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            {...register('tutorName')}
          />
          {errors.tutorName && <span className="text-red-600">Tutor Name is required</span>}
        </div>

        {/* Tutor Email */}
        <div>
          <label className="block text-lg font-medium mb-1">Tutor Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            {...register('tutorEmail')}
          />
          {errors.tutorEmail && <span className="text-red-600">Tutor Email is required</span>}
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
          {errors.title && <span className="text-red-600">Session Title is required</span>}
        </div>

        {/* Registration Start Date */}
        <div>
          <label className="block text-lg font-medium mb-1">Registration Start Date<span className="text-red-500">*</span></label>
          <input
            type="date"
            className="input input-bordered w-full"
            {...register('registrationStartDate', { required: true })}
          />
          {errors.registrationStartDate && <span className="text-red-600">Registration Start Date is required</span>}
        </div>

        {/* Registration End Date */}
        <div>
          <label className="block text-lg font-medium mb-1">Registration End Date<span className="text-red-500">*</span></label>
          <input
            type="date"
            className="input input-bordered w-full"
            {...register('registrationEndDate', { required: true })}
          />
          {errors.registrationEndDate && <span className="text-red-600">Registration End Date is required</span>}
        </div>

        {/* Class Start Date */}
        <div>
          <label className="block text-lg font-medium mb-1">Class Start Date<span className="text-red-500">*</span></label>
          <input
            type="date"
            className="input input-bordered w-full"
            {...register('classStartDate', { required: true })}
          />
          {errors.classStartDate && <span className="text-red-600">Class Start Date is required</span>}
        </div>

        {/* Class End Date */}
        <div>
          <label className="block text-lg font-medium mb-1">Class End Date<span className="text-red-500">*</span></label>
          <input
            type="date"
            className="input input-bordered w-full"
            {...register('classEndDate', { required: true })}
          />
          {errors.classEndDate && <span className="text-red-600">Class End Date is required</span>}
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
          {errors.sessionDuration && <span className="text-red-600">Session Duration is required</span>}
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
          {errors.registrationFee && <span className="text-red-600">Registration Fee is required</span>}
        </div>

        {/* Image */}
        <div className="form-control w-full my-6">
          <label className="block text-lg font-medium mb-1">Session Image<span className="text-red-500">*</span></label>
          <input {...register('sessionImage', { required: true })} type="file" className="file-input file-input-bordered w-full" />
          {errors.sessionImage && <span className="text-red-600">Session Image is required</span>}
        </div>

        {/* Session Description */}
        <div>
          <label className="block text-lg font-medium mb-1">Session Description<span className="text-red-500">*</span></label>
          <textarea
            placeholder="Enter session description"
            className="textarea textarea-bordered w-full"
            {...register('description', { required: true })}
          ></textarea>
          {errors.description && <span className="text-red-600">Session Description is required</span>}
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