
import React, { useContext, useState } from 'react';
import { DataContext, UserContext } from '../../App';
import { User, UserTask, TaskStatus, TaskPriority, UserRole } from '../../types';
import { RoleBadge, PriorityBadge } from '../../components/Badges';
import AITaskPrioritizer from '../../components/users/AITaskPrioritizer';

interface UserDetailPageProps {
    userId: string;
    onBack: () => void;
}

// Modal for adding/editing user tasks
const TaskModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: UserTask) => void;
    task: UserTask | null;
    userId: string;
}> = ({ isOpen, onClose, onSave, task, userId }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);

    React.useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDueDate(task.dueDate);
            setPriority(task.priority);
        } else {
            setTitle('');
            setDueDate('');
            setPriority(TaskPriority.Medium);
        }
    }, [task, isOpen]);

    const handleSave = () => {
        if (!title.trim() || !dueDate) {
            alert('Judul dan tanggal tenggat harus diisi.');
            return;
        }
        onSave({
            id: task?.id || `ut${Date.now()}`,
            userId: userId,
            title,
            dueDate,
            priority,
            status: task?.status || 'To Do',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-white">{task ? 'Edit Tugas' : 'Tambah Tugas Baru'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Judul Tugas</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Tanggal Tenggat</label>
                        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Prioritas</label>
                        <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100">
                            {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500">Simpan</button>
                </div>
            </div>
        </div>
    );
};


const UserDetailPage: React.FC<UserDetailPageProps> = ({ userId, onBack }) => {
    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<UserTask | null>(null);

    if (!dataContext || !userContext) return <div>Loading...</div>;

    const { allUsers, allUserTasks, addUserTask, updateUserTask, deleteUserTask } = dataContext;
    const { user: currentUser } = userContext;

    const user = allUsers.find(u => u.id === userId);
    const userTasks = allUserTasks.filter(t => t.userId === userId);
    
    if (!user) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl text-red-500">Pengguna tidak ditemukan.</h2>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary text-black rounded-lg">Kembali ke Daftar</button>
            </div>
        );
    }

    const canManageTasks = currentUser.role === UserRole.Admin || currentUser.role === UserRole.Manager;

    const handleAddTask = () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    const handleEditTask = (task: UserTask) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleSaveTask = async (savedTask: UserTask) => {
        if (editingTask) {
            await updateUserTask(savedTask);
        } else {
            await addUserTask(savedTask);
        }
        setIsTaskModalOpen(false);
    };
    
    const handleDeleteTask = (taskId: string) => {
        if (window.confirm("Yakin ingin menghapus tugas ini?")) {
            deleteUserTask(taskId);
        }
    };

    const handleStatusChange = (task: UserTask, newStatus: TaskStatus) => {
        updateUserTask({ ...task, status: newStatus });
    };

    const tasksToDo = userTasks.filter(t => t.status === 'To Do');
    const tasksInProgress = userTasks.filter(t => t.status === 'In Progress');
    const tasksDone = userTasks.filter(t => t.status === 'Done');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700">
                        <ArrowLeftIcon />
                    </button>
                    <div className="flex items-center gap-4">
                        <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full" />
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">{user.name}</h1>
                            <RoleBadge role={user.role} />
                            <p className="text-sm text-text-secondary mt-1">{user.department}</p>
                        </div>
                    </div>
                </div>
                 {canManageTasks && (
                    <button onClick={handleAddTask} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500 transition">
                        Tambah Tugas
                    </button>
                )}
            </div>

            <AITaskPrioritizer tasks={tasksToDo} onUpdateTasks={updateUserTask} />

            {/* Task Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TaskColumn title="To Do" tasks={tasksToDo} onEdit={handleEditTask} onDelete={handleDeleteTask} onStatusChange={handleStatusChange} canEdit={canManageTasks} />
                <TaskColumn title="In Progress" tasks={tasksInProgress} onEdit={handleEditTask} onDelete={handleDeleteTask} onStatusChange={handleStatusChange} canEdit={canManageTasks} />
                <TaskColumn title="Done" tasks={tasksDone} onEdit={handleEditTask} onDelete={handleDeleteTask} onStatusChange={handleStatusChange} canEdit={canManageTasks} />
            </div>

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSave={handleSaveTask}
                task={editingTask}
                userId={user.id}
            />
        </div>
    );
};

// Task Column Component
const TaskColumn: React.FC<{
    title: TaskStatus;
    tasks: UserTask[];
    onEdit: (task: UserTask) => void;
    onDelete: (taskId: string) => void;
    onStatusChange: (task: UserTask, newStatus: TaskStatus) => void;
    canEdit: boolean;
}> = ({ title, tasks, onEdit, onDelete, onStatusChange, canEdit }) => {
    const statusOptions: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
    return (
        <div className="bg-surface rounded-lg p-4">
            <h3 className="font-bold text-lg mb-4 text-text-primary border-b border-gray-700 pb-2">{title} ({tasks.length})</h3>
            <div className="space-y-3 h-[calc(100vh-350px)] overflow-y-auto pr-2">
                {tasks.map(task => (
                    <div key={task.id} className="bg-gray-700/50 p-3 rounded-md shadow">
                        <p className="font-semibold text-gray-100">{task.title}</p>
                        <div className="flex justify-between items-center mt-2">
                            <PriorityBadge priority={task.priority} />
                            <span className="text-xs text-gray-400">Due: {task.dueDate}</span>
                        </div>
                        {canEdit && (
                             <div className="mt-3 border-t border-gray-600 pt-2 flex items-center justify-between">
                                <select 
                                    value={task.status} 
                                    onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
                                    className="text-xs bg-gray-600 rounded p-1"
                                >
                                    {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                                <div className="flex gap-2">
                                    <button onClick={() => onEdit(task)} className="text-blue-400 hover:text-blue-300"><PencilIcon /></button>
                                    <button onClick={() => onDelete(task.id)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Icons
const ArrowLeftIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const PencilIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const TrashIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;


export default UserDetailPage;
