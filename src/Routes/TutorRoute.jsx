import React from 'react';
import useAuth from '../hooks/useAuth';
import useTutor from '../hooks/useTutor';
import { Navigate, useLocation } from 'react-router-dom';

const TutorRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [isTutor, isTutorLoading] = useTutor();
    const location = useLocation();

    if (loading || isTutorLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-bars loading-lg"></span>
            </div>)
    }

    if (user && isTutor) {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default TutorRoute;
