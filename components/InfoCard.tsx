
import React from 'react';

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface rounded-xl shadow-lg p-4">
        <h4 className="font-bold text-md text-text-secondary mb-2">{title}</h4>
        <div className="text-text-primary">
            {children}
        </div>
    </div>
);

export default InfoCard;