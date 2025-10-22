import React, { useState, useEffect, createContext } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './modules/dashboard/DashboardPage';
import ProjectManagementPage from './modules/projects/ProjectManagementPage';
import ProjectDetailPage from './modules/projects/ProjectDetailPage';
import AssetManagementPage from './modules/assets/AssetManagementPage';
import DocumentManagementPage from './modules/documents/DocumentManagementPage';
import UserManagementPage from './modules/users/UserManagementPage';
import UserDetailPage from './modules/users/UserDetailPage';
import SettingsPage from './modules/settings/SettingsPage';
import LoginPage from './modules/login/LoginPage';
import GeminiPage from './modules/gemini/GeminiPage';
import AdditionalDepartmentsPage from './modules/departments/AdditionalDepartmentsPage';
import OperationalManagementPage from './modules/operational/OperationalManagementPage';
import NotificationPage from './modules/notifications/NotificationPage';
import CalendarPage from './modules/calendar/CalendarPage';

import { Page, User, Project, Asset, Document as Doc, UserTask, Notification, NotificationType, DailyReport } from './types';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_ASSETS, MOCK_DOCUMENTS, MOCK_USER_TASKS, MOCK_NOTIFICATIONS, MOCK_DAILY_REPORTS } from './constants/mockData';

// Import contexts from new files
import { UserContext } from './contexts/UserContext';
import { DataContext, DataContextType } from './contexts/DataContext';
import { SettingsContext } from './contexts/SettingsContext';


