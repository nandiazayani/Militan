import React from 'react';
import { Vendor } from '../../types';

interface VendorCardProps {
    vendors: Vendor[];
    onOpenModal: (type: 'vendor', data?: Vendor | null) => void;
    canEdit: boolean;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendors, onOpenModal, canEdit }) => {
    return (
        <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-gray-100">Vendor & Partner</h3>
                {canEdit && (
                    <button onClick={() => onOpenModal('vendor')} className="px-3 py-1 bg-secondary text-white text-sm rounded-lg hover:bg-green-700">
                        Tambah Vendor
                    </button>
                )}
            </div>
            <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {vendors.map(vendor => (
                    <li key={vendor.id} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-sm">{vendor.name}</p>
                                <p className="text-xs text-gray-500">{vendor.service}</p>
                                <p className="text-xs text-gray-500 mt-1">{vendor.contact}</p>
                            </div>
                            {canEdit && (
                                <div className="flex gap-2 flex-shrink-0 ml-2">
                                    <button onClick={() => onOpenModal('vendor', vendor)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Edit Vendor"><PencilIcon /></button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
                 {vendors.length === 0 && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">Belum ada vendor.</p>
                )}
            </ul>
        </div>
    );
};

const PencilIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;

export default VendorCard;
