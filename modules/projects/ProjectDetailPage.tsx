import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_PROJECTS, MOCK_USERS } from '../../constants/mockData';
import { Project, ProjectStatus, Vendor, ProjectTask, User, ProjectTaskStatus, UserRole } from '../../types';

interface ProjectDetailPageProps {
    projectId: string;
    onBack: () => void;
    onSelectUser: (userId: string) => void;
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
      <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
};

const VendorStatusBadge: React.FC<{ status: Vendor['status'] }> = ({ status }) => {
    const colorMap = {
        'Paid': 'bg-green-200 text-green-800',
        'Pending': 'bg-yellow-200 text-yellow-800',
        'Overdue': 'bg-red-200 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorMap[status]}`}>{status}</span>;
}

const ProjectTaskStatusBadge: React.FC<{ status: ProjectTaskStatus }> = ({ status }) => {
    const colorMap = {
        'To Do': 'bg-gray-200 text-gray-800',
        'In Progress': 'bg-blue-200 text-blue-800',
        'Done': 'bg-green-200 text-green-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorMap[status]}`}>{status}</span>;
}


const InfoCard: React.FC<{ title: string, value: string | number, color?: string }> = ({ title, value, color = 'text-text-primary dark:text-gray-100' }) => (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-inner">
        <p className="text-sm text-text-secondary dark:text-gray-400">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
);

const EditProjectModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedData: { name: string, status: ProjectStatus, picId: string, startDate: string, endDate: string }) => void;
    project: Project;
}> = ({ isOpen, onClose, onSave, project }) => {
    const [formData, setFormData] = useState({ name: '', status: ProjectStatus.Pitching, picId: '', startDate: '', endDate: ''});

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                status: project.status,
                picId: project.pic.id,
                startDate: project.startDate,
                endDate: project.endDate,
            });
        }
    }, [project, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim() || !formData.picId) {
            alert('Nama proyek dan PIC tidak boleh kosong.');
            return;
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Edit Detail Proyek</h3>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Proyek</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full input-style" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status Proyek</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full input-style">
                            {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Person in Charge (PIC)</label>
                        <select name="picId" value={formData.picId} onChange={handleChange} className="mt-1 block w-full input-style">
                             {MOCK_USERS.filter(u => u.role === UserRole.Manager || u.role === UserRole.Staff).map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Mulai</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="mt-1 block w-full input-style" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Selesai</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="mt-1 block w-full input-style" />
                        </div>
                    </div>
                </div>
                 <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Batal</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Simpan Perubahan</button>
                </div>
            </div>
        </div>
    )
};


const VendorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (vendor: Omit<Vendor, 'id'>) => void;
    vendorToEdit: Vendor | null;
}> = ({ isOpen, onClose, onSave, vendorToEdit }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<Vendor['status']>('Pending');

    useEffect(() => {
        if (vendorToEdit) {
            setName(vendorToEdit.name);
            setStatus(vendorToEdit.status);
        } else {
            setName('');
            setStatus('Pending');
        }
    }, [vendorToEdit, isOpen]);

    const handleSubmit = () => {
        if (!name.trim()) {
            alert('Nama vendor tidak boleh kosong.');
            return;
        }
        onSave({ name, status });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">{vendorToEdit ? 'Edit Vendor' : 'Tambah Vendor Baru'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Vendor</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status Pembayaran</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Vendor['status'])}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
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

const TaskModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskData: Omit<ProjectTask, 'id'>) => void;
    taskToEdit: ProjectTask | null;
    teamMembers: User[];
}> = ({ isOpen, onClose, onSave, taskToEdit, teamMembers }) => {
    const [title, setTitle] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<ProjectTaskStatus>('To Do');

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setAssigneeId(taskToEdit.assignee.id);
            setDueDate(taskToEdit.dueDate);
            setStatus(taskToEdit.status);
        } else {
            setTitle('');
            setAssigneeId('');
            setDueDate('');
            setStatus('To Do');
        }
    }, [taskToEdit, isOpen]);

    const handleSubmit = () => {
        if (!title.trim() || !assigneeId || !dueDate) {
            alert('Harap isi semua kolom.');
            return;
        }
        const assignee = MOCK_USERS.find(m => m.id === assigneeId); // Search all users
        if (!assignee) {
            alert('Assignee tidak valid.');
            return;
        }
        onSave({ title, assignee, dueDate, status });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">{taskToEdit ? 'Edit Tugas' : 'Tambah Tugas Baru'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul Tugas</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Penanggung Jawab (Assignee)</label>
                        <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="mt-1 block w-full input-style">
                            <option value="">-- Pilih Pengguna --</option>
                            {MOCK_USERS.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Tenggat</label>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1 block w-full input-style" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value as ProjectTaskStatus)} className="mt-1 block w-full input-style">
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
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

const DeleteVendorConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-2 dark:text-white">Konfirmasi Penghapusan</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Apakah Anda yakin ingin menghapus vendor ini? Tindakan ini tidak dapat diurungkan.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Batal</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus</button>
                </div>
            </div>
        </div>
    );
};

const ProjectReport: React.FC<{ project: Project }> = ({ project }) => {
    const profit = project.budget.pemasukan - project.budget.pengeluaran;
    return (
        <div className="p-8 font-sans text-gray-800 bg-white">
            <header className="flex items-center justify-between pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Laporan Proyek</h1>
                    <p className="text-gray-500">PT. Mili Cipta Karya</p>
                </div>
                <img src="https://picsum.photos/seed/logo/100/100" alt="Company Logo" className="h-16 w-16" />
            </header>
            
            <section className="mt-8">
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">Detail Proyek</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div><strong className="font-medium">Nama Proyek:</strong> {project.name}</div>
                    <div><strong className="font-medium">Status:</strong> {project.status}</div>
                    <div><strong className="font-medium">PIC:</strong> {project.pic.name}</div>
                    <div><strong className="font-medium">Periode:</strong> {project.startDate} s/d {project.endDate}</div>
                </div>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">Ringkasan Anggaran</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Deskripsi</th>
                            <th className="p-2 text-right">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b"><td className="p-2">Modal Awal</td><td className="p-2 text-right">Rp {project.budget.modal.toLocaleString('id-ID')}</td></tr>
                        <tr className="border-b"><td className="p-2">Total Pengeluaran</td><td className="p-2 text-right text-red-600">Rp {project.budget.pengeluaran.toLocaleString('id-ID')}</td></tr>
                        <tr className="border-b"><td className="p-2">Total Pemasukan</td><td className="p-2 text-right text-green-600">Rp {project.budget.pemasukan.toLocaleString('id-ID')}</td></tr>
                        <tr className="font-bold bg-gray-50"><td className="p-2">Profit</td><td className={`p-2 text-right ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>Rp {profit.toLocaleString('id-ID')}</td></tr>
                    </tbody>
                </table>
            </section>

             <section className="mt-8">
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">Tim Proyek</h2>
                {project.team.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">Nama Anggota</th>
                                <th className="p-2">Posisi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project.team.map(member => (
                                <tr key={member.user.id} className="border-b">
                                    <td className="p-2">{member.user.name}</td>
                                    <td className="p-2">{member.position}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">Tidak ada anggota tim yang terdaftar.</p>
                )}
            </section>

            <footer className="mt-12 pt-4 border-t text-center text-gray-500 text-sm">
                Laporan ini dibuat pada {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </footer>
        </div>
    );
};


const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId, onBack, onSelectUser }) => {
    const [project, setProject] = useState<Project | undefined>(
        JSON.parse(JSON.stringify(MOCK_PROJECTS.find(p => p.id === projectId)))
    );
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // Vendor State
    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
    const [vendorToEdit, setVendorToEdit] = useState<Vendor | null>(null);
    const [isDeleteVendorConfirmOpen, setIsDeleteVendorConfirmOpen] = useState(false);
    const [vendorToDeleteId, setVendorToDeleteId] = useState<string | null>(null);

    // Task State
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<ProjectTask | null>(null);
    
    // Team Progress State
    const [progressChanges, setProgressChanges] = useState<Record<string, number>>({});
    
    useEffect(() => {
        if (project) {
          const initialProgress = project.team.reduce((acc, member) => {
            acc[member.user.id] = member.progress;
            return acc;
          }, {} as Record<string, number>);
          setProgressChanges(initialProgress);
        }
    }, [project]);

    const hasUnsavedProgressChanges = useMemo(() => {
        if (!project) return false;
        return project.team.some(member => member.progress !== progressChanges[member.user.id]);
    }, [project, progressChanges]);

    // Team member IDs for quick lookup
    const teamMemberIds = useMemo(() => {
        if (!project) return new Set();
        return new Set([project.pic.id, ...project.team.map(m => m.user.id)]);
    }, [project]);

    // Filters and sorting for tasks
    const [statusFilter, setStatusFilter] = useState<ProjectTaskStatus | 'All'>('All');
    const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const teamMembersForTasks = useMemo(() => [project?.pic, ...(project?.team.map(tm => tm.user) || [])].filter((u, i, arr) => u && arr.findIndex(user => user?.id === u.id) === i) as User[], [project]);
    
    const displayedTasks = useMemo(() => {
        let tasks = [...(project?.tasks || [])];

        if (statusFilter !== 'All') {
            tasks = tasks.filter(t => t.status === statusFilter);
        }
        if (assigneeFilter !== 'All') {
            tasks = tasks.filter(t => t.assignee.id === assigneeFilter);
        }

        tasks.sort((a, b) => {
            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - a.dueDate.localeCompare(b.dueDate);
        });

        return tasks;

    }, [project?.tasks, statusFilter, assigneeFilter, sortOrder]);


    if (!project) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-bold">Proyek tidak ditemukan.</h2>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">Kembali</button>
            </div>
        );
    }
    
    const handlePrint = () => {
        window.print();
    };

    // Project details handler
    const handleSaveProjectDetails = (updatedData: { name: string, status: ProjectStatus, picId: string, startDate: string, endDate: string }) => {
        const pic = MOCK_USERS.find(u => u.id === updatedData.picId);
        if (!pic) {
            alert('PIC tidak valid.');
            return;
        }

        setProject(prevProject => {
            if (!prevProject) return undefined;
            return {
                ...prevProject,
                name: updatedData.name,
                status: updatedData.status,
                pic: pic,
                startDate: updatedData.startDate,
                endDate: updatedData.endDate,
            };
        });
        setIsEditModalOpen(false);
    };


    // Vendor handlers
    const handleAddVendor = () => { setVendorToEdit(null); setIsVendorModalOpen(true); };
    const handleEditVendor = (vendor: Vendor) => { setVendorToEdit(vendor); setIsVendorModalOpen(true); };
    const handleDeleteVendor = (vendorId: string) => {
        setVendorToDeleteId(vendorId);
        setIsDeleteVendorConfirmOpen(true);
    };
    const confirmDeleteVendor = () => {
        if (vendorToDeleteId) {
            setProject(p => p && { ...p, vendors: p.vendors.filter(v => v.id !== vendorToDeleteId) });
            setVendorToDeleteId(null);
            setIsDeleteVendorConfirmOpen(false);
        }
    };
    const handleSaveVendor = (vendorData: Omit<Vendor, 'id'>) => {
        setProject(p => {
            if (!p) return undefined;
            if (vendorToEdit) {
                return { ...p, vendors: p.vendors.map(v => v.id === vendorToEdit.id ? { ...v, ...vendorData } : v) };
            } else {
                return { ...p, vendors: [{ id: `v${Date.now()}`, ...vendorData }, ...p.vendors] };
            }
        });
        setIsVendorModalOpen(false);
    };

    // Task handlers
    const handleAddTask = () => { setTaskToEdit(null); setIsTaskModalOpen(true); };
    const handleEditTask = (task: ProjectTask) => { setTaskToEdit(task); setIsTaskModalOpen(true); };
    const handleDeleteTask = (taskId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            setProject(p => p && { ...p, tasks: p.tasks?.filter(t => t.id !== taskId) });
        }
    };
    const handleSaveTask = (taskData: Omit<ProjectTask, 'id'>) => {
        setProject(p => {
            if (!p) return undefined;
            const currentTasks = p.tasks || [];
            if (taskToEdit) {
                return { ...p, tasks: currentTasks.map(t => t.id === taskToEdit.id ? { ...taskToEdit, ...taskData } : t) };
            } else {
                return { ...p, tasks: [{ id: `pt${Date.now()}`, ...taskData }, ...currentTasks] };
            }
        });
        setIsTaskModalOpen(false);
    };

    // Team progress handlers
    const handleProgressChange = (userId: string, value: number) => {
        const clampedValue = Math.max(0, Math.min(100, value || 0));
        setProgressChanges(prev => ({
          ...prev,
          [userId]: clampedValue
        }));
    };
    
    const handleSaveProgress = () => {
        setProject(prevProject => {
          if (!prevProject) return undefined;
          const updatedTeam = prevProject.team.map(member => ({
            ...member,
            progress: progressChanges[member.user.id] ?? member.progress,
          }));
          return { ...prevProject, team: updatedTeam };
        });
    };

    const { name, status, pic, team, budget, vendors, startDate, endDate, reportUrl } = project;
    const profit = budget.pemasukan - budget.pengeluaran;

    return (
        <>
            <div className="print-only" style={{ display: 'none' }}>
                <ProjectReport project={project} />
            </div>
            <div className="space-y-6 no-print">
                <div className="flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-primary font-semibold hover:underline">
                        <ArrowLeftIcon />
                        <span>Kembali ke Daftar Proyek</span>
                    </button>
                    <div className="flex items-center gap-2">
                         <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                            <DownloadIcon />
                            <span>Unduh Laporan</span>
                        </button>
                        {reportUrl && <a href={reportUrl} className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-700 transition">Lihat Laporan Akhir</a>}
                    </div>
                </div>

                <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-text-primary dark:text-gray-100">{name}</h2>
                            <p className="text-text-secondary dark:text-gray-400 mt-1">PIC: {pic.name} | Periode: {startDate} - {endDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsEditModalOpen(true)} title="Edit Project Details" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                               <PencilIcon />
                            </button>
                            <ProjectStatusBadge status={status} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InfoCard title="Modal Awal" value={`Rp ${budget.modal.toLocaleString('id-ID')}`} />
                    <InfoCard title="Pengeluaran" value={`Rp ${budget.pengeluaran.toLocaleString('id-ID')}`} color="text-red-600" />
                    <InfoCard title="Pemasukan" value={`Rp ${budget.pemasukan.toLocaleString('id-ID')}`} color="text-green-600" />
                    <InfoCard title="Profit" value={`Rp ${profit.toLocaleString('id-ID')}`} color={profit >= 0 ? 'text-green-600' : 'text-red-600'} />
                </div>
                
                <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold dark:text-gray-100">Daftar Tugas Proyek</h3>
                        <button onClick={handleAddTask} className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-blue-700 transition">
                            + Tambah Tugas
                        </button>
                    </div>
                    {/* Task Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4 pb-4 border-b dark:border-gray-700">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="input-style">
                            <option value="All">Semua Status</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                         <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)} className="input-style">
                            <option value="All">Semua Anggota</option>
                            {teamMembersForTasks.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value as any)} className="input-style">
                            <option value="asc">Tenggat Terdekat</option>
                            <option value="desc">Tenggat Terjauh</option>
                        </select>
                    </div>
                    <div className="max-h-96 overflow-y-auto pr-2">
                        {displayedTasks.length > 0 ? (
                            <table className="min-w-full">
                                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-300">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Judul Tugas</th>
                                        <th className="px-4 py-2 text-left">Penanggung Jawab</th>
                                        <th className="px-4 py-2 text-center">Status</th>
                                        <th className="px-4 py-2 text-left">Tenggat</th>
                                        <th className="px-4 py-2 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {displayedTasks.map(task => {
                                        const isTeamMember = teamMemberIds.has(task.assignee.id);
                                        return (
                                            <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{task.title}</td>
                                                <td className="px-4 py-3">
                                                    <div
                                                        className={`flex items-center gap-2 ${isTeamMember ? 'cursor-pointer group' : ''}`}
                                                        onClick={isTeamMember ? () => onSelectUser(task.assignee.id) : undefined}
                                                        title={isTeamMember ? `Lihat detail ${task.assignee.name}` : undefined}
                                                    >
                                                        <img src={task.assignee.avatarUrl} alt={task.assignee.name} className="w-8 h-8 rounded-full" />
                                                        <span className={`font-medium text-sm text-gray-800 dark:text-gray-200 ${isTeamMember ? 'group-hover:text-primary' : ''}`}>
                                                            {task.assignee.name}
                                                        </span>
                                                        {!isTeamMember && (
                                                            <div title="Penanggung jawab tidak terdaftar di tim proyek ini.">
                                                                <ExclamationTriangleIcon />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center"><ProjectTaskStatusBadge status={task.status} /></td>
                                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{task.dueDate}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <button onClick={() => handleEditTask(task)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Edit Tugas"><PencilIcon /></button>
                                                        <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title="Hapus Tugas"><TrashIcon /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : <p className="text-gray-500 dark:text-gray-400 text-center py-8">Tidak ada tugas yang sesuai dengan filter.</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold dark:text-gray-100">Tim Proyek</h3>
                            <button 
                                onClick={handleSaveProgress} 
                                disabled={!hasUnsavedProgressChanges} 
                                className="px-3 py-1 bg-secondary text-white text-sm rounded-md hover:bg-green-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                Simpan Progress
                            </button>
                        </div>
                        <ul className="space-y-4">
                            {team.length > 0 ? team.map(member => (
                                <li key={member.user.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img src={member.user.avatarUrl} alt={member.user.name} className="w-10 h-10 rounded-full" />
                                            <div className="ml-3">
                                                <p className="font-medium dark:text-gray-100">{member.user.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{member.position}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={progressChanges[member.user.id] ?? ''}
                                                onChange={(e) => handleProgressChange(member.user.id, parseInt(e.target.value, 10))}
                                                className="w-16 text-right px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
                                                aria-label={`Progress for ${member.user.name}`}
                                            />
                                            <span className="text-sm font-semibold dark:text-gray-200">%</span>
                                        </div>
                                    </div>
                                    <ProgressBar progress={progressChanges[member.user.id] ?? 0} />
                                </li>
                            )) : <p className="text-gray-500 dark:text-gray-400">Belum ada anggota tim.</p>}
                        </ul>
                    </div>

                    <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold dark:text-gray-100">Daftar Vendor</h3>
                            <button onClick={handleAddVendor} className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-blue-700 transition">
                               + Tambah Vendor
                            </button>
                        </div>
                        <ul className="space-y-3">
                             {vendors.length > 0 ? vendors.map(vendor => (
                                <li key={vendor.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <p className="font-medium dark:text-gray-100">{vendor.name}</p>
                                    <div className="flex items-center gap-4">
                                        <VendorStatusBadge status={vendor.status} />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditVendor(vendor)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                                <PencilIcon />
                                            </button>
                                            <button onClick={() => handleDeleteVendor(vendor.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            )) : <p className="text-gray-500 dark:text-gray-400 text-center py-4">Belum ada vendor terdaftar.</p>}
                        </ul>
                    </div>
                </div>
                <EditProjectModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveProjectDetails}
                    project={project}
                />
                <VendorModal
                    isOpen={isVendorModalOpen}
                    onClose={() => setIsVendorModalOpen(false)}
                    onSave={handleSaveVendor}
                    vendorToEdit={vendorToEdit}
                />
                <TaskModal
                    isOpen={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
                    onSave={handleSaveTask}
                    taskToEdit={taskToEdit}
                    teamMembers={teamMembersForTasks}
                />
                <DeleteVendorConfirmationModal
                    isOpen={isDeleteVendorConfirmOpen}
                    onClose={() => setIsDeleteVendorConfirmOpen(false)}
                    onConfirm={confirmDeleteVendor}
                />
                <style>{`
                    .input-style {
                        display: block;
                        width: 100%;
                        padding: 0.5rem 0.75rem;
                        background-color: #fff;
                        border: 1px solid #d1d5db;
                        border-radius: 0.375rem;
                        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                        color: #111827;
                    }
                    .dark .input-style {
                        background-color: #374151;
                        border-color: #4b5563;
                        color: #f9fafb;
                    }
                    .input-style:focus {
                        outline: 2px solid transparent;
                        outline-offset: 2px;
                        --tw-ring-color: #1E3A8A;
                        border-color: #1E3A8A;
                    }
                    @media print {
                        .no-print {
                            display: none !important;
                        }
                        .print-only {
                            display: block !important;
                        }
                        body {
                           background-color: #fff;
                           -webkit-print-color-adjust: exact;
                           print-color-adjust: exact;
                        }
                    }
                `}</style>
            </div>
        </>
    );
};

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const ExclamationTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;

export default ProjectDetailPage;