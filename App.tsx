import React, { useState, createContext, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './modules/dashboard/DashboardPage';
import AssetManagementPage from './modules/assets/AssetManagementPage';
import ProjectManagementPage from './modules/projects/ProjectManagementPage';
import ProjectDetailPage from './modules/projects/ProjectDetailPage';
import DocumentManagementPage from './modules/documents/DocumentManagementPage';
import UserManagementPage from './modules/users/UserManagementPage';
import UserDetailPage from './modules/users/UserDetailPage';
import AdditionalDepartmentsPage from './modules/departments/AdditionalDepartmentsPage';
import SettingsPage from './modules/settings/SettingsPage';
import { User, UserRole } from './types';
import { MOCK_USERS } from './constants/mockData';

type Page = 'dashboard' | 'assets' | 'projects' | 'documents' | 'users' | 'departments' | 'settings';

export const UserContext = createContext<{ user: User; setUser: (user: User) => void; } | null>(null);
export const ThemeContext = createContext<{ theme: string; toggleTheme: () => void; } | null>(null);

const pageRoles: Record<Page, UserRole[]> = {
    dashboard: [UserRole.Admin, UserRole.Manager, UserRole.Staff, UserRole.AssetManager],
    assets: [UserRole.Admin, UserRole.AssetManager],
    projects: [UserRole.Admin, UserRole.Manager, UserRole.Staff],
    documents: [UserRole.Admin, UserRole.Manager, UserRole.Staff],
    users: [UserRole.Admin, UserRole.Manager, UserRole.Staff],
    departments: [UserRole.Admin, UserRole.Manager],
    settings: [UserRole.Admin, UserRole.Manager, UserRole.Staff, UserRole.AssetManager],
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS.find(u => u.role === UserRole.Admin)!);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const userContextValue = useMemo(() => ({ user: currentUser, setUser: setCurrentUser }), [currentUser]);
  const themeContextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  useEffect(() => {
    const allowedRoles = pageRoles[currentPage];
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      setCurrentPage('dashboard');
    }
    if (currentPage !== 'projects') {
      setSelectedProjectId(null);
    }
    if (currentPage !== 'users') {
        setSelectedUserId(null);
    }
  }, [currentUser, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'assets':
        return <AssetManagementPage />;
      case 'projects':
        return selectedProjectId ? (
            <ProjectDetailPage 
                projectId={selectedProjectId} 
                onBack={() => setSelectedProjectId(null)} 
                onSelectUser={(userId) => {
                  setSelectedUserId(userId);
                  setCurrentPage('users');
                }}
            />
        ) : (
            <ProjectManagementPage onSelectProject={setSelectedProjectId} />
        );
      case 'documents':
        return <DocumentManagementPage />;
      case 'users':
        return selectedUserId ? (
            <UserDetailPage 
                userId={selectedUserId}
                onBack={() => setSelectedUserId(null)}
            />
        ) : (
            <UserManagementPage onSelectUser={setSelectedUserId} />
        );
      case 'departments':
        return <AdditionalDepartmentsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <UserContext.Provider value={userContextValue}>
        <div className="flex h-screen bg-background dark:bg-gray-900">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header setCurrentPage={setCurrentPage} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
              {renderPage()}
            </main>
          </div>
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;