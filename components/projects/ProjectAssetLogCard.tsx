import React, { useContext } from 'react';
import { UsedAssetLog, Project, ProjectHistoryLog, AssetStatus } from '../../types';
import { DataContext } from '../../contexts/DataContext';

interface ProjectAssetLogCardProps {
    usedAssets: UsedAssetLog[];
    onCheckoutAsset: () => void;
    onUpdateProject: (updater: (prev: Project) => Partial<Project>, log?: ProjectHistoryLog) => void;
    createHistoryLog: (action: string) => ProjectHistoryLog;
    canEdit: boolean;
}

const ProjectAssetLogCard: React.FC<ProjectAssetLogCardProps> = ({ usedAssets, onCheckoutAsset, onUpdateProject, createHistoryLog, canEdit }) => {
    const dataContext = useContext(DataContext);
    
    const handleReturnAsset = (log: UsedAssetLog) => {
        if (!dataContext) return;
        const { updateAsset } = dataContext;

        const historyLog = createHistoryLog(`mengembalikan aset "${log.asset.name}".`);
        onUpdateProject(
            prev => ({
                usedAssets: prev.usedAssets?.map(ul => 
                    ul.asset.id === log.asset.id && !ul.returnDate 
                        ? { ...ul, returnDate: new Date().toISOString() } 
                        : ul
                )
            }),
            historyLog
        );
        updateAsset({ ...log.asset, status: AssetStatus.Available });
    };

    const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString('id-ID');

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Aset Digunakan</h3>
                {canEdit && (
                    <button onClick={onCheckoutAsset} className="px-3 py-1 bg-secondary text-white text-sm rounded-lg hover:bg-green-700">
                        Gunakan Aset
                    </button>
                )}
            </div>
            <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {usedAssets.map((log, index) => (
                    <li key={`${log.asset.id}-${index}`} className="p-2 bg-gray-700/50 rounded-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-sm">{log.asset.name}</p>
                                <p className="text-xs text-text-primary">
                                    Digunakan: {formatDate(log.checkoutDate)}
                                    {log.returnDate && ` - Dikembalikan: ${formatDate(log.returnDate)}`}
                                </p>
                            </div>
                            {canEdit && !log.returnDate && (
                                <button
                                    onClick={() => handleReturnAsset(log)}
                                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                >
                                    Return
                                </button>
                            )}
                        </div>
                    </li>
                ))}
                {usedAssets.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-4">Belum ada aset yang digunakan.</p>
                )}
            </ul>
        </div>
    );
};

export default ProjectAssetLogCard;