
import React, { useState, useContext, useMemo } from 'react';
// FIX: Corrected import path for DataContext to resolve context type errors.
import { DataContext } from '../../contexts/DataContext';
import { Notification, NotificationType, Page } from '../../types';
import { GoogleGenAI } from "@google/genai";

// AI Smart Summary Component
const AISmartSummary: React.FC = () => {
    const dataContext = useContext(DataContext);
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    if (!dataContext) return null;
    const { allNotifications } = dataContext;

    const unreadNotifications = allNotifications.filter(n => !n.read);

    const handleGenerateSummary = async () => {
        if (unreadNotifications.length === 0) {
            alert("Tidak ada notifikasi baru untuk diringkas.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSummary('');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
Anda adalah asisten yang efisien. Berdasarkan daftar pesan notifikasi berikut, buatlah ringkasan singkat dalam 1-2 kalimat yang menyoroti poin-poin paling penting (misalnya, jumlah tugas mendesak, proyek baru, atau item yang memerlukan perhatian).

Pesan Notifikasi:
${unreadNotifications.map(n => `- ${n.message}`).join('\n')}

Gunakan Bahasa Indonesia.
`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setSummary(response.text);
        } catch (err) {
            console.error("AI Summary Error:", err);
            setError("Gagal membuat ringkasan. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    if (allNotifications.filter(n => !n.read).length === 0) {
        return null; // Don't show if no unread notifications
    }

    return (
        <div className="bg-surface rounded-xl shadow-lg p-4 mb-6 border border-primary/30">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-md font-semibold text-text-primary flex items-center gap-2">
                        <SparklesIcon className="text-primary h-5 w-5" />
                        Ringkasan Notifikasi Cerdas
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">Anda memiliki {unreadNotifications.length} notifikasi belum dibaca.</p>
                </div>
                 {!summary && !isLoading && (
                    <button
                        onClick={handleGenerateSummary}
                        className="px-3 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-gray-500 transition text-xs"
                    >
                        Buat Ringkasan AI
                    </button>
                )}
            </div>
             {isLoading && (
                <div className="flex items-center justify-center h-16">
                    <SpinnerIcon />
                    <p className="ml-2 text-gray-300 text-sm">Menganalisis notifikasi...</p>
                </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {summary && (
                 <div className="text-gray-200 bg-gray-700/50 p-3 rounded-lg mt-3">
                    <p className="whitespace-pre-wrap text-sm">{summary}</p>
                    <button 
                        onClick={handleGenerateSummary} 
                        className="text-primary hover:underline text-xs mt-2 font-semibold"
                        disabled={isLoading}
                    >
                        Buat Ulang
                    </button>
                </div>
            )}
        </div>
    );
};


interface NotificationPageProps {
    onSelectProject: (projectId: string) => void;
    onSelectUser: (userId: string) => void;
}

const NotificationPage: React.FC<NotificationPageProps> = ({ onSelectProject, onSelectUser }) => {
    const dataContext = useContext(DataContext);
    const [statusFilter, setStatusFilter] = useState<'all' | 'unread'>('all');
    const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');

    if (!dataContext) return null;

    const { allNotifications, markNotificationsAsRead } = dataContext;

    const filteredNotifications = useMemo(() => {
        return allNotifications.filter(n => {
            const statusMatch = statusFilter === 'all' || !n.read;
            const typeMatch = typeFilter === 'all' || n.type === typeFilter;
            return statusMatch && typeMatch;
        });
    }, [allNotifications, statusFilter, typeFilter]);

    const handleNotificationClick = (notification: Notification) => {
        if (notification.link) {
            if (notification.link.page === 'projects') {
                onSelectProject(notification.link.id);
            } else if (notification.link.page === 'users') {
                onSelectUser(notification.link.id);
            }
        }
    };

    const timeSince = (dateString: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit lalu";
        return Math.floor(seconds) + " detik lalu";
    };

    const notificationTypes: NotificationType[] = ['task_completed', 'new_project', 'general'];

    const getIconForType = (type: NotificationType) => {
        switch (type) {
            case 'task_completed': return <CheckCircleIcon className="text-green-400" />;
            case 'new_project': return <FolderPlusIcon className="text-blue-400" />;
            default: return <InformationCircleIcon className="text-gray-400" />;
        }
    };

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-text-primary">Semua Notifikasi</h2>
                <button 
                    onClick={markNotificationsAsRead} 
                    className="px-4 py-2 text-sm bg-secondary text-white rounded-lg hover:bg-gray-500 transition disabled:opacity-50"
                    disabled={allNotifications.every(n => n.read)}
                >
                    Tandai Semua Sudah Dibaca
                </button>
            </div>

            <AISmartSummary />

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-300">Status:</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'unread')} className="bg-gray-700 border-gray-600 rounded-md px-2 py-1 text-sm">
                        <option value="all">Semua</option>
                        <option value="unread">Belum Dibaca</option>
                    </select>
                </div>
                 <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-300">Tipe:</label>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as NotificationType | 'all')} className="bg-gray-700 border-gray-600 rounded-md px-2 py-1 text-sm">
                        <option value="all">Semua</option>
                        {notificationTypes.map(type => (
                            <option key={type} value={type} className="capitalize">{type.replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Notification List */}
            <div className="space-y-3">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`flex items-start gap-4 p-4 rounded-lg border ${notification.link ? 'cursor-pointer hover:bg-gray-700/50' : ''} ${notification.read ? 'bg-surface border-gray-700' : 'bg-primary/10 border-primary/30'}`}
                        >
                            <div className="flex-shrink-0 mt-1">
                                {getIconForType(notification.type)}
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm ${notification.read ? 'text-gray-300' : 'text-gray-100 font-medium'}`}>{notification.message}</p>
                                <p className="text-xs text-text-primary mt-1">{timeSince(notification.timestamp)}</p>
                            </div>
                            {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" title="Unread"></div>}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Tidak ada notifikasi yang cocok dengan filter Anda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Icons
const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const FolderPlusIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const InformationCircleIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>;
const SparklesIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.696-2.696L11.25 18l1.938-.648a3.375 3.375 0 002.696-2.696L16.25 13l.648 1.938a3.375 3.375 0 002.696 2.696L21.5 18l-1.938.648a3.375 3.375 0 00-2.696 2.696z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default NotificationPage;
