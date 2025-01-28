import React from 'react';
import banner from '../../../assets/Banner.jpg';

const Banner = () => {
    return (
        <div className="relative w-full h-[500px] flex items-center justify-center text-center text-white">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner})` }}
            ></div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Overlay Content */}
            <div className="relative z-10 px-4">
                <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                    Empower Your Learning Journey
                </h1>
                <p className="mt-4 text-lg md:text-xl drop-shadow-md">
                    Explore a world of knowledge with our interactive courses and expert-led lessons.
                </p>

                <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition">
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Banner;