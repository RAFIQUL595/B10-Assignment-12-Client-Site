import React from 'react';

const Card = ({ tutor }) => {
    return (
        <div
            className="w-72 bg-green-300 relative border boxShadow rounded-xl items-center flex gap-[20px] p-4">
            <div className="w-[50%]">
                <img
                    src={tutor.image}
                    alt={tutor.name}
                    className="w-40 h-20 rounded-[50%]"
                />
            </div>

            <div className="">
                <h1 className="text-[1.4rem] font-bold leading-[24px]">{tutor.name}</h1>
                <span className="text-[0.9rem] text-white font-semibold">{tutor.role}</span>

                <p className="text-black mt-3 text-[0.9rem]">Email: {tutor.email}</p>
            </div>
        </div>
    );
};

export default Card;