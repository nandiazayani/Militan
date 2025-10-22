import React from 'react';
import { HandoverLog } from '../../types';

interface HandoverHistoryCardProps {
    handoverHistory: HandoverLog[];
}

const HandoverHistoryCard: React.FC<HandoverHistoryCardProps> = ({ handoverHistory = [] }) => {

    const formatTimestamp = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Riwayat Serah Terima PIC</h3>
            <div className="max-h-60 overflow-y-auto pr-2 space-y-4">
                {handoverHistory.length > 0 ? (
                    [...handoverHistory].reverse().map(log => (
                        <div key={log.id} className="flex items-start gap-3 text-sm">
                            <div className="mt-1">
                                {log.confirmationTimestamp 
                                    ? <CheckCircleIcon className="text-green-500" /> 
                                    : <ClockIcon className="text-yellow-500" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-200">
                                    <strong className="font-medium">{log.fromPIC.name}</strong> menyerahkan kepada <strong className="font-medium">{log.toPIC.name}</strong>
                                </p>
                                <p className="text-xs text-text-primary">
                                    Dimulai: {formatTimestamp(log.timestamp)}
                                </p>
                                {log.confirmationTimestamp ? (
                                    <p className="text-xs text-green-400">
                                        Dikonfirmasi: {formatTimestamp(log.confirmationTimestamp)}
                                    </p>
                                ) : (
                                    <p className="text-xs text-yellow-400">
                                        Menunggu Konfirmasi dari {log.toPIC.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400 py-4 text-sm">Belum ada riwayat serah terima.</p>
                )}
            </div>
        </div>
    );
};

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default HandoverHistoryCard;