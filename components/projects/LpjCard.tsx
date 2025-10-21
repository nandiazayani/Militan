import React, { useContext } from 'react';
import { Project, LpjStatus, UserRole, ProjectStatus } from '../../types';
import { UserContext } from '../../App';
import { LpjStatusBadge } from '../Badges';

interface LpjCardProps {
    project: Project;
    onOpenModal: () => void;
    onUpdateProject: (updater: (prev: Project) => Partial<Project>, log: any) => void;
    createHistoryLog: (action: string) => any;
}

const LpjCard: React.FC<LpjCardProps> = ({ project, onOpenModal, onUpdateProject, createHistoryLog }) => {
    const userContext = useContext(UserContext);
    if (!userContext) return null;
    const { user: currentUser } = userContext;
    
    const canCreateLpj = (currentUser.role === UserRole.Admin || currentUser.role === UserRole.Manager || project.pic.id === currentUser.id) && project.status === ProjectStatus.Completed;
    const canEditLpj = canCreateLpj && project.lpj && (project.lpj.status === LpjStatus.Draft || project.lpj.status === LpjStatus.Revision);
    const canApproveLpj = (currentUser.role === UserRole.Admin || currentUser.role === UserRole.Manager) && project.lpj && project.lpj.status === LpjStatus.Submitted;

    const handleLpjAction = (newStatus: LpjStatus, actionText: string) => {
        if (!project.lpj) return;
        const log = createHistoryLog(actionText);
        const updatedLpj = { 
            ...project.lpj, 
            status: newStatus,
            ...(newStatus === LpjStatus.Approved && { approvedDate: new Date().toISOString().split('T')[0] })
        };
        onUpdateProject(() => ({ lpj: updatedLpj }), log);
    };

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Laporan Pertanggungjawaban (LPJ)</h3>
                 {canEditLpj && (
                     <button onClick={onOpenModal} className="text-primary hover:text-yellow-500 text-sm font-semibold">Edit</button>
                 )}
            </div>

            {!project.lpj ? (
                canCreateLpj ? (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-400 mb-3">Proyek ini telah selesai. Silakan buat LPJ.</p>
                        <button onClick={onOpenModal} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500 transition">
                            Buat LPJ
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-500 py-4">
                        {project.status === ProjectStatus.Completed ? "LPJ belum dibuat." : "LPJ dapat dibuat setelah proyek selesai."}
                    </p>
                )
            ) : (
                <div className="space-y-4">
                    <div>
                        <span className="text-sm font-medium text-gray-400">Status: </span>
                        <LpjStatusBadge status={project.lpj.status} />
                    </div>

                    <div className="p-3 bg-gray-700/50 rounded-lg">
                        <h4 className="font-semibold text-sm text-gray-200 mb-2">Ringkasan Keuangan</h4>
                        <div className="text-xs space-y-1">
                            <p className="flex justify-between"><span>Pemasukan:</span> <span>Rp {project.lpj.financialSummary.totalIncome.toLocaleString('id-ID')}</span></p>
                            <p className="flex justify-between"><span>Pengeluaran:</span> <span>Rp {project.lpj.financialSummary.totalExpense.toLocaleString('id-ID')}</span></p>
                            <p className="flex justify-between font-bold border-t border-gray-600 pt-1 mt-1"><span>Saldo Akhir:</span> <span>Rp {project.lpj.financialSummary.finalBalance.toLocaleString('id-ID')}</span></p>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm text-gray-200 mb-1">Catatan</h4>
                        <p className="text-xs text-gray-300 bg-gray-700/50 p-2 rounded-md max-h-20 overflow-y-auto">{project.lpj.notes}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm text-gray-200 mb-1">Lampiran</h4>
                        <ul className="text-xs text-primary space-y-1">
                            {project.lpj.attachments.map(file => (
                                <li key={file} className="flex items-center gap-1.5">
                                    <DocumentIcon /> {file}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {canApproveLpj && (
                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700 mt-4">
                            <button onClick={() => handleLpjAction(LpjStatus.Revision, 'Meminta revisi untuk LPJ.')} className="px-3 py-1.5 text-xs bg-yellow-600 text-white rounded-md hover:bg-yellow-700">Minta Revisi</button>
                            <button onClick={() => handleLpjAction(LpjStatus.Approved, 'Menyetujui LPJ.')} className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700">Setujui LPJ</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const DocumentIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;

export default LpjCard;
