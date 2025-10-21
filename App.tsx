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
import { User, UserRole, Project } from './types';
import { MOCK_USERS, MOCK_PROJECTS } from './constants/mockData';

type Page = 'dashboard' | 'assets' | 'projects' | 'documents' | 'users' | 'departments' | 'settings';

export interface AppSettings {
  autoSaveEnabled: boolean;
}

export const UserContext = createContext<{ user: User; setUser: (user: User) => void; } | null>(null);
export const ThemeContext = createContext<{ theme: string; toggleTheme: () => void; } | null>(null);
export const SettingsContext = createContext<{ settings: AppSettings; setSettings: (settings: Partial<AppSettings>) => void; } | null>(null);
export const DataContext = createContext<{
    allUsers: User[];
    allProjects: Project[];
    updateUser: (updatedUser: User) => void;
    addUser: (newUser: User) => void;
    updateProject: (updatedProject: Project) => void;
    addProject: (newProject: Project) => void;
} | null>(null);


const pageRoles: Record<Page, UserRole[]> = {
    dashboard: [UserRole.Admin, UserRole.Manager, UserRole.Staff, UserRole.AssetManager, UserRole.Finance],
    assets: [UserRole.Admin, UserRole.AssetManager],
    projects: [UserRole.Admin, UserRole.Manager, UserRole.Staff, UserRole.Finance],
    documents: [UserRole.Admin, UserRole.Manager, UserRole.Staff, UserRole.Finance],
    users: [UserRole.Admin, UserRole.Manager, UserRole.Staff],
    departments: [UserRole.Admin, UserRole.Manager],
    settings: [UserRole.Admin, UserRole.Manager, UserRole.Staff, UserRole.AssetManager, UserRole.Finance],
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS.find(u => u.role === UserRole.Admin)!);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [settings, setSettings] = useState<AppSettings>({ autoSaveEnabled: true });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [allProjects, setAllProjects] = useState<Project[]>(MOCK_PROJECTS);

  const handleUpdateUser = (updatedUser: User) => {
      setAllUsers(prevUsers => prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      if (currentUser.id === updatedUser.id) {
          setCurrentUser(updatedUser);
      }
      // Reflect user changes in projects
      setAllProjects(prevProjects => 
          prevProjects.map(p => ({
              ...p,
              pic: p.pic.id === updatedUser.id ? updatedUser : p.pic,
              team: p.team.map(t => (t.id === updatedUser.id ? updatedUser : t)),
              tasks: p.tasks.map(task => ({
                  ...task,
                  assignee: task.assignee.id === updatedUser.id ? updatedUser : task.assignee,
              })),
              history: p.history?.map(h => ({
                  ...h,
                  user: h.user.id === updatedUser.id ? updatedUser : h.user
              }))
          }))
      );
  };

  const handleAddUser = (newUser: User) => {
      setAllUsers(prevUsers => [newUser, ...prevUsers]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
      setAllProjects(prevProjects => prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleAddProject = (newProject: Project) => {
      setAllProjects(prevProjects => [newProject, ...prevProjects]);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
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
  
  const handleSetSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prevSettings => {
        const updatedSettings = { ...prevSettings, ...newSettings };
        localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
        return updatedSettings;
    });
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const userContextValue = useMemo(() => ({ user: currentUser, setUser: setCurrentUser }), [currentUser]);
  const themeContextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);
  const settingsContextValue = useMemo(() => ({ settings, setSettings: handleSetSettings }), [settings]);
  const dataContextValue = useMemo(() => ({ allUsers, allProjects, updateUser: handleUpdateUser, addUser: handleAddUser, updateProject: handleUpdateProject, addProject: handleAddProject }), [allUsers, allProjects]);

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

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleProjectBack = () => {
    setSelectedProjectId(null);
    setHasUnsavedChanges(false);
  };

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
                onBack={handleProjectBack} 
                onSelectUser={(userId) => {
                  setSelectedUserId(userId);
                  setCurrentPage('users');
                }}
                setHasUnsavedChanges={setHasUnsavedChanges}
            />
        ) : (
            <ProjectManagementPage onSelectProject={handleSelectProject} />
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
        <SettingsContext.Provider value={settingsContextValue}>
          <DataContext.Provider value={dataContextValue}>
            <div className="flex h-screen bg-background dark:bg-gray-900">
              <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header setCurrentPage={setCurrentPage} hasUnsavedChanges={hasUnsavedChanges} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
                  {renderPage()}
                </main>
              </div>
            </div>
          </DataContext.Provider>
        </SettingsContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;