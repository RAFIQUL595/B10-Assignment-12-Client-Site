import React from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import SectionTitle from './../../../components/SectionTitle/SectionTitle';
import Card from "../../../components/Card/Card";

const TutorSection = () => {
    const axiosPublic = useAxiosPublic();

    // Fetch all tutors
    const { data: tutors = [] } = useQuery({
        queryKey: ["tutors"],
        queryFn: async () => {
            const res = await axiosPublic.get(`/tutor`);
            return res.data;
        },
    });

    // Corrected filter condition
    const filterTutor = tutors.filter(tutor => tutor.role === "Tutor");

    return (
        <div className="my-10 mx-20 lg:mx-10">
            <SectionTitle heading='All Tutor'></SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 justify-center gap-6">
                {filterTutor.length > 0 ? (
                    filterTutor.map((tutor) => <Card key={tutor._id} tutor={tutor} />)
                ) : (
                    <p className="text-xl text-red-500 text-center">No tutors found</p>
                )}
            </div>
        </div>
    );
};

export default TutorSection;