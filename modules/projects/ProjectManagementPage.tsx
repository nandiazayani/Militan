import React, { useState, useContext } from 'react';
import { MOCK_PROJECTS, MOCK_USERS } from '../../constants/mockData';
import { Project, ProjectStatus, User, UserRole } from '../../types';
import { UserContext } from '../../App';

interface ProjectManagementPageProps {
    onSelectProject: (id: string) => void;
}

const ProjectStatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
    const statusStyles = {
      [ProjectStatus.OnProgress]: 'bg-blue-100 text-blue-800',
      [ProjectStatus.Completed]: 'bg-green-100 text-green-800',
      [ProjectStatus.Pitching]: 'bg-yellow-100 text-yellow-800',
      [ProjectStatus.Approved]: 'bg-indigo-100 text-indigo-800',
      [ProjectStatus.Revision]: 'bg-orange-100 text-orange-800',
      [ProjectStatus.Archived]: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
};

const AddProjectModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (project: Project) => void; }> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [picId, setPicId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [modal, setModal] = useState(0);

    const handleSubmit = () => {
        if (!name || !picId || !startDate || !endDate) {
            alert('Harap isi semua kolom yang wajib diisi.');
            return;
        }
        const pic = MOCK_USERS.find(u => u.id === picId);
        if (!pic) return;

        const newProject: Project = {
            id: `p${Date.now()}`,
            name,
            pic,
            startDate,
            endDate,
            status: ProjectStatus.Pitching,
            budget: { modal, pengeluaran: 0, pemasukan: 0 },
            team: [],
            vendors: [],
        };
        onSave(newProject);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Tambah Proyek Baru</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Proyek</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Person in Charge (PIC)</label>
                        <select value={picId} onChange={(e) => setPicId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100">
                            <option value="">-- Pilih PIC --</option>
                            {MOCK_USERS.filter(u => u.role === UserRole.Manager || u.role === UserRole.Staff).map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Mulai</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Selesai</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Modal Anggaran</label>
                        <input type="number" value={modal} onChange={(e) => setModal(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Batal</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Simpan</button>
                </div>
            </div>
        </div>
    );
};

const ProjectManagementPage: React.FC<ProjectManagementPageProps> = ({ onSelectProject }) => {
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userContext = useContext(UserContext);

    const handleSaveProject = (newProject: Project) => {
        setProjects([newProject, ...projects]);
    };

    const canAddProject = userContext?.user.role === UserRole.Admin || userContext?.user.role === UserRole.Manager;

    return (
        <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">Project Management</h2>
                {canAddProject && (
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
                        Tambah Proyek Baru
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Proyek</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PIC</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal Selesai</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {projects.map((project: Project) => (
                            <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{project.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <img className="h-8 w-8 rounded-full" src={project.pic.avatarUrl} alt={project.pic.name} />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm text-gray-900 dark:text-gray-100">{project.pic.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <ProjectStatusBadge status={project.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{project.endDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onSelectProject(project.id)} className="text-primary hover:text-blue-700">Lihat Detail</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <AddProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProject}
            />
        </div>
    );
};

export default ProjectManagementPage;