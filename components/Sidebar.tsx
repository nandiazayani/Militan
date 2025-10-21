import React, { useState, useContext } from 'react';
import { UserContext } from '../App';
import { UserRole } from '../types';

type Page = 'dashboard' | 'assets' | 'projects' | 'documents' | 'users' | 'departments' | 'settings';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}> = ({ icon, label, isActive, onClick, isCollapsed }) => (
  <li
    onClick={onClick}
    className={`
      flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200
      ${isActive
        ? 'bg-primary text-white shadow-md'
        : 'text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-white'
      }
    `}
  >
    <div className="w-6 h-6">{icon}</div>
    {!isCollapsed && <span className="ml-4 font-medium">{label}</span>}
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userContext = useContext(UserContext);

  if (!userContext) {
    return null;
  }
  const { user } = userContext;
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon />, roles: [UserRole.Admin, UserRole.Manager, UserRole.Staff, UserRole.AssetManager, UserRole.Finance] },
    { id: 'assets', label: 'Asset Management', icon: <CubeIcon />, roles: [UserRole.Admin, UserRole.AssetManager] },
    { id: 'projects', label: 'Project Management', icon: <FolderIcon />, roles: [UserRole.Admin, UserRole.Manager, UserRole.Staff, UserRole.Finance] },
    { id: 'documents', label: 'Document Management', icon: <DocumentDuplicateIcon />, roles: [UserRole.Admin, UserRole.Manager, UserRole.Staff, UserRole.Finance] },
    { id: 'users', label: 'User Management', icon: <UserGroupIcon />, roles: [UserRole.Admin, UserRole.Manager, UserRole.Staff] },
    { id: 'departments', label: 'Departments', icon: <BuildingOfficeIcon />, roles: [UserRole.Admin, UserRole.Manager] },
  ];

  return (
    <div className={`flex flex-col bg-surface dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-xl transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {!isCollapsed && <h1 className="text-xl font-bold text-primary">MILITAN</h1>}
             <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            >
                {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </button>
        </div>
      <nav className="flex-1 px-2 py-4">
        <ul>
            {navItems
              .filter(item => item.roles.includes(user.role))
              .map(item => (
                <NavLink
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={currentPage === item.id}
                    onClick={() => setCurrentPage(item.id as Page)}
                    isCollapsed={isCollapsed}
                />
            ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300">
                <img src="https://picsum.photos/seed/logo/100/100" alt="Company Logo" className="rounded-full" />
            </div>
            {!isCollapsed && (
                <div className="ml-3">
                    <p className="text-sm font-semibold">PT. Mili Cipta Karya</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Event Management</p>
                </div>
            )}
          </div>
      </div>
    </div>
  );
};

// SVG Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M2.25 12l8.954 8.955a1.5 1.5 0 002.122 0l8.954-8.955M2.25 12h19.5" /></svg>;
const CubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const DocumentDuplicateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5 .124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023 1.527-1.84 2.66-2.433A12.036 12.036 0 0112 10.5c1.243 0 2.417.334 3.473.917 1.133.593 2.09 1.41 2.66 2.433m-5.63 2.545a2.571 2.571 0 01-.122-1.072 2.571 2.571 0 01.122-1.072m-6.07 2.144a2.571 2.571 0 01-.122-1.072 2.571 2.571 0 01.122-1.072m0 2.144a2.571 2.571 0 00-.122 1.072 2.571 2.571 0 00.122 1.072M12 15.75a2.571 2.571 0 01-.122-1.072 2.571 2.571 0 01.122-1.072m0 2.144a2.571 2.571 0 00-.122 1.072 2.571 2.571 0 00.122 1.072M8.25 12a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM15.75 12a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /></svg>;
const BuildingOfficeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 12.75z" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;

export default Sidebar;