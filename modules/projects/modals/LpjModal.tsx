import React, { useState, useEffect, useRef, useMemo } from 'react';
// FIX: Corrected import path for types
import { Lpj, LpjStatus, Project } from '../../../types';

interface LpjModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (lpj: Lpj) => void;
    project: Project;
}

const LpjModal: React.FC<LpjModalProps> = ({ isOpen, onClose, onSave, project }) => {
    const [notes, setNotes] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const calculatedTotalExpense = useMemo(() => {
        return project.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }, [project.expenses]);

    useEffect(() => {
        if (project) {
            const lpj = project.lpj;
            setNotes(lpj?.notes || '');
            setAttachments(lpj?.attachments || []);
            setTotalIncome(lpj?.financialSummary.totalIncome || project.budget.pemasukan);
            setTotalExpense(lpj?.financialSummary.totalExpense || calculatedTotalExpense);
        }
    }, [project, isOpen, calculatedTotalExpense]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            // FIX: Explicitly type 'file' as File to access its 'name' property.
            const newFiles = Array.from(event.target.files).map((file: File) => file.name);
            setAttachments(prev => [...new Set([...prev, ...newFiles])]);
        }
    };

    const removeAttachment = (filenameToRemove: string) => {
        setAttachments(prev => prev.filter(name => name !== filenameToRemove));
    };

    const handleSave = (status: LpjStatus) => {
        const finalBalance = totalIncome - totalExpense;
        const lpjData: Lpj = {
            id: project.lpj?.id || `lpj${Date.now()}`,
            status,
            notes,
            attachments,
            financialSummary: {
                totalIncome,
                totalExpense,
                finalBalance,
            },
            submittedDate: project.lpj?.submittedDate,
            approvedDate: project.lpj?.approvedDate
        };
        onSave(lpjData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4 text-white">{project.lpj ? 'Edit LPJ' : 'Buat Laporan Pertanggungjawaban'}</h3>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Catatan & Ringkasan Laporan</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={6}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100"
                            placeholder="Jelaskan hasil pelaksanaan kegiatan, penggunaan dana, dan output yang dihasilkan..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Ringkasan Keuangan</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-700/50 rounded-lg">
                             <div>
                                <label className="text-xs text-gray-400">Total Pemasukan (Rp)</label>
                                <input type="number" value={totalIncome} onChange={e => setTotalIncome(Number(e.target.value))} className="mt-1 w-full bg-gray-600 rounded p-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Total Pengeluaran (Rp)</label>
                                <input type="number" value={totalExpense} onChange={e => setTotalExpense(Number(e.target.value))} className="mt-1 w-full bg-gray-600 rounded p-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Saldo Akhir (Rp)</label>
                                <input type="text" readOnly value={(totalIncome - totalExpense).toLocaleString('id-ID')} className="mt-1 w-full bg-gray-800 rounded p-2 text-sm font-bold" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Lampiran (Bukti, Dokumentasi, dll.)</label>
                        <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-1 w-full flex justify-center items-center gap-2 px-4 py-2 border border-dashed border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
                        >
                            <UploadIcon />
                            <span>Unggah File</span>
                        </button>
                         <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                            {attachments.map(name => (
                                <div key={name} className="flex items-center justify-between text-sm bg-gray-700 p-1.5 rounded">
                                    <span className="truncate text-gray-200 pr-2">{name}</span>
                                    <button onClick={() => removeAttachment(name)} className="text-red-500 hover:text-red-700 flex-shrink-0">
                                       <XCircleIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3 border-t border-gray-700 pt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button onClick={() => handleSave(LpjStatus.Draft)} className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-gray-500">Simpan sebagai Draft</button>
                    <button onClick={() => handleSave(LpjStatus.Submitted)} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500">Ajukan untuk Review</button>
                </div>
            </div>
        </div>
    );
};

// Icons
const UploadIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
const XCircleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default LpjModal;
