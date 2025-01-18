import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../pages/Shared/NavBar/NavBar';

const Main = () => {
    return (
        <div>
            <div className='max-w-screen-xl mx-auto'>
                <NavBar></NavBar>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Main;