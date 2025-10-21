import React, { useMemo } from 'react';
import { ProjectHistoryLog } from '../../types';

interface HistoryCardProps {
    history?: ProjectHistoryLog[];
}

const HistoryCard: React.FC<HistoryCardProps> = ({ history = [] }) => {
    
    const sortedHistory = useMemo(() => {
        return [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [history]);

    const formatTimestamp = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Riwayat Proyek</h3>
            <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                {sortedHistory.length > 0 ? (
                    sortedHistory.map(log => (
                        <div key={log.id} className="flex items-start gap-3">
                            <img src={log.user.avatarUrl} alt={log.user.name} className="w-8 h-8 rounded-full mt-1" />
                            <div className="flex-1">
                                <p className="text-sm dark:text-gray-200">
                                    <strong className="font-medium">{log.user.name}</strong> {log.action}
                                </p>
                                <p className="text-xs text-text-primary">{formatTimestamp(log.timestamp)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">Belum ada riwayat aktivitas.</p>
                )}
            </div>
        </div>
    );
};

export default HistoryCard;