import React, { useState, useEffect } from 'react';
import { Project } from '../../../types';

interface LpjModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (notes: string) => void;
    project: Project;
}

const LpjModal: React.FC<LpjModalProps> = ({ isOpen, onClose, onSave, project }) => {
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            setNotes(project.lpj?.notes || '');
        }
    }, [isOpen, project]);

    const handleSave = () => {
        if (!notes.trim()) {
            alert('Catatan LPJ tidak boleh kosong.');
            return;
        }
        onSave(notes);
    };

    if (!isOpen) return null;

    const totalExpenses = project.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const profit = project.budget.pemasukan - totalExpenses;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4 text-white">Laporan Pertanggungjawaban (LPJ)</h3>
                
                <div className="bg-gray-700/50 p-3 rounded-lg mb-4 text-sm">
                    <p><strong>Proyek:</strong> {project.name}</p>
                    <p><strong>Total Pemasukan:</strong> Rp {project.budget.pemasukan.toLocaleString('id-ID')}</p>
                    <p><strong>Total Pengeluaran:</strong> Rp {totalExpenses.toLocaleString('id-ID')}</p>
                    <p className={`font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <strong>Profit/Loss:</strong> Rp {profit.toLocaleString('id-ID')}
                    </p>
                </div>

                {project.lpj?.status === 'Revision' && project.lpj.revisionNotes && (
                     <div className="mb-4 p-3 border border-orange-500 bg-orange-900/20 rounded-lg">
                        <p className="font-bold text-orange-400 text-sm">Catatan Revisi dari Manajer:</p>
                        <p className="text-sm text-orange-200 whitespace-pre-wrap">{project.lpj.revisionNotes}</p>
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Catatan / Ringkasan LPJ</label>
                    <textarea 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)}
                        rows={5}
                        className="w-full bg-gray-700 rounded-md p-2 text-sm text-gray-100 focus:ring-primary focus:border-primary"
                        placeholder="Tuliskan ringkasan, hasil, dan evaluasi proyek di sini..."
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500">Kirim untuk Review</button>
                </div>
            </div>
        </div>
    );
};

export default LpjModal;
