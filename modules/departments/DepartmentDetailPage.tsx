import React, { useContext, useMemo } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { Project, User, UserRole } from '../../types';
import { ProjectStatusBadge, RoleBadge } from '../../components/Badges';

interface DepartmentDetailPageProps {
    departmentName: string;
    onBack: () => void;
    onSelectProject: (projectId: string) => void;
    onSelectUser: (userId: string) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center shadow-sm">
        <div className="p-3 rounded-full bg-primary/20 text-primary mr-4">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-100">{value}</p>
        </div>
    </div>
);

const DepartmentDetailPage: React.FC<DepartmentDetailPageProps> = ({ departmentName, onBack, onSelectProject, onSelectUser }) => {
    const dataContext = useContext(DataContext);

    const departmentData = useMemo(() => {
        if (!dataContext) return null;
        const { allProjects, allUsers } = dataContext;

        const members = allUsers.filter(u => u.department === departmentName);
        const projects = allProjects.filter(p => p.department === departmentName);

        const activeProjects = projects.filter(p => p.status === 'On Progress').length;
        
        let totalTasks = 0;
        let completedTasks = 0;
        projects.forEach(p => {
            totalTasks += p.tasks.length;
            completedTasks += p.tasks.filter(t => t.completed).length;
        });
        const taskCompletion = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) + '%' : 'N/A';

        return { members, projects, activeProjects, taskCompletion };
    }, [dataContext, departmentName]);

    if (!departmentData) return <div>Loading...</div>;

    const { members, projects, activeProjects, taskCompletion } = departmentData;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700"><ArrowLeftIcon /></button>
                <h1 className="text-3xl font-bold text-text-primary">Departemen: {departmentName}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Anggota" value={members.length} icon={<UsersIcon />} />
                <StatCard title="Proyek Aktif" value={activeProjects} icon={<FolderIcon />} />
                <StatCard title="Penyelesaian Tugas" value={taskCompletion} icon={<CheckBadgeIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Proyek Terkait</h3>
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
                        {projects.length > 0 ? projects.map(project => (
                            <div key={project.id} onClick={() => onSelectProject(project.id)} className="p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{project.name}</p>
                                    <ProjectStatusBadge status={project.status} />
                                </div>
                                <p className="text-xs text-gray-400">PIC: {project.pic.name}</p>
                            </div>
                        )) : <p className="text-center text-sm text-gray-500 py-4">Tidak ada proyek.</p>}
                    </div>
                </div>
                <div className="bg-surface rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Anggota Tim</h3>
                     <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
                        {members.length > 0 ? members.map(user => (
                            <div key={user.id} onClick={() => onSelectUser(user.id)} className="p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.role}</p>
                                    </div>
                                </div>
                                <RoleBadge role={user.role} />
                            </div>
                        )) : <p className="text-center text-sm text-gray-500 py-4">Tidak ada anggota.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Icons
const ArrowLeftIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const UsersIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663v.005zM18 7.5a3 3 0 11-6 0 3 3 0 016 0zM12 12.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const FolderIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const CheckBadgeIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default DepartmentDetailPage;