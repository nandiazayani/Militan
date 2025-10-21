import React, { useState, useEffect, useMemo, useContext } from 'react';
import { MOCK_USER_TASKS } from '../../constants/mockData';
import { User, UserTask, TaskPriority, UserRole } from '../../types';
import { UserContext, DataContext } from '../../App';
import EditProfileModal from '../../components/EditProfileModal';
import { PriorityBadge, TaskStatusBadge } from '../../components/Badges';


interface UserDetailPageProps {
    userId: string;
    onBack: () => void;
}

const KpiCard: React.FC<{ title: string, value: string, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center">
        <div className="p-3 bg-primary rounded-full text-white mr-4">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
            <p className="text-xl font-bold dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const EditTaskModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: UserTask) => void;
    task: UserTask | null;
}> = ({ isOpen, onClose, onSave, task }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<UserTask['status']>('To Do');
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDueDate(task.dueDate);
            setStatus(task.status);
            setPriority(task.priority);
        }
    }, [task]);

    const handleSave = () => {
        if (!task) return;
        if (!title.trim() || !dueDate) {
            alert('Judul dan tanggal tenggat tidak boleh kosong.');
            return;
        }
        onSave({ ...task, title, dueDate, status, priority });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Edit Tugas</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul Tugas</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Tenggat</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as UserTask['status'])}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prioritas</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                            >
                                <option value={TaskPriority.High}>High</option>
                                <option value={TaskPriority.Medium}>Medium</option>
                                <option value={TaskPriority.Low}>Low</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Batal</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Simpan Perubahan</button>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle?: string;
}> = ({ isOpen, onClose, onConfirm, taskTitle }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-2 dark:text-white">Konfirmasi Penghapusan</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Apakah Anda yakin ingin menghapus tugas <strong className="dark:text-white">{taskTitle || 'ini'}</strong>? Tindakan ini tidak dapat diurungkan.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Batal</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus</button>
                </div>
            </div>
        </div>
    );
};


const UserDetailPage: React.FC<UserDetailPageProps> = ({ userId, onBack }) => {
    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);
    const user = dataContext?.allUsers.find(u => u.id === userId);

    const [tasks, setTasks] = useState<UserTask[]>(MOCK_USER_TASKS.filter(t => t.userId === userId));
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>(TaskPriority.Medium);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<UserTask | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<UserTask | null>(null);
    const [sortCriteria, setSortCriteria] = useState<'dueDate' | 'priority'>('dueDate');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);


    const sortedTasks = useMemo(() => {
        const priorityOrder: Record<TaskPriority, number> = {
            [TaskPriority.High]: 0,
            [TaskPriority.Medium]: 1,
            [TaskPriority.Low]: 2,
        };
        
        return [...tasks].sort((a, b) => {
            if (sortCriteria === 'priority') {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            // Default to dueDate
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    }, [tasks, sortCriteria]);

    const handleAddTask = () => {
        if (!newTaskTitle.trim() || !newTaskDueDate) {
            alert('Judul tugas dan tanggal tenggat harus diisi.');
            return;
        }

        const newTask: UserTask = {
            id: `t${Date.now()}`,
            userId: userId,
            title: newTaskTitle.trim(),
            status: 'To Do',
            dueDate: newTaskDueDate,
            priority: newTaskPriority,
        };

        setTasks([newTask, ...tasks]);
        setNewTaskTitle('');
        setNewTaskDueDate('');
        setNewTaskPriority(TaskPriority.Medium);
    };
    
    const handleMarkAsDone = (taskId: string) => {
        setTasks(currentTasks =>
            currentTasks.map(task =>
                task.id === taskId ? { ...task, status: 'Done' } : task
            )
        );
    };

    const handleEditClick = (task: UserTask) => {
        setTaskToEdit(task);
        setIsEditModalOpen(true);
    };
    
    const handleDeleteClick = (task: UserTask) => {
        setTaskToDelete(task);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteTask = () => {
        if (taskToDelete) {
            setTasks(tasks.filter(t => t.id !== taskToDelete.id));
            setTaskToDelete(null);
            setIsDeleteConfirmOpen(false);
        }
    };

    const handleUpdateTask = (updatedTask: UserTask) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        setIsEditModalOpen(false);
        setTaskToEdit(null);
    };

    if (!user || !userContext || !dataContext) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-bold">Pengguna tidak ditemukan.</h2>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">Kembali</button>
            </div>
        );
    }
    const { user: currentUser } = userContext;
    const { updateUser } = dataContext;
    const canEdit = currentUser.role === UserRole.Admin || currentUser.id === user.id;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) + '%' : 'N/A';
    const activeTasks = totalTasks - completedTasks;

    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ArrowLeftIcon />
                </button>
                <div className="flex items-center justify-between space-x-6 bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6 flex-1">
                    <div className="flex items-center space-x-6">
                        <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-primary" />
                        <div>
                            <h2 className="text-3xl font-bold text-text-primary dark:text-gray-100">{user.name}</h2>
                            <p className="text-text-secondary dark:text-gray-400">{user.role} {user.department && ` - ${user.department}`}</p>
                        </div>
                    </div>
                     {canEdit && (
                        <button onClick={() => setIsProfileModalOpen(true)} className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                            Edit Profil
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Completion Rate" value={completionRate} icon={<CheckCircleIcon />} />
                <KpiCard title="Tugas Aktif" value={activeTasks.toString()} icon={<ClipboardListIcon />} />
                <KpiCard title="Pencapaian" value="5" icon={<TrophyIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold dark:text-gray-100">Daftar Tugas</h3>
                         <div>
                            <label htmlFor="sort" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Urutkan:</label>
                            <select
                                id="sort"
                                value={sortCriteria}
                                onChange={(e) => setSortCriteria(e.target.value as 'dueDate' | 'priority')}
                                className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm text-gray-900 dark:text-gray-100"
                            >
                                <option value="dueDate">Tanggal Tenggat</option>
                                <option value="priority">Prioritas</option>
                            </select>
                        </div>
                    </div>
                    <div className="h-64 overflow-y-auto pr-2">
                        <ul className="space-y-3">
                            {sortedTasks.length > 0 ? sortedTasks.map(task => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const dueDate = new Date(task.dueDate);
                                const isOverdue = dueDate <= today && task.status !== 'Done';

                                return (
                                <li 
                                    key={task.id} 
                                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium dark:text-gray-100">{task.title}</p>
                                        <p className={`text-sm flex items-center gap-1 ${isOverdue ? 'text-red-500 dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {isOverdue && <ClockIcon />}
                                            <span>Tenggat: {task.dueDate}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <PriorityBadge priority={task.priority} />
                                        <TaskStatusBadge status={task.status} />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleMarkAsDone(task.id)}
                                                className={task.status === 'Done' ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'}
                                                title={task.status === 'Done' ? 'Tugas Selesai' : 'Tandai Selesai'}
                                                disabled={task.status === 'Done'}
                                            >
                                                <CheckCircleIcon />
                                            </button>
                                            <button onClick={() => handleEditClick(task)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Edit Tugas"><PencilIcon/></button>
                                            <button onClick={() => handleDeleteClick(task)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title="Hapus Tugas"><TrashIcon/></button>
                                        </div>
                                    </div>
                                </li>
                            )}) : <p className="text-gray-500 dark:text-gray-400 text-center py-4">Tidak ada tugas untuk pengguna ini.</p>}
                        </ul>
                    </div>
                    <div className="mt-4 border-t pt-4 dark:border-gray-700">
                        <h4 className="text-md font-semibold mb-2 dark:text-gray-200">Tambah Tugas Baru</h4>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }} className="space-y-3">
                            <div>
                                <label htmlFor="newTaskTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Judul Tugas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="newTaskTitle"
                                    type="text"
                                    placeholder="e.g., Siapkan presentasi klien"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    required
                                    className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-1">
                                    <label htmlFor="newTaskDueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Tanggal Tenggat <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="newTaskDueDate"
                                        type="date"
                                        value={newTaskDueDate}
                                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                                        required
                                        className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                                <div className="sm:col-span-1">
                                    <label htmlFor="newTaskPriority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Prioritas
                                    </label>
                                    <select
                                        id="newTaskPriority"
                                        value={newTaskPriority}
                                        onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                                        className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                                    >
                                        <option value={TaskPriority.High}>High</option>
                                        <option value={TaskPriority.Medium}>Medium</option>
                                        <option value={TaskPriority.Low}>Low</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-1 flex items-end">
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                                    >
                                        Tambah Tugas
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Status Laporan</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border dark:border-gray-700 rounded-lg">
                            <div>
                                <p className="font-semibold dark:text-gray-100">Laporan Mingguan</p>
                                <p className="text-sm text-green-600">Sudah Dikirim</p>
                            </div>
                            <button onClick={() => alert('Fitur lihat laporan belum tersedia.')} className="text-sm text-primary hover:underline">Lihat</button>
                        </div>
                        <div className="flex justify-between items-center p-4 border dark:border-gray-700 rounded-lg">
                            <div>
                                <p className="font-semibold dark:text-gray-100">Laporan Bulanan</p>
                                <p className="text-sm text-red-600">Belum Dikirim</p>
                            </div>
                            <button onClick={() => alert('Fitur buat laporan belum tersedia.')} className="px-3 py-1 bg-secondary text-white rounded-md hover:bg-green-700">Buat Laporan</button>
                        </div>
                    </div>
                </div>
            </div>
             <EditTaskModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleUpdateTask}
                task={taskToEdit}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDeleteTask}
                taskTitle={taskToDelete?.title}
            />
            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSave={updateUser}
                user={user}
            />
        </div>
    );
};

// Icons
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 119 0zM16.5 18.75a9 9 0 00-9 0m9 0h.008v.008h-.008v-.008zm-9 0h.008v.008h-.008v-.008z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default UserDetailPage;