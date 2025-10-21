import React from 'react';
import { User } from '../../types';

interface TeamCardProps {
    team: User[];
    onSelectUser: (userId: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onSelectUser }) => {
    return (
        <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Tim Proyek & PIC</h3>
            <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {team.map(member => (
                    <li 
                        key={member.id} 
                        className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer" 
                        onClick={() => onSelectUser(member.id)}
                    >
                        <div className="flex items-center">
                            <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full mr-3" />
                            <div>
                                <p className="font-medium text-sm">{member.name}</p>
                                <p className="text-xs text-text-primary">{member.role}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeamCard;