import React, { useState, useContext } from 'react';
// FIX: Corrected import path for types
import { Project, ProjectStatus, User, UserRole } from '../../types';
import { UserContext } from '../../contexts/UserContext';
import { DataContext } from '../../contexts/DataContext';
import { ProjectStatusBadge } from '../../components/Badges';

interface ProjectManagementPageProps {
    onSelectProject: (id: string) => void;
}

const AddProjectModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (project: Project) => void; allUsers: User[] }> = ({ isOpen, onClose, onSave, allUsers }) => {
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
        const pic = allUsers.find(u => u.id === picId);
        if (!pic) return;

        const newProject: Project = {
            id: `p${Date.now()}`,
            name,
            pic,
            startDate,
            endDate,
            status: ProjectStatus.Pitching,
            budget: { modal, pemasukan: 0 },
            team: [],
            vendors: [],
            expenses: [],
            tasks: [],
            history: [],
        };
        onSave(newProject);
        onClose();
    };
    
    React.useEffect(() => {
      if (!isOpen) {
        setName('');
        setPicId('');
        setStartDate('');
        setEndDate('');
        setModal(0);
      }
    }, [isOpen]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-white">Tambah Proyek Baru</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Nama Proyek</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Person in Charge (PIC)</label>
                        <select value={picId} onChange={(e) => setPicId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100">
                            <option value="">-- Pilih PIC --</option>
                            {allUsers.filter(u => u.role === UserRole.Manager || u.role === UserRole.Staff).map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Tanggal Mulai</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Tanggal Selesai</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Modal Anggaran</label>
                        <input type="number" value={modal} onChange={(e) => setModal(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-yellow-500 font-semibold">Simpan</button>
                </div>
            </div>
        </div>
    );
};

const SummaryCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center shadow-sm">
        <div className="p-3 rounded-full bg-primary/20 text-primary mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-xl font-bold text-gray-100">{value}</p>
        </div>
    </div>
);

const ProjectManagementPage: React.FC<ProjectManagementPageProps> = ({ onSelectProject }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userContext = useContext(UserContext);
    const dataContext = useContext(DataContext);
    
    if(!userContext || !dataContext) return null;
    
    const { allProjects, allUsers, addProject } = dataContext;

    const canAddProject = userContext.user.role === UserRole.Admin || userContext.user.role === UserRole.Manager;

    const totalProjects = allProjects.length;
    const onProgressProjects = allProjects.filter(p => p.status === ProjectStatus.OnProgress).length;
    const totalBudget = allProjects.reduce((sum, p) => sum + p.budget.modal, 0);

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Project Management</h2>
                {canAddProject && (
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500 transition shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <PlusIcon />
                        <span>Tambah Proyek Baru</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <SummaryCard title="Total Proyek" value={totalProjects.toString()} icon={<FolderCollectionIcon />} />
                <SummaryCard title="Proyek Berjalan" value={onProgressProjects.toString()} icon={<BeakerIcon />} />
                <SummaryCard title="Total Anggaran" value={`Rp ${new Intl.NumberFormat('id-ID').format(totalBudget)}`} icon={<CurrencyDollarIcon />} />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nama Proyek</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">PIC</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tanggal Selesai</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-surface divide-y divide-gray-700">
                        {allProjects.map((project: Project) => (
                            <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-100">{project.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <img className="h-8 w-8 rounded-full" src={project.pic.avatarUrl} alt={project.pic.name} />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm text-gray-100">{project.pic.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <ProjectStatusBadge status={project.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{project.endDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onSelectProject(project.id)} className="text-primary hover:text-yellow-500">Lihat Detail</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <AddProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSave={addProject}
                allUsers={allUsers}
            />
        </div>
    );
};

// Icons
const FolderCollectionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const BeakerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.581L6 14.25v5.25a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5v-5.25l-3.25-3.851a2.25 2.25 0 01-.5-1.581V3.104a2.25 2.25 0 00-3.75 0zM9.75 3.104a2.25 2.25 0 013.75 0M9.75 3.104a2.25 2.25 0 00-3.75 0M14.25 3.104a2.25 2.25 0 013.75 0M14.25 3.104a2.25 2.25 0 00-3.75 0" /></svg>;
const CurrencyDollarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.79-.623 1.8-1 2.833-1.017A4.5 4.5 0 0116.5 9.5m-3.75 2.25m3.75-2.25a4.5 4.5 0 00-9 0" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;

export default ProjectManagementPage;