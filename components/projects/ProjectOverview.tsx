import React from 'react';
import { Project } from '../../types';
import InfoCard from '../InfoCard';

interface ProjectOverviewProps {
    project: Project;
    onSelectUser: (userId: string) => void;
    onHandoverClick: () => void;
    canInitiateHandover: boolean;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project, onSelectUser, onHandoverClick, canInitiateHandover }) => {
    const totalExpenses = project.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const profit = project.budget.pemasukan - totalExpenses;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Person In Charge (PIC)">
                <div className="flex items-start justify-between">
                    <div 
                        className="flex items-center cursor-pointer p-2 -m-2 rounded-lg hover:bg-gray-700 flex-grow" 
                        onClick={() => onSelectUser(project.pic.id)}
                    >
                        <img src={project.pic.avatarUrl} alt={project.pic.name} className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <p className="font-semibold">{project.pic.name}</p>
                            <p className="text-sm text-text-secondary">{project.pic.role}</p>
                        </div>
                    </div>
                    {canInitiateHandover && (
                        <button
                            onClick={onHandoverClick}
                            className="text-xs bg-secondary text-white px-2 py-1 rounded hover:bg-gray-500 transition-colors flex-shrink-0"
                            title="Lakukan Serah Terima PIC"
                        >
                            Handover
                        </button>
                    )}
                </div>
            </InfoCard>
            <InfoCard title="Timeline">
                <p><strong>Mulai:</strong> {project.startDate}</p>
                <p><strong>Selesai:</strong> {project.endDate}</p>
            </InfoCard>
            <InfoCard title="Anggaran">
                <p><strong>Modal:</strong> Rp {project.budget.modal.toLocaleString('id-ID')}</p>
                <p><strong>Pemasukan:</strong> Rp {project.budget.pemasukan.toLocaleString('id-ID')}</p>
                <p><strong>Pengeluaran:</strong> Rp {totalExpenses.toLocaleString('id-ID')}</p>
                <p className={`font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <strong>Profit:</strong> Rp {profit.toLocaleString('id-ID')}
                </p>
            </InfoCard>
        </div>
    );
};

export default ProjectOverview;