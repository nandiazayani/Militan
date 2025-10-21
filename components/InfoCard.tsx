import React from 'react';

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <h4 className="font-bold text-md text-text-secondary dark:text-gray-400 mb-2">{title}</h4>
        <div className="text-text-primary dark:text-gray-100">
            {children}
        </div>
    </div>
);

export default InfoCard;
