import React, { useState } from 'react';
import { MOCK_ASSETS } from '../../constants/mockData';
import { Asset, AssetStatus, AssetType } from '../../types';
import { AssetStatusBadge } from '../../components/Badges';

// Modal for adding/editing an asset
const AssetModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (asset: Asset) => void;
    asset: Asset | null;
}> = ({ isOpen, onClose, onSave, asset }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<AssetType>(AssetType.Permanent);
    const [status, setStatus] = useState<AssetStatus>(AssetStatus.Available);
    const [lastMaintenance, setLastMaintenance] = useState('');
    const [nextMaintenance, setNextMaintenance] = useState('');
    const [rentedUntil, setRentedUntil] = useState('');

    React.useEffect(() => {
        if (asset) {
            setName(asset.name);
            setType(asset.type);
            setStatus(asset.status);
            setLastMaintenance(asset.lastMaintenance);
            setNextMaintenance(asset.nextMaintenance || '');
            setRentedUntil(asset.rentedUntil || '');
        } else {
            setName('');
            setType(AssetType.Permanent);
            setStatus(AssetStatus.Available);
            setLastMaintenance(new Date().toISOString().split('T')[0]);
            setNextMaintenance('');
            setRentedUntil('');
        }
    }, [asset, isOpen]);

    const handleSave = () => {
        if (!name.trim() || !lastMaintenance) {
            alert('Nama aset dan tanggal maintenance terakhir harus diisi.');
            return;
        }
        const newAsset: Asset = {
            id: asset?.id || `a${Date.now()}`,
            name,
            type,
            status,
            lastMaintenance,
            nextMaintenance: nextMaintenance || undefined,
            rentedUntil: type === AssetType.Rent ? (rentedUntil || undefined) : undefined,
        };
        onSave(newAsset);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">{asset ? 'Edit Aset' : 'Tambah Aset Baru'}</h3>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Aset</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe Aset</label>
                        <select value={type} onChange={(e) => setType(e.target.value as AssetType)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100">
                            {Object.values(AssetType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status Aset</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value as AssetStatus)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100">
                            {Object.values(AssetStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Terakhir</label>
                        <input type="date" value={lastMaintenance} onChange={(e) => setLastMaintenance(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Selanjutnya (Opsional)</label>
                        <input type="date" value={nextMaintenance} onChange={(e) => setNextMaintenance(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                    {type === AssetType.Rent && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Disewa Hingga</label>
                            <input type="date" value={rentedUntil} onChange={(e) => setRentedUntil(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Batal</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Simpan</button>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    assetName?: string;
}> = ({ isOpen, onClose, onConfirm, assetName }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-2 dark:text-white">Konfirmasi Penghapusan</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Apakah Anda yakin ingin menghapus aset <strong className="dark:text-white">{assetName || 'ini'}</strong>? Tindakan ini tidak dapat diurungkan.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Batal</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus</button>
                </div>
            </div>
        </div>
    );
};


const AssetManagementPage: React.FC = () => {
    const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

    const handleAddAsset = () => {
        setEditingAsset(null);
        setIsModalOpen(true);
    };
    
    const handleEditAsset = (asset: Asset) => {
        setEditingAsset(asset);
        setIsModalOpen(true);
    };

    const handleSaveAsset = (savedAsset: Asset) => {
        setAssets(prevAssets => {
            const exists = prevAssets.find(a => a.id === savedAsset.id);
            if (exists) {
                return prevAssets.map(a => a.id === savedAsset.id ? savedAsset : a);
            }
            return [savedAsset, ...prevAssets];
        });
        setIsModalOpen(false);
    };
    
    const handleDeleteClick = (asset: Asset) => {
        setAssetToDelete(asset);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteAsset = () => {
        if (assetToDelete) {
            setAssets(assets.filter(a => a.id !== assetToDelete.id));
        }
        setIsDeleteConfirmOpen(false);
        setAssetToDelete(null);
    };


    return (
        <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">Asset Management</h2>
                <button onClick={handleAddAsset} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
                    Tambah Aset Baru
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Aset</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipe</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Maintenance Terakhir</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Info Tambahan</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {assets.map((asset: Asset) => (
                            <tr key={asset.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{asset.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{asset.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <AssetStatusBadge status={asset.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{asset.lastMaintenance}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {asset.nextMaintenance && `Next: ${asset.nextMaintenance}`}
                                    {asset.rentedUntil && `Disewa hingga: ${asset.rentedUntil}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEditAsset(asset)} className="text-primary hover:text-blue-700 mr-4">Edit</button>
                                    <button onClick={() => handleDeleteClick(asset)} className="text-red-600 hover:text-red-800">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AssetModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAsset}
                asset={editingAsset}
            />
            <DeleteConfirmationModal 
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDeleteAsset}
                assetName={assetToDelete?.name}
            />
        </div>
    );
};

export default AssetManagementPage;