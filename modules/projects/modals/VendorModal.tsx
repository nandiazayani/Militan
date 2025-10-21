import React, { useState, useEffect } from 'react';
import { Vendor } from '../../../types';

interface VendorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (vendor: Vendor) => void;
    vendor: Vendor | null;
}

const VendorModal: React.FC<VendorModalProps> = ({ isOpen, onClose, onSave, vendor }) => {
    const [name, setName] = useState('');
    const [service, setService] = useState('');
    const [contact, setContact] = useState('');

    useEffect(() => {
        if (vendor) {
            setName(vendor.name);
            setService(vendor.service);
            setContact(vendor.contact);
        } else {
            setName('');
            setService('');
            setContact('');
        }
    }, [vendor, isOpen]);

    const handleSave = () => {
        if (!name.trim() || !service.trim()) {
            alert('Nama vendor dan layanan harus diisi.');
            return;
        }
        onSave({
            id: vendor?.id || `v${Date.now()}`,
            name,
            service,
            contact,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">{vendor ? 'Edit Vendor' : 'Tambah Vendor'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Vendor</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Layanan</label>
                        <input type="text" value={service} onChange={(e) => setService(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kontak</label>
                        <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Nama PIC - 08xxxxxxxx" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Batal</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Simpan</button>
                </div>
            </div>
        </div>
    );
};

export default VendorModal;
