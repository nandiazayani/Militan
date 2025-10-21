import React, { useState, useEffect, useRef } from 'react';
import { DailyReport, DailyTask, DailyReportStatus } from '../../../types';

interface DailyReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (report: DailyReport) => void;
    userId: string;
    date: string; // YYYY-MM-DD
    existingReport: DailyReport | null | undefined;
    readOnly?: boolean;
}

const DailyReportModal: React.FC<DailyReportModalProps> = ({ isOpen, onClose, onSave, userId, date, existingReport, readOnly = false }) => {
    const [tasks, setTasks] = useState<DailyTask[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [taskToAttachFile, setTaskToAttachFile] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setTasks(existingReport?.tasks || [{ id: `dt${Date.now()}`, description: '', hoursSpent: 0, attachments: [] }]);
        }
    }, [isOpen, existingReport]);
    
    const handleTaskChange = (taskId: string, field: keyof DailyTask, value: string | number | string[]) => {
        setTasks(currentTasks => currentTasks.map(task => 
            task.id === taskId ? { ...task, [field]: value } : task
        ));
    };

    const addNewTask = () => {
        setTasks(prev => [...prev, { id: `dt${Date.now()}`, description: '', hoursSpent: 0, attachments: [] }]);
    };

    const removeTask = (taskId: string) => {
        if (tasks.length > 1) {
            setTasks(prev => prev.filter(task => task.id !== taskId));
        } else {
            alert("Setidaknya harus ada satu tugas dalam laporan.");
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && taskToAttachFile) {
            const newFiles = Array.from(event.target.files).map(file => file.name);
            const task = tasks.find(t => t.id === taskToAttachFile);
            if(task) {
                const updatedAttachments = [...new Set([...task.attachments, ...newFiles])];
                handleTaskChange(taskToAttachFile, 'attachments', updatedAttachments);
            }
        }
        setTaskToAttachFile(null);
    };

    const triggerFileInput = (taskId: string) => {
        setTaskToAttachFile(taskId);
        fileInputRef.current?.click();
    };
    
    const handleSaveReport = (status: DailyReportStatus) => {
        const report: DailyReport = {
            id: existingReport?.id || `dr${Date.now()}`,
            userId,
            date,
            tasks,
            status,
            history: existingReport?.history || []
        };
        onSave(report);
    };
    
    const formatTimestamp = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[51]">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4 text-white">Laporan Harian - {date}</h3>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {tasks.map((task, index) => (
                        <div key={task.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-200">Tugas #{index + 1}</h4>
                                {!readOnly && <button onClick={() => removeTask(task.id)} className="text-red-400 hover:text-red-300"><TrashIcon/></button>}
                            </div>
                            <textarea
                                value={task.description}
                                onChange={(e) => handleTaskChange(task.id, 'description', e.target.value)}
                                placeholder="Deskripsi pekerjaan yang dilakukan..."
                                rows={2}
                                className="w-full bg-gray-600 rounded-md p-2 text-sm text-gray-100 focus:ring-primary focus:border-primary disabled:opacity-70"
                                disabled={readOnly}
                            />
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="text-xs text-gray-400">Jam Pengerjaan</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        value={task.hoursSpent}
                                        onChange={(e) => handleTaskChange(task.id, 'hoursSpent', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-gray-600 rounded-md p-2 text-sm text-gray-100 disabled:opacity-70"
                                        disabled={readOnly}
                                    />
                                </div>
                                 <div>
                                    <label className="text-xs text-gray-400">Lampiran</label>
                                    <button onClick={() => triggerFileInput(task.id)} className="w-full text-center p-2 bg-secondary text-white text-sm rounded-md hover:bg-gray-500 disabled:opacity-50" disabled={readOnly}>Unggah File</button>
                                </div>
                            </div>
                            {task.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {task.attachments.map(file => (
                                        <p key={file} className="text-xs text-primary truncate">📄 {file}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                     {!readOnly && (
                        <button onClick={addNewTask} className="w-full py-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition">
                            + Tambah Tugas Lain
                        </button>
                    )}

                    {existingReport?.history && existingReport.history.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                            <h4 className="font-semibold text-gray-200 mb-2">Riwayat Laporan</h4>
                            <div className="space-y-3 text-xs max-h-28 overflow-y-auto">
                                {existingReport.history.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(log => (
                                    <div key={log.id} className="flex items-start gap-2">
                                        <img src={log.user.avatarUrl} alt={log.user.name} className="w-6 h-6 rounded-full mt-0.5" />
                                        <div>
                                            <p className="text-gray-300">
                                                <span className="font-bold">{log.user.name}</span> {log.action}
                                            </p>
                                            <p className="text-gray-500">{formatTimestamp(log.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-700 pt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Tutup</button>
                    {!readOnly && (
                        <>
                            <button onClick={() => handleSaveReport(DailyReportStatus.Draft)} className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-gray-500">Simpan Draft</button>
                            <button onClick={() => handleSaveReport(DailyReportStatus.Submitted)} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500">Kirim Laporan</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const TrashIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

export default DailyReportModal;