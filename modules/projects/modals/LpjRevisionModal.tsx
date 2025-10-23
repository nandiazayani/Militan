import React, { useState } from 'react';
import { Project } from '../../../types';

interface LpjRevisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveRevision: (revisionNotes: string) => void;
    onApprove: () => void;
    project: Project;
}

const LpjRevisionModal: React.FC<LpjRevisionModalProps> = ({ isOpen, onClose, onSaveRevision, onApprove, project }) => {
    const [revisionNotes, setRevisionNotes] = useState('');

    const handleRequestRevision = () => {
        if (!revisionNotes.trim()) {
            alert('Harap isi catatan revisi.');
            return;
        }
        onSaveRevision(revisionNotes);
    };

    if (!isOpen || !project.lpj) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4 text-white">Review LPJ</h3>
                
                <div className="bg-gray-700/50 p-3 rounded-lg mb-4 text-sm space-y-1">
                    <h4 className="font-semibold text-gray-200">Detail LPJ dari {project.pic.name}</h4>
                    <p className="text-gray-300 whitespace-pre-wrap">{project.lpj.notes}</p>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Catatan Revisi (Opsional)</label>
                    <textarea 
                        value={revisionNotes} 
                        onChange={(e) => setRevisionNotes(e.target.value)}
                        rows={4}
                        className="w-full bg-gray-700 rounded-md p-2 text-sm text-gray-100 focus:ring-primary focus:border-primary"
                        placeholder="Jika ada yang perlu diperbaiki, tuliskan di sini..."
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button onClick={handleRequestRevision} className="px-4 py-2 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-700">Minta Revisi</button>
                    <button onClick={onApprove} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Setujui LPJ</button>
                </div>
            </div>
        </div>
    );
};

export default LpjRevisionModal;
