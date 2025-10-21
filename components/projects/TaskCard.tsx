import React from 'react';
import { ProjectTask, Project, ProjectHistoryLog } from '../../types';
import { PriorityBadge } from '../Badges';

interface TaskCardProps {
    tasks: ProjectTask[];
    onOpenModal: (type: 'task', data?: ProjectTask | null) => void;
    onUpdateProject: (updater: (prev: Project) => Partial<Project>, log?: ProjectHistoryLog) => void;
    createHistoryLog: (action: string) => ProjectHistoryLog;
    canEdit: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ tasks, onOpenModal, onUpdateProject, createHistoryLog, canEdit }) => {

    const handleDeleteTask = (taskId: string) => {
        const dependentTasks = tasks.filter(t => t.dependencies?.includes(taskId));
        if (dependentTasks.length > 0) {
            const taskNames = dependentTasks.map(t => t.title).join(', ');
            alert(`Tugas ini tidak dapat dihapus karena menjadi prasyarat untuk tugas berikut: ${taskNames}.`);
            return;
        }

        const taskToDelete = tasks.find(t => t.id === taskId);
        if (taskToDelete && window.confirm('Yakin ingin menghapus tugas ini?')) {
            const log = createHistoryLog(`Menghapus tugas: "${taskToDelete.title}".`);
            onUpdateProject(prev => ({ tasks: prev.tasks.filter(t => t.id !== taskId) }), log);
        }
    };
    
    const handleMarkTaskAsDone = (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const log = createHistoryLog(`Menandai tugas "${task.title}" sebagai selesai.`);
        onUpdateProject(
            prev => ({ tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: true } : t) }),
            log
        );
    };

    return (
        <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-gray-100">Tugas Proyek</h3>
                {canEdit && (
                    <button onClick={() => onOpenModal('task')} className="px-3 py-1 bg-secondary text-white text-sm rounded-lg hover:bg-green-700">
                        Tambah Tugas
                    </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto pr-2">
                <ul className="space-y-2">
                    {tasks.map(task => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const dueDate = new Date(task.dueDate);
                        const isOverdue = dueDate < today && !task.completed;
                        
                        const blockingTasks = (task.dependencies || [])
                            .map(depId => tasks.find(t => t.id === depId))
                            .filter((t): t is ProjectTask => !!t && !t.completed);
                        const isBlocked = blockingTasks.length > 0;

                        return (
                            <li key={task.id} className={`p-3 rounded-md ${
                                task.completed 
                                    ? 'bg-green-50 dark:bg-green-900/20' 
                                    : isOverdue 
                                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                                        : 'bg-gray-50 dark:bg-gray-700/50'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : 'dark:text-gray-100'}`}>{task.title}</p>
                                        <p className={`text-xs ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                                            for {task.assignee.name} - Due: {task.dueDate}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isBlocked && (
                                            <div className="relative group">
                                                <LockClosedIcon className="text-yellow-600 dark:text-yellow-400" />
                                                <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                                                    Terkunci oleh:
                                                    <ul className="list-disc list-inside">
                                                        {blockingTasks.map(bt => <li key={bt.id}>{bt.title}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                        <PriorityBadge priority={task.priority} />
                                    </div>
                                </div>
                                {canEdit && (
                                    <div className="flex items-center justify-end gap-3 mt-2">
                                        <button
                                            onClick={() => handleMarkTaskAsDone(task.id)}
                                            className={`text-xs font-semibold ${isBlocked || task.completed ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-800'}`}
                                            disabled={isBlocked || task.completed}
                                            title={isBlocked ? 'Selesaikan tugas prasyarat dulu' : 'Tandai Selesai'}
                                        >
                                            Tandai Selesai
                                        </button>
                                        <button onClick={() => onOpenModal('task', task)} className="text-blue-600 hover:text-blue-800" title="Edit Tugas"><PencilIcon /></button>
                                        <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 hover:text-red-800" title="Hapus Tugas"><TrashIcon /></button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                     {tasks.length === 0 && (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">Belum ada tugas.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

// Icons
const LockClosedIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={['w-5 h-5', className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;
const PencilIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={['w-5 h-5', className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={['w-5 h-5', className].filter(Boolean).join(' ')}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

export default TaskCard;
