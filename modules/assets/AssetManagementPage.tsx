import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../../contexts/DataContext';
// FIX: Corrected import path for types
import { Asset, AssetStatus, AssetType, User } from '../../types';
import { AssetStatusBadge } from '../../components/Badges';

// Modal for adding/editing an asset
const AssetModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (asset: Asset) => void;
    asset: Asset | null;
    allUsers: User[];
}> = ({ isOpen, onClose, onSave, asset, allUsers }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<AssetType>(AssetType.Permanent);
    const [status, setStatus] = useState<AssetStatus>(AssetStatus.Available);
    const [managedById, setManagedById] = useState('');
    const [lastMaintenance, setLastMaintenance] = useState('');
    const [nextMaintenance, setNextMaintenance] = useState('');
    const [rentedUntil, setRentedUntil] = useState('');

    React.useEffect(() => {
        if (asset) {
            setName(asset.name);
            setType(asset.type);
            setStatus(asset.status);
            setManagedById(asset.managedBy.id);
            setLastMaintenance(asset.lastMaintenance);
            setNextMaintenance(asset.nextMaintenance || '');
            setRentedUntil(asset.rentedUntil || '');
        } else {
            setName('');
            setType(AssetType.Permanent);
            setStatus(AssetStatus.Available);
            setManagedById('');
            setLastMaintenance(new Date().toISOString().split('T')[0]);
            setNextMaintenance('');
            setRentedUntil('');
        }
    }, [asset, isOpen]);

    const handleSave = () => {
        const managedBy = allUsers.find(u => u.id === managedById);
        if (!name.trim() || !lastMaintenance || !managedBy) {
            alert('Nama aset, maintenance terakhir, dan pengelola harus diisi.');
            return;
        }
        const newAsset: Asset = {
            id: asset?.id || `a${Date.now()}`,
            name,
            type,
            status,
            lastMaintenance,
            managedBy,
            nextMaintenance: nextMaintenance || undefined,
            rentedUntil: type === AssetType.Rent ? (rentedUntil || undefined) : undefined,
        };
        onSave(newAsset);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-text-primary">{asset ? 'Edit Aset' : 'Tambah Aset Baru'}</h3>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Nama Aset</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Dikelola Oleh</label>
                        <select value={managedById} onChange={(e) => setManagedById(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100">
                            <option value="">-- Pilih Pengguna --</option>
                            {allUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.department})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Tipe Aset</label>
                        <select value={type} onChange={(e) => setType(e.target.value as AssetType)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100">
                            {/* FIX: Explicitly type 't' to resolve 'unknown' type error. */}
                            {Object.values(AssetType).map((t: AssetType) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Status Aset</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value as AssetStatus)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100">
                            {/* FIX: Explicitly type 's' to resolve 'unknown' type error. */}
                            {Object.values(AssetStatus).map((s: AssetStatus) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Maintenance Terakhir</label>
                        <input type="date" value={lastMaintenance} onChange={(e) => setLastMaintenance(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Maintenance Selanjutnya (Opsional)</label>
                        <input type="date" value={nextMaintenance} onChange={(e) => setNextMaintenance(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                    {type === AssetType.Rent && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Disewa Hingga</label>
                            <input type="date" value={rentedUntil} onChange={(e) => setRentedUntil(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500">Simpan</button>
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
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-2 text-white">Konfirmasi Penghapusan</h3>
                <p className="text-gray-300 mb-6">
                    Apakah Anda yakin ingin menghapus aset <strong className="text-white">{assetName || 'ini'}</strong>? Tindakan ini tidak dapat diurungkan.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus</button>
                </div>
            </div>
        </div>
    );
};


const AssetManagementPage: React.FC = () => {
    const dataContext = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
    const [departmentFilter, setDepartmentFilter] = useState('All');

    if (!dataContext) {
        return <div>Memuat data aset...</div>;
    }

    const { allAssets, addAsset, updateAsset, deleteAsset, allUsers } = dataContext;
    
    const departments = useMemo(() => ['All', ...new Set(allUsers.map(u => u.department).filter(Boolean))], [allUsers]) as string[];

    const filteredAssets = useMemo(() => {
        if (departmentFilter === 'All') return allAssets;
        return allAssets.filter(asset => asset.managedBy.department === departmentFilter);
    }, [allAssets, departmentFilter]);


    const handleAddAsset = () => {
        setEditingAsset(null);
        setIsModalOpen(true);
    };
    
    const handleEditAsset = (asset: Asset) => {
        setEditingAsset(asset);
        setIsModalOpen(true);
    };

    const handleSaveAsset = async (savedAsset: Asset) => {
        const isEditing = allAssets.some(a => a.id === savedAsset.id);
        if (isEditing) {
            await updateAsset(savedAsset);
        } else {
            await addAsset(savedAsset);
        }
        setIsModalOpen(false);
    };
    
    const handleDeleteClick = (asset: Asset) => {
        setAssetToDelete(asset);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteAsset = async () => {
        if (assetToDelete) {
            await deleteAsset(assetToDelete.id);
        }
        setIsDeleteConfirmOpen(false);
        setAssetToDelete(null);
    };


    return (
        <div className="bg-surface rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manajemen Aset</h2>
                <button onClick={handleAddAsset} className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-yellow-500 transition font-semibold">
                    Tambah Aset Baru
                </button>
            </div>
            <div className="flex justify-end mb-4">
                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                >
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nama Aset</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipe</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Departemen</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Maintenance Terakhir</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Info Tambahan</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-surface divide-y divide-gray-700">
                        {filteredAssets.map((asset: Asset) => (
                            <tr key={asset.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-100">{asset.name}</div>
                                    <div className="text-xs text-text-primary">Dikelola oleh: {asset.managedBy.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{asset.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <AssetStatusBadge status={asset.status} />
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{asset.managedBy.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{asset.lastMaintenance}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {asset.nextMaintenance && `Next: ${asset.nextMaintenance}`}
                                    {asset.rentedUntil && `Disewa hingga: ${asset.rentedUntil}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEditAsset(asset)} className="text-primary hover:text-yellow-500 mr-4">Edit</button>
                                    <button onClick={() => handleDeleteClick(asset)} className="text-red-500 hover:text-red-400">Hapus</button>
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
                allUsers={allUsers}
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