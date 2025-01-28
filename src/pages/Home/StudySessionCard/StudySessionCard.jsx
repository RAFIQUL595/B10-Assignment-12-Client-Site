import { useQuery } from "@tanstack/react-query";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const StudySessionCard = () => {
    const axiosPublic = useAxiosPublic();

    // Fetch all study sessions
    const { data: sessions = [] } = useQuery({
        queryKey: ["sessions"],
        queryFn: async () => {
            const res = await axiosPublic.get("/adminViewSessions");
            return res.data;
        }
    });

    // Filter approved sessions before slicing
    const approvedSessions = sessions
        .filter(session => session.status === "approved")
        .slice(0, 6);

    return (
        <div className="my-12">
            <SectionTitle heading="Study Session" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedSessions.map(session => {

                    const currentDate = new Date();
                    const registrationStartDate = new Date(session.registrationStartDate);
                    const registrationEndDate = new Date(session.registrationEndDate);

                    registrationStartDate.setHours(0, 0, 0, 0);
                    registrationEndDate.setHours(23, 59, 59, 999);
                    currentDate.setHours(0, 0, 0, 0);

                    const isOngoing = currentDate >= registrationStartDate && currentDate <= registrationEndDate;
                    const isStarted = currentDate > registrationStartDate;

                    return (
                        <div key={session._id} className="card bg-base-100 shadow-xl w-96">
                            <figure>
                                <img
                                    src={session.sessionImage}
                                    alt={session.title}
                                    className="w-full h-48 object-cover"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{session.title}</h2>
                                <p>{session.description}</p>
                                <div className="card-actions justify-between">
                                    {/* Display "Ongoing" if registration has started and is ongoing, else display "Closed" */}
                                    <button
                                        className={`btn ${isOngoing ? "btn-error" : "btn-success"}`}
                                        disabled={isStarted}
                                    >
                                        {isStarted ? "Closed" : "Ongoing"}
                                    </button>

                                    {/* Read More Button */}
                                    <button className="btn btn-primary">Read More</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudySessionCard;
