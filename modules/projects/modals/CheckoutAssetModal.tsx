import React, { useState, useMemo } from 'react';
import { Asset, AssetStatus } from '../../../types';

interface CheckoutAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: (asset: Asset) => void;
    allAssets: Asset[];
}

const CheckoutAssetModal: React.FC<CheckoutAssetModalProps> = ({ isOpen, onClose, onCheckout, allAssets }) => {
    const [selectedAssetId, setSelectedAssetId] = useState('');

    const availableAssets = useMemo(() => {
        return allAssets.filter(asset => asset.status === AssetStatus.Available);
    }, [allAssets]);

    const handleCheckout = () => {
        const assetToCheckout = availableAssets.find(a => a.id === selectedAssetId);
        if (assetToCheckout) {
            onCheckout(assetToCheckout);
        } else {
            alert('Silakan pilih aset yang valid.');
        }
    };
    
    // Reset selection when modal is reopened
    React.useEffect(() => {
        if (isOpen) {
            setSelectedAssetId('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-white">Gunakan Aset untuk Proyek</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Pilih Aset yang Tersedia</label>
                        <select
                            value={selectedAssetId}
                            onChange={(e) => setSelectedAssetId(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100"
                        >
                            <option value="">-- Pilih Aset --</option>
                            {availableAssets.length > 0 ? (
                                availableAssets.map(asset => (
                                    <option key={asset.id} value={asset.id}>
                                        {asset.name} (Dikelola: {asset.managedBy.name})
                                    </option>
                                ))
                            ) : (
                                <option disabled>Tidak ada aset yang tersedia</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button
                        onClick={handleCheckout}
                        disabled={!selectedAssetId}
                        className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Konfirmasi Penggunaan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutAssetModal;
