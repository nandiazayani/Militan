import React, { useState, useContext } from 'react';
// FIX: Corrected import path for types
import { User, UserRole } from '../../types';
import { UserContext } from '../../contexts/UserContext';
import { DataContext } from '../../contexts/DataContext';
import { RoleBadge } from '../../components/Badges';

interface UserManagementPageProps {
    onSelectUser: (id: string) => void;
}

const AddUserModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Staff);
    const [department, setDepartment] = useState('');

    const handleSubmit = () => {
        if (!name.trim() || !department.trim()) {
            alert('Nama dan departemen harus diisi.');
            return;
        }

        const newUser: User = {
            id: `u${Date.now()}`,
            name,
            role,
            department,
            avatarUrl: `https://i.pravatar.cc/150?u=u${Date.now()}`,
        };

        onSave(newUser);
        onClose(); // Close modal after saving
    };
    
    // Reset state when modal is closed
    React.useEffect(() => {
        if (!isOpen) {
            setName('');
            setRole(UserRole.Staff);
            setDepartment('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-white">Tambah Pengguna Baru</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Nama Lengkap</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Peran (Role)</label>
                        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100">
                            {/* FIX: Explicitly type 'r' to resolve 'unknown' type error. */}
                            {Object.values(UserRole).map((r: UserRole) => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Departemen</label>
                        <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500">Simpan Pengguna</button>
                </div>
            </div>
        </div>
    );
};

const UserManagementPage: React.FC<UserManagementPageProps> = ({ onSelectUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userContext = useContext(UserContext);
    const dataContext = useContext(DataContext);
    
    if(!userContext || !dataContext) return null;

    const { allUsers, addUser } = dataContext;

    const handleSaveUser = (newUser: User) => {
        addUser(newUser);
    };

    const canAddUser = userContext.user.role === UserRole.Admin;

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">User Management</h2>
                {canAddUser && (
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500 transition">
                        Tambah Pengguna Baru
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pengguna</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Peran</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Departemen</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-surface divide-y divide-gray-700">
                        {allUsers.map((user: User) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-100">{user.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <RoleBadge role={user.role} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.department || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/50 text-green-300">
                                        Aktif
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onSelectUser(user.id)} className="text-primary hover:text-yellow-500">Lihat Detail</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
            />
        </div>
    );
};

export default UserManagementPage;