import React, { useState } from 'react';
import { Project, User, UserRole } from '../../../types';
import { GoogleGenAI } from "@google/genai";

interface HandoverModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newPIC: User, briefingContent: string) => void;
    project: Project;
    allUsers: User[];
}

const HandoverModal: React.FC<HandoverModalProps> = ({ isOpen, onClose, onSave, project, allUsers }) => {
    const [selectedPicId, setSelectedPicId] = useState('');
    const [briefing, setBriefing] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const eligibleUsers = allUsers.filter(u => u.id !== project.pic.id && (u.role === UserRole.Manager || u.role === UserRole.Staff));

    const handleGenerateBriefing = async () => {
        if (!selectedPicId) {
            setError('Silakan pilih PIC baru terlebih dahulu.');
            return;
        }
        setIsGenerating(true);
        setError('');
        setBriefing('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const urgentTasks = project.tasks
                .filter(t => !t.completed && new Date(t.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                .map(t => t.title)
                .join(', ') || 'Tidak ada';

            const prompt = `
            Anda adalah asisten manajer proyek yang bertugas membuat "Digital Handover Briefing" untuk serah terima tanggung jawab.
            Buat ringkasan yang jelas, singkat, dan padat dalam format Markdown berdasarkan data proyek berikut untuk PIC baru.

            Fokus pada informasi paling kritis:
            1.  **Status Proyek Saat Ini:** Berikan ringkasan singkat status proyek.
            2.  **Anggaran:** Sorot sisa anggaran (pemasukan - pengeluaran).
            3.  **Tugas Mendesak:** Sebutkan tugas-tugas penting yang akan datang atau yang mendekati tenggat waktu.
            4.  **Aktivitas Terkini:** Sebutkan 1-2 aksi terakhir yang tercatat dalam riwayat proyek.

            Data Proyek:
            - Nama Proyek: ${project.name}
            - Status: ${project.status}
            - Pemasukan: Rp ${project.budget.pemasukan.toLocaleString('id-ID')}
            - Total Pengeluaran: Rp ${project.expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('id-ID')}
            - Tugas Mendesak (dalam 7 hari ke depan): ${urgentTasks}
            - Riwayat Aktivitas Terakhir: ${project.history.slice(0, 2).map(h => `${h.user.name} ${h.action}`).join('; ')}

            Gunakan Bahasa Indonesia yang profesional.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setBriefing(response.text);

        } catch (err) {
            console.error("Gemini briefing generation error:", err);
            setError("Gagal membuat briefing. Silakan coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleInitiateHandover = () => {
        const newPIC = allUsers.find(u => u.id === selectedPicId);
        if (!newPIC || !briefing) {
            setError('Briefing harus dibuat sebelum melanjutkan.');
            return;
        }
        onSave(newPIC, briefing);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4 text-white">Formulir Serah Terima PIC</h3>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Step 1 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">PIC Saat Ini</label>
                        <input type="text" readOnly value={`${project.pic.name} (${project.pic.role})`} className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-gray-400" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Pilih PIC Baru</label>
                        <select
                            value={selectedPicId}
                            onChange={(e) => setSelectedPicId(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100"
                        >
                            <option value="">-- Pilih Pengguna --</option>
                            {eligibleUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.department})</option>)}
                        </select>
                    </div>

                    {/* Step 2 */}
                    <div className="pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-300">Digital Handover Briefing (Dihasilkan AI)</label>
                            <button
                                onClick={handleGenerateBriefing}
                                disabled={!selectedPicId || isGenerating}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-black font-semibold rounded-md hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {isGenerating ? <SpinnerIcon /> : <SparklesIcon />}
                                <span>Buat Briefing</span>
                            </button>
                        </div>
                        <div className="mt-2 p-3 bg-gray-800 rounded-md min-h-[150px] border border-gray-600 whitespace-pre-wrap text-sm text-gray-200">
                            {isGenerating && <p className="text-gray-400">Menghasilkan briefing...</p>}
                            {briefing || ''}
                        </div>
                         {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3 border-t border-gray-700 pt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button
                        onClick={handleInitiateHandover}
                        disabled={!briefing || isGenerating}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Mulai Serah Terima
                    </button>
                </div>
            </div>
        </div>
    );
};

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-15l1.09 2.18L12 6l-2.18 1.09L9 9.27l-1.09-2.18L6 6l2.18-1.09L9 2.73zM18 15l-1.09-2.18L15 12l2.18-1.09L18 8.73l1.09 2.18L21 12l-2.18 1.09L18 15z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default HandoverModal;