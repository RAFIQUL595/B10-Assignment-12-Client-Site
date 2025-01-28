import React from 'react';

const MaterialsCard = ({ materials, noMaterials, tutorInfo, button, image, SessionId }) => {
    return (
        <div className="p-6 bg-base-200 rounded-lg shadow-lg">
            {materials.length === 0 ? (
                <p className="text-gray-500">{noMaterials}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((material) => (
                        <div
                            key={material._id}
                            className="card card-compact bg-base-100 shadow-xl"
                        >
                            {image(material)}
                            <div className="card-body">
                                <h2 className="card-title">{material.title}</h2>
                                {SessionId(material)}
                                {tutorInfo(material)}
                                {button(material)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MaterialsCard;