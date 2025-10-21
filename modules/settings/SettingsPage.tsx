import React, { useContext, useState } from 'react';
import { ThemeContext, UserContext, SettingsContext, DataContext } from '../../App';
import EditProfileModal from '../../components/EditProfileModal';

const SettingsToggle: React.FC<{ label: string; enabled: boolean; onToggle: () => void; }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <button
            type="button"
            className={`${enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
        >
            <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
);

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">{title}</h3>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {children}
        </div>
    </div>
);

const SettingsPage: React.FC = () => {
    const userContext = useContext(UserContext);
    const themeContext = useContext(ThemeContext);
    const settingsContext = useContext(SettingsContext);
    const dataContext = useContext(DataContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    if (!userContext || !themeContext || !settingsContext || !dataContext) {
        return null;
    }

    const { user } = userContext;
    const { theme, toggleTheme } = themeContext;
    const { settings, setSettings } = settingsContext;
    const { updateUser } = dataContext;

    const toggleAutoSave = () => {
        setSettings({ autoSaveEnabled: !settings.autoSaveEnabled });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-primary dark:text-gray-100">Pengaturan</h2>

            <SettingsCard title="Profil Pengguna">
                <div className="flex items-center py-4">
                    <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full" />
                    <div className="ml-4">
                        <p className="font-bold text-xl text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-text-secondary dark:text-gray-400">{user.role} {user.department && `- ${user.department}`}</p>
                    </div>
                </div>
                <div className="py-3 text-right">
                    <button onClick={() => setIsEditModalOpen(true)} className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                        Edit Profil
                    </button>
                </div>
            </SettingsCard>
            
            <SettingsCard title="Tampilan">
                <SettingsToggle
                    label="Mode Gelap"
                    enabled={theme === 'dark'}
                    onToggle={toggleTheme}
                />
            </SettingsCard>

            <SettingsCard title="Fungsionalitas">
                <SettingsToggle
                    label="Aktifkan Auto-Save Progress Tim"
                    enabled={settings.autoSaveEnabled}
                    onToggle={toggleAutoSave}
                />
            </SettingsCard>

            <SettingsCard title="Notifikasi">
                <SettingsToggle label="Update Proyek" enabled={true} onToggle={() => {}} />
                <SettingsToggle label="Tugas Baru" enabled={true} onToggle={() => {}} />
                <SettingsToggle label="Pesan Masuk" enabled={false} onToggle={() => {}} />
            </SettingsCard>
            
            <SettingsCard title="Akses & Keamanan">
                <div className="flex items-center justify-between py-3">
                    <span className="text-gray-700 dark:text-gray-300">Kata Sandi</span>
                    <button onClick={() => alert('Fitur ubah kata sandi belum tersedia.')} className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                        Ubah Kata Sandi
                    </button>
                </div>
            </SettingsCard>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={updateUser}
                user={user}
            />
        </div>
    );
};

export default SettingsPage;