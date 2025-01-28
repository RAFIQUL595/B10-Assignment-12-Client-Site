import React from 'react';
import { Helmet } from 'react-helmet-async';
import Banner from '../Banner/Banner';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Home | Study Platform</title>
            </Helmet>
            {/* Banner */}
            <Banner></Banner>
        </div>
    );
};

export default Home;