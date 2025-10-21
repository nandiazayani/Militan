
import React, { useState } from 'react';
import { User } from '../../types';

interface LoginPageProps {
    onLoginSuccess: (user: User) => void;
    allUsers: User[];
    appError: string | null;
    isDataLoaded: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, allUsers, appError, isDataLoaded }) => {
    const [username, setUsername] = useState('Admin User');
    const [password, setPassword] = useState('password');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setLoginError('');
        setIsLoading(true);

        setTimeout(() => {
            const foundUser = allUsers.find(u => u.name.toLowerCase() === username.toLowerCase().trim());

            if (foundUser) {
                onLoginSuccess(foundUser);
            } else {
                setLoginError('Nama pengguna tidak ditemukan. Silakan coba lagi.');
            }
            setIsLoading(false);
        }, 500);
    };
    
    const isApiReady = isDataLoaded && allUsers.length > 0 && !appError;

    const apiErrorMessage = appError 
        ? appError
        : (isDataLoaded && allUsers.length === 0) 
            ? 'Tidak ada data pengguna yang diterima dari server. Pastikan database telah di-seed dengan benar (jalankan militan-api/seed_data.php di browser).'
            : null;

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-2xl shadow-lg">
                <div className="text-center">
                    <img src="/logo.png" alt="Mili Cipta Karya Logo" className="h-12 mx-auto mb-4" />
                    <p className="mt-2 text-text-secondary">Silakan masuk untuk melanjutkan</p>
                </div>
                
                {apiErrorMessage && (
                    <div className="p-4 text-sm text-center text-red-300 bg-red-900/30 rounded-lg" role="alert">
                        <p className="font-bold">Koneksi Backend Bermasalah</p>
                        <p className="mt-1">{apiErrorMessage}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-100 bg-gray-700 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm disabled:opacity-50"
                                placeholder="Nama Pengguna (e.g., Admin User)"
                                disabled={!isApiReady}
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-100 bg-gray-700 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm disabled:opacity-50"
                                placeholder="Password (diabaikan saat ini)"
                                disabled={!isApiReady}
                            />
                        </div>
                    </div>

                    {loginError && <p className="text-sm text-red-500 text-center">{loginError}</p>}

                    <div>
                        <button 
                            type="submit" 
                            disabled={isLoading || !isApiReady}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-black bg-primary hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Memverifikasi...' : 'Masuk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;