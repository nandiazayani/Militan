

import React, { useState } from 'react';
import { UserTask, TaskPriority } from '../../types';
import { GoogleGenAI, Type } from "@google/genai";

interface AITaskPrioritizerProps {
    tasks: UserTask[];
    onUpdateTasks: (task: UserTask) => Promise<void>;
}

interface PrioritizedTask {
    id: string;
    reason: string;
    newPriority: TaskPriority;
}

const AITaskPrioritizer: React.FC<AITaskPrioritizerProps> = ({ tasks, onUpdateTasks }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [prioritizedTasks, setPrioritizedTasks] = useState<PrioritizedTask[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handlePrioritize = async () => {
        if (tasks.length === 0) {
            alert("Tidak ada tugas yang perlu diprioritaskan.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setPrioritizedTasks([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const tasksToAnalyze = tasks.map(t => ({
                id: t.id,
                title: t.title,
                dueDate: t.dueDate,
                currentPriority: t.priority
            }));

            const prompt = `
Anda adalah seorang asisten manajer yang sangat efisien. Tugas Anda adalah memprioritaskan daftar tugas berikut.
Pertimbangkan urgensi (tanggal tenggat) dan kepentingan yang tersirat dari judul tugas.

Kriteria Prioritas:
- High: Sangat mendesak, berdampak besar, atau memblokir pekerjaan lain.
- Medium: Penting dan harus dikerjakan segera, tetapi tidak se-kritis 'High'.
- Low: Tugas rutin atau yang bisa ditunda jika ada hal yang lebih mendesak.

Data Tugas Saat Ini:
${JSON.stringify(tasksToAnalyze, null, 2)}

Analisis setiap tugas dan tentukan prioritas barunya ('High', 'Medium', atau 'Low').
Berikan alasan singkat (maksimal 10 kata) untuk setiap keputusan prioritas.
Kembalikan hasilnya sebagai objek JSON.
`;

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    prioritizedTasks: {
                        type: Type.ARRAY,
                        description: "Daftar tugas yang telah diprioritaskan.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING, description: "ID unik dari tugas." },
                                newPriority: { 
                                    type: Type.STRING, 
                                    description: "Prioritas baru yang disarankan ('High', 'Medium', atau 'Low').",
                                    enum: [TaskPriority.High, TaskPriority.Medium, TaskPriority.Low]
                                },
                                reason: { type: Type.STRING, description: "Alasan singkat untuk prioritas baru." }
                            },
                            required: ["id", "newPriority", "reason"]
                        }
                    }
                },
                required: ["prioritizedTasks"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema,
                }
            });

            const result = JSON.parse(response.text) as { prioritizedTasks: PrioritizedTask[] };
            setPrioritizedTasks(result.prioritizedTasks);

        } catch (err) {
            console.error("AI Prioritization Error:", err);
            setError("Gagal memprioritaskan tugas. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const applyPriorities = async () => {
        if (prioritizedTasks.length === 0) return;

        setIsLoading(true);
        try {
            const updatePromises = prioritizedTasks.map(pTask => {
                const originalTask = tasks.find(t => t.id === pTask.id);
                if (originalTask) {
                    return onUpdateTasks({ ...originalTask, priority: pTask.newPriority });
                }
                return Promise.resolve();
            });
            await Promise.all(updatePromises);
            setPrioritizedTasks([]); // Clear suggestions after applying
        } catch (err) {
            console.error("Error applying priorities:", err);
            setError("Gagal menerapkan prioritas baru.");
        } finally {
            setIsLoading(false);
        }
    };

    if (tasks.length === 0) {
        return null; // Don't render if no tasks to prioritize
    }

    return (
        <div className="bg-surface rounded-xl shadow-lg p-4 border border-primary/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="text-primary" />
                    <div>
                        <h4 className="font-semibold text-text-primary">Prioritaskan Tugas dengan AI</h4>
                        <p className="text-sm text-text-secondary">Biarkan Gemini membantu mengurutkan tugas 'To Do' Anda.</p>
                    </div>
                </div>
                {!isLoading && prioritizedTasks.length === 0 && (
                    <button onClick={handlePrioritize} className="px-3 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500 transition text-sm">
                        Prioritaskan
                    </button>
                )}
            </div>
            {isLoading && (
                 <div className="flex items-center justify-center h-24">
                    <SpinnerIcon />
                    <p className="ml-2 text-gray-300">Menganalisis tugas...</p>
                </div>
            )}
             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {prioritizedTasks.length > 0 && !isLoading && (
                <div className="mt-4">
                    <h5 className="text-sm font-bold mb-2 text-gray-200">Saran Prioritas:</h5>
                    <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {prioritizedTasks.map(pTask => {
                             const originalTask = tasks.find(t => t.id === pTask.id);
                             if (!originalTask) return null;
                             return (
                                <li key={pTask.id} className="text-sm p-2 bg-gray-700 rounded-md">
                                    <p className="font-medium text-gray-100">{originalTask.title}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-400">Saran: <span className="font-semibold text-primary">{pTask.newPriority}</span></p>
                                        <p className="text-text-primary italic text-xs">({pTask.reason})</p>
                                    </div>
                                </li>
                             );
                        })}
                    </ul>
                     <div className="flex justify-end gap-2 mt-4 border-t border-gray-700 pt-3">
                        <button onClick={() => setPrioritizedTasks([])} className="px-3 py-1 text-sm bg-gray-600 rounded-md hover:bg-gray-500">Abaikan</button>
                        <button onClick={applyPriorities} className="px-3 py-1 text-sm bg-secondary text-white rounded-md hover:bg-green-700">Terapkan</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Icons
const SparklesIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.696-2.696L11.25 18l1.938-.648a3.375 3.375 0 002.696-2.696L16.25 13l.648 1.938a3.375 3.375 0 002.696 2.696L21.5 18l-1.938.648a3.375 3.375 0 00-2.696 2.696z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default AITaskPrioritizer;