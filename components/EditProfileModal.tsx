
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
    user: User | null;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave, user }) => {
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setDepartment(user.department || '');
            setAvatarUrl(user.avatarUrl);
        }
    }, [user, isOpen]);

    const handleSave = () => {
        if (!user || !name.trim()) {
            alert('Nama tidak boleh kosong.');
            return;
        }
        onSave({
            ...user,
            name,
            department,
            avatarUrl,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-white">Edit Profil</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Nama Lengkap</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Departemen</label>
                        <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">URL Avatar</label>
                        <input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500">Simpan Perubahan</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;