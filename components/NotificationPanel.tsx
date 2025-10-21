import React, { useContext } from 'react';
import { DataContext } from '../App';
import { Notification, Page } from '../types';

interface NotificationPanelProps {
    onSelectProject: (projectId: string) => void;
    onSelectUser: (userId: string) => void;
    setCurrentPage: (page: Page) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onSelectProject, onSelectUser, setCurrentPage }) => {
    const dataContext = useContext(DataContext);

    if (!dataContext) return null;

    const { allNotifications } = dataContext;

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

    return (
        <div className="absolute right-0 mt-3 w-80 bg-surface rounded-md shadow-lg border border-gray-700 z-50">
            <div className="p-3 border-b border-gray-700">
                <h4 className="font-semibold text-text-primary">Notifikasi</h4>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {allNotifications.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-6">Tidak ada notifikasi.</p>
                ) : (
                    <ul>
                        {allNotifications.slice(0, 10).map(notification => (
                            <li
                                key={notification.id}
                                className={`p-3 border-b border-gray-700 last:border-b-0 ${notification.link ? 'cursor-pointer hover:bg-gray-700' : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex items-start gap-3">
                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                                    )}
                                    <div className={`flex-1 ${notification.read ? 'pl-5' : ''}`}>
                                        <p className="text-sm text-gray-200">{notification.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{timeSince(notification.timestamp)}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="p-2 text-center bg-gray-700/50">
                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('notifications'); }} className="text-xs text-primary hover:underline font-semibold">Lihat Semua Notifikasi</a>
            </div>
        </div>
    );
};

export default NotificationPanel;
