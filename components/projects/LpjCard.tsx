import React from 'react';
import { Lpj, LpjStatus, UserRole } from '../../types';
import { LpjStatusBadge } from '../Badges';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

interface LpjCardProps {
    lpj?: Lpj;
    canEdit: boolean;
    onOpenLpjModal: () => void;
    onOpenRevisionModal: () => void;
}

const LpjCard: React.FC<LpjCardProps> = ({ lpj, canEdit, onOpenLpjModal, onOpenRevisionModal }) => {
    const userContext = useContext(UserContext);
    const { user: currentUser } = userContext!;

    const canReview = currentUser.role === UserRole.Admin || currentUser.role === UserRole.Manager;

    const renderAction = () => {
        if (!canEdit) return null;
        if (!lpj || lpj.status === LpjStatus.Draft) {
            return <button onClick={onOpenLpjModal} className="w-full text-center text-sm py-2 bg-secondary text-white rounded-lg hover:bg-green-700">Buat & Kirim LPJ</button>;
        }
        if (lpj.status === LpjStatus.Revision) {
             return <button onClick={onOpenLpjModal} className="w-full text-center text-sm py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Revisi LPJ</button>;
        }
        if (lpj.status === LpjStatus.Submitted && canReview) {
             return <button onClick={onOpenRevisionModal} className="w-full text-center text-sm py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-700">Review LPJ</button>;
        }
         if (lpj.status === LpjStatus.Submitted && !canReview) {
             return <p className="text-xs text-center text-gray-400">Menunggu review dari manajer.</p>;
        }
        return null;
    };


    return (
        <div className="bg-surface rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">LPJ (Laporan Pertanggungjawaban)</h3>
            
            <div className="text-center mb-4">
                <p className="text-sm text-text-secondary mb-1">Status Saat Ini</p>
                {lpj ? <LpjStatusBadge status={lpj.status} /> : <span className="text-sm text-gray-500">Belum Dibuat</span>}
            </div>
            
            {lpj?.submittedDate && (
                <p className="text-xs text-center text-gray-400">Dikirim: {new Date(lpj.submittedDate).toLocaleDateString('id-ID')}</p>
            )}
            {lpj?.approvedDate && (
                 <p className="text-xs text-center text-green-400">Disetujui: {new Date(lpj.approvedDate).toLocaleDateString('id-ID')}</p>
            )}

            <div className="mt-4">
                {renderAction()}
            </div>
        </div>
    );
};

export default LpjCard;
