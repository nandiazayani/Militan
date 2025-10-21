
import React, { useState, useContext } from 'react';
import { DataContext } from '../../App';
import { GoogleGenAI } from "@google/genai";

const AISummaryCard: React.FC = () => {
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dataContext = useContext(DataContext);

    const handleGenerateSummary = async () => {
        if (!dataContext) {
            setError("Data context not available.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSummary('');

        const { allProjects } = dataContext;

        const totalRevenue = allProjects.reduce((sum, p) => sum + p.budget.pemasukan, 0);
        const totalModal = allProjects.reduce((sum, p) => sum + p.budget.modal, 0);
        const totalExpense = allProjects.reduce((sum, p) => {
            return sum + p.expenses.reduce((expenseSum, item) => expenseSum + item.amount, 0);
        }, 0);
        const activeProjects = allProjects.filter(p => p.status === 'On Progress').length;
        const completedProjects = allProjects.filter(p => p.status === 'Completed').length;

        const kpiData = {
            totalProjects: allProjects.length,
            activeProjects,
            completedProjects,
            totalRevenue,
            totalModal,
            totalExpense,
            profit: totalRevenue - totalExpense,
            projects: allProjects.slice(0, 5).map(p => ({
                name: p.name,
                status: p.status,
                profit: p.budget.pemasukan - p.expenses.reduce((s, e) => s + e.amount, 0)
            }))
        };
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
Anda adalah seorang analis bisnis AI. Berdasarkan data Key Performance Indicator (KPI) berikut, buatlah ringkasan naratif singkat (sekitar 3-4 kalimat) tentang kinerja bisnis saat ini.
Berikan wawasan yang tajam dan mudah dipahami untuk seorang manajer.

Fokus pada:
- Kondisi keuangan secara umum (pendapatan, pengeluaran, profit).
- Status proyek (berapa yang aktif, berapa yang selesai).
- Sorot satu proyek yang paling menguntungkan atau proyek aktif yang penting.

Data KPI:
${JSON.stringify(kpiData)}

Gunakan Bahasa Indonesia yang profesional dan lugas.
`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setSummary(response.text);

        } catch (err) {
            console.error("Gemini summary generation error:", err);
            setError("Gagal menghasilkan ringkasan. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <SparklesIcon className="text-primary" />
                        Ringkasan Kinerja AI
                    </h3>
                    <p className="text-sm text-gray-400">Dapatkan wawasan instan dari data dasbor Anda.</p>
                </div>
                {!summary && !isLoading && (
                    <button
                        onClick={handleGenerateSummary}
                        className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500 transition text-sm"
                    >
                        Buat Ringkasan
                    </button>
                )}
            </div>

            {isLoading && (
                <div className="flex items-center justify-center h-24">
                    <SpinnerIcon />
                    <p className="ml-2 text-gray-300">Menganalisis data...</p>
                </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {summary && (
                 <div className="text-gray-200 bg-gray-700/50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{summary}</p>
                    <button 
                        onClick={handleGenerateSummary} 
                        className="text-primary hover:underline text-xs mt-3 font-semibold"
                        disabled={isLoading}
                    >
                        Buat Ulang
                    </button>
                </div>
            )}
        </div>
    );
};

// Icons
const SparklesIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.696-2.696L11.25 18l1.938-.648a3.375 3.375 0 002.696-2.696L16.25 13l.648 1.938a3.375 3.375 0 002.696 2.696L21.5 18l-1.938.648a3.375 3.375 0 00-2.696 2.696z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default AISummaryCard;