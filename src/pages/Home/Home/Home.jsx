import React from 'react';
import { Helmet } from 'react-helmet-async';
import Banner from '../Banner/Banner';
import StudySessionCard from '../StudySessionCard/StudySessionCard';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Home | Study Platform</title>
            </Helmet>
            {/* Banner */}
            <Banner></Banner>
            <StudySessionCard></StudySessionCard>
        </div>
    );
};

export default Home;