import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../pages/Shared/NavBar/NavBar';
import Footer from '../pages/Shared/Footer/Footer';

const Main = () => {
    const location = useLocation();
    const noHeaderFooter = location.pathname.includes('login') || location.pathname.includes('signup');
    return (
        <div>
            <div className='max-w-screen-xl mx-auto min-h-[calc(100vh-250px)] md:min-h-[calc(100vh-230px)]'>
            { noHeaderFooter || <NavBar></NavBar>}
                <Outlet></Outlet>
            </div>
            { noHeaderFooter || <Footer></Footer>}
        </div>
    );
};

export default Main;