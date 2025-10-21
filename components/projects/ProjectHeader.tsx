import React from 'react';
import { Project } from '../../types';
import { ProjectStatusBadge } from '../Badges';

interface ProjectHeaderProps {
    project: Project;
    onBack: () => void;
    onSave: () => void;
    canEdit: boolean;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onBack, onSave, canEdit }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ArrowLeftIcon />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100">{project.name}</h1>
                    <ProjectStatusBadge status={project.status} />
                </div>
            </div>
            {canEdit && (
                <button onClick={onSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
                    Simpan Perubahan
                </button>
            )}
        </div>
    );
};

const ArrowLeftIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;

export default ProjectHeader;
