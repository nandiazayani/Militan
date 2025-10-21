import React, { useState, useEffect, useMemo } from 'react';
// FIX: Corrected import path for types
import { ProjectTask, User, TaskPriority } from '../../../types';

const getUpstreamDependencies = (taskId: string, allTasks: ProjectTask[]): Set<string> => {
    const upstream = new Set<string>();
    const tasksToCheck = [...allTasks.filter(t => t.dependencies?.includes(taskId))];
    
    while (tasksToCheck.length > 0) {
        const currentTask = tasksToCheck.pop();
        if (currentTask && !upstream.has(currentTask.id)) {
            upstream.add(currentTask.id);
            const parents = allTasks.filter(t => t.dependencies?.includes(currentTask.id));
            tasksToCheck.push(...parents);
        }
    }
    return upstream;
};

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: ProjectTask) => void;
    task: ProjectTask | null;
    projectTeam: User[];
    allTasks: ProjectTask[];
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task, projectTeam, allTasks }) => {
    const [title, setTitle] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
    const [dependencies, setDependencies] = useState<string[]>([]);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setAssigneeId(task.assignee.id);
            setDueDate(task.dueDate);
            setPriority(task.priority);
            setDependencies(task.dependencies || []);
        } else {
            setTitle('');
            setAssigneeId('');
            setDueDate('');
            setPriority(TaskPriority.Medium);
            setDependencies([]);
        }
    }, [task, isOpen]);

    const handleSave = () => {
        const assignee = projectTeam.find(u => u.id === assigneeId);
        if (!title.trim() || !assignee || !dueDate) {
            alert('Judul, penanggung jawab, dan tanggal tenggat harus diisi.');
            return;
        }
        onSave({
            id: task?.id || `pt${Date.now()}`,
            title,
            assignee,
            dueDate,
            priority,
            completed: task?.completed || false,
            dependencies,
        });
    };
    
    const handleDependencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // FIX: Explicitly type 'option' as HTMLOptionElement to access its 'value' property.
        const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        setDependencies(selectedOptions);
    };

    const availableTasksForDependency = useMemo(() => {
        if (!task) {
            return allTasks;
        }
        const upstreamIds = getUpstreamDependencies(task.id, allTasks);
        return allTasks.filter(t => t.id !== task.id && !upstreamIds.has(t.id));
    }, [task, allTasks]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[51]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4 dark:text-white">{task ? 'Edit Tugas' : 'Tambah Tugas'}</h3>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul Tugas</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Penanggung Jawab</label>
                            <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100">
                                <option value="">-- Pilih Anggota --</option>
                                {projectTeam.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Tenggat</label>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prioritas</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100">
                            {/* FIX: Explicitly type 'p' to resolve 'unknown' type error. */}
                            {Object.values(TaskPriority).map((p: TaskPriority) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tugas Prasyarat (Dependencies)</label>
                        <select multiple value={dependencies} onChange={handleDependencyChange} className="mt-1 block w-full h-32 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100">
                            {availableTasksForDependency.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                         <p className="text-xs text-text-primary mt-1">Tugas ini baru bisa dikerjakan setelah tugas yang dipilih selesai. Tahan Ctrl/Cmd untuk memilih beberapa.</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Batal</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Simpan</button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