// Main App Component
const App: React.FC = () => {
    // State management
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // "Database" state
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [allAssets, setAllAssets] = useState<Asset[]>([]);
    const [allDocuments, setAllDocuments] = useState<Doc[]>([]);
    const [allUserTasks, setAllUserTasks] = useState<UserTask[]>([]);
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
    const [allDailyReports, setAllDailyReports] = useState<DailyReport[]>([]);
    
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [appError, setAppError] = useState<string | null>(null);

    // Settings state
    const [settings, setSettings] = useState({ autoSaveEnabled: true });

    // Simulate API call to fetch initial data
    useEffect(() => {
        try {
            // Simulate a delay
            setTimeout(() => {
                setAllUsers(MOCK_USERS);
                setAllProjects(MOCK_PROJECTS);
                setAllAssets(MOCK_ASSETS);
                setAllDocuments(MOCK_DOCUMENTS);
                setAllUserTasks(MOCK_USER_TASKS);
                setAllNotifications(MOCK_NOTIFICATIONS.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
                setAllDailyReports(MOCK_DAILY_REPORTS);
                setIsDataLoaded(true);
            }, 1000);
        } catch (e) {
            setAppError("Gagal memuat data awal dari server.");
            setIsDataLoaded(true);
        }
    }, []);
    
    // Data manipulation functions (simulating API calls)
    const createUpdater = <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>) => async (item: T) => {
        setter(prev => prev.map(i => i.id === item.id ? item : i));
    };
    const createAdder = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>) => async (item: T) => {
        setter(prev => [item, ...prev]);
    };
    const createDeleter = <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>) => async (id: string) => {
        setter(prev => prev.filter(i => i.id !== id));
    };

    const updateUser = createUpdater(setAllUsers);
    const addProject = createAdder(setAllProjects);
    const updateProject = createUpdater(setAllProjects);
    const addAsset = createAdder(setAllAssets);
    const updateAsset = createUpdater(setAllAssets);
    const deleteAsset = createDeleter(setAllAssets);
    const addDocument = createAdder(setAllDocuments);
    const updateDocument = createUpdater(setAllDocuments);
    const deleteDocument = createDeleter(setAllDocuments);
    const addUser = createAdder(setAllUsers);
    const addUserTask = createAdder(setAllUserTasks);
    const updateUserTask = createUpdater(setAllUserTasks);
    const deleteUserTask = createDeleter(setAllUserTasks);
    const addDailyReport = createAdder(setAllDailyReports);
    const updateDailyReport = createUpdater(setAllDailyReports);

    const addNotification = (type: NotificationType, message: string, link?: Notification['link']) => {
        const newNotification: Notification = {
            id: `n${Date.now()}`,
            message,
            timestamp: new Date().toISOString(),
            read: false,
            type,
            link
        };
        setAllNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationsAsRead = () => {
        setAllNotifications(prev => prev.map(n => ({...n, read: true})));
    };
    
    // Navigation handlers
    const handleSelectProject = (projectId: string) => {
        setSelectedProjectId(projectId);
        setCurrentPage('projectDetail');
    };

    const handleSelectUser = (userId: string) => {
        setSelectedUserId(userId);
        setCurrentPage('userDetail');
    };

    const handleBackToProjects = () => {
        setSelectedProjectId(null);
        setCurrentPage('projects');
    };
    
    const handleBackToUsers = () => {
        setSelectedUserId(null);
        setCurrentPage('users');
    };
    
    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setCurrentPage('dashboard');
    };
    
    const handleLogout = () => {
        if (hasUnsavedChanges && !window.confirm("You have unsaved changes that will be lost. Are you sure you want to log out?")) {
            return;
        }
        setUser(null);
        setCurrentPage('dashboard'); // Or a dedicated login page identifier
        setHasUnsavedChanges(false);
    };

    const renderPage = () => {
        if (currentPage === 'projectDetail' && selectedProjectId) {
            return <ProjectDetailPage projectId={selectedProjectId} onBack={handleBackToProjects} onSelectUser={handleSelectUser} setHasUnsavedChanges={setHasUnsavedChanges}/>;
        }
        if (currentPage === 'userDetail' && selectedUserId) {
            return <UserDetailPage userId={selectedUserId} onBack={handleBackToUsers} />;
        }
        switch (currentPage) {
            case 'dashboard': return <DashboardPage />;
            case 'projects': return <ProjectManagementPage onSelectProject={handleSelectProject} />;
            case 'assets': return <AssetManagementPage />;
            case 'documents': return <DocumentManagementPage />;
            case 'users': return <UserManagementPage onSelectUser={handleSelectUser} />;
            case 'settings': return <SettingsPage />;
            case 'gemini': return <GeminiPage />;
            case 'departments': return <AdditionalDepartmentsPage />;
            case 'operational': return <OperationalManagementPage />;
            case 'notifications': return <NotificationPage onSelectProject={handleSelectProject} onSelectUser={handleSelectUser} />;
            case 'calendar': return <CalendarPage onSelectProject={handleSelectProject} onSelectUser={handleSelectUser} />;
            default: return <DashboardPage />;
        }
    };
    
    const dataContextValue: DataContextType = {
        allUsers, allProjects, allAssets, allDocuments, allUserTasks, allNotifications, allDailyReports,
        updateUser, addProject, updateProject, addAsset, updateAsset, deleteAsset,
        addDocument, updateDocument, deleteDocument, addUser, addUserTask,
        updateUserTask, deleteUserTask, addNotification, markNotificationsAsRead,
        addDailyReport, updateDailyReport
    };

    if (!user) {
        return <LoginPage onLoginSuccess={handleLogin} allUsers={allUsers} appError={appError} isDataLoaded={isDataLoaded} />;
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <DataContext.Provider value={dataContextValue}>
                <SettingsContext.Provider value={{ settings, setSettings }}>
                    <div className="relative flex h-screen bg-background text-text-primary font-sans">
                        <Sidebar 
                            currentPage={currentPage} 
                            setCurrentPage={setCurrentPage}
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <Header 
                                setCurrentPage={setCurrentPage}
                                hasUnsavedChanges={hasUnsavedChanges}
                                onLogout={handleLogout}
                                onSelectProject={handleSelectProject}
                                onSelectUser={handleSelectUser}
                                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                            />
                            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
                                {renderPage()}
                            </main>
                        </div>
                        {isSidebarOpen && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                                onClick={() => setIsSidebarOpen(false)}
                                aria-hidden="true"
                            ></div>
                        )}
                    </div>
                </SettingsContext.Provider>
            </DataContext.Provider>
        </UserContext.Provider>
    );
};

export default App;