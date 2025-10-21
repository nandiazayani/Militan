
import React, { useState } from 'react';
import { Project } from '../../types';
import { GoogleGenAI } from "@google/genai";

interface GeminiProjectAssistantProps {
    project: Project;
}

const GeminiProjectAssistant: React.FC<GeminiProjectAssistantProps> = ({ project }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [error, setError] = useState<string | null>(null);

    const generateAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult('');
        setIsModalOpen(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const prompt = `
Anda adalah seorang asisten manajer proyek ahli. Berdasarkan data proyek berikut, berikan analisis singkat yang mencakup area-area kunci ini:
1.  **Ringkasan Proyek:** Gambaran umum singkat tentang tujuan proyek.
2.  **Status & Kemajuan Saat Ini:** Penilaian berdasarkan linimasa dan tugas yang telah selesai.
3.  **Risiko Potensial:** Identifikasi potensi risiko berdasarkan tugas, anggaran, dan linimasa. Cari tugas prioritas tinggi yang belum selesai mendekati tenggat waktu, atau pengeluaran yang tinggi dibandingkan anggaran.
4.  **Rekomendasi:** Sarankan 1-2 langkah konkret berikutnya untuk Manajer Proyek.

Berikut adalah datanya dalam format JSON:
---
DATA PROYEK:
${JSON.stringify({
    name: project.name,
    status: project.status,
    timeline: `${project.startDate} hingga ${project.endDate}`,
    pic: project.pic.name,
    team: project.team.map(m => m.name),
    budget: project.budget,
    tasks: project.tasks.map(t => ({ title: t.title, completed: t.completed, dueDate: t.dueDate, priority: t.priority })),
    expenses: project.expenses.map(e => ({ item: e.item, amount: e.amount, status: e.status }))
})}
---

Sajikan analisis dalam format Markdown yang jelas dan terstruktur dengan baik. Gunakan Bahasa Indonesia.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setAnalysisResult(response.text);

        } catch (err) {
            console.error("Gemini API Error:", err);
            setError("Gagal menghasilkan analisis. Terjadi kesalahan saat berkomunikasi dengan Gemini AI.");
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        if (isLoading) return;
        setIsModalOpen(false);
        setAnalysisResult('');
        setError(null);
    };

    return (
        <>
            <div className="bg-surface rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-100">Asisten AI Proyek</h3>
                        <p className="text-sm text-gray-400">Dapatkan ringkasan, risiko, dan rekomendasi dari Gemini AI.</p>
                    </div>
                    <button
                        onClick={generateAnalysis}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500 transition shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <SparklesIcon />
                        <span>Analisis Proyek</span>
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <SparklesIcon className="text-primary"/>
                                Analisis Proyek oleh Gemini AI
                            </h3>
                             <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-600">&times;</button>
                        </div>
                        <div className="overflow-y-auto pr-4 -mr-4">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-48">
                                    <SpinnerIcon />
                                    <p className="mt-2 text-gray-300">Menganalisis data proyek...</p>
                                </div>
                            )}
                            {error && <p className="text-red-500">{error}</p>}
                            {analysisResult && (
                                <div 
                                    className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap"
                                >
                                   {analysisResult}
                                </div>
                            )}
                        </div>
                         <div className="mt-6 flex justify-end gap-3 border-t pt-4 border-gray-700">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Icons
const SparklesIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.696-2.696L11.25 18l1.938-.648a3.375 3.375 0 002.696-2.696L16.25 13l.648 1.938a3.375 3.375 0 002.696 2.696L21.5 18l-1.938.648a3.375 3.375 0 00-2.696 2.696z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default GeminiProjectAssistant;