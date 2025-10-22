import React, { useContext, useState, useRef, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { DataContext } from '../contexts/DataContext';
// FIX: Corrected import path for types
import { User, Page } from '../types';
import SmartSearch from './SmartSearch';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
  hasUnsavedChanges: boolean;
  onLogout: () => void;
  onSelectProject: (projectId: string) => void;
  onSelectUser: (userId: string) => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage, hasUnsavedChanges, onLogout, onSelectProject, onSelectUser, onToggleSidebar }) => {
  const userContext = useContext(UserContext);
  const dataContext = useContext(DataContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, notificationRef]);


  if (!userContext || !dataContext) {
    return null;
  }
  const { user, setUser } = userContext;
  const { allUsers, allNotifications, markNotificationsAsRead } = dataContext;

  const handleUserChange = (newUser: User) => {
    setUser(newUser);
    setDropdownOpen(false);
  }

  const navigateToSettings = () => {
    setCurrentPage('settings');
    setDropdownOpen(false);
  }
  
  const unreadNotificationsCount = allNotifications.filter(n => !n.read).length;

  const handleBellClick = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen && unreadNotificationsCount > 0) {
        // Mark as read after a short delay to allow panel to open
        setTimeout(() => {
            markNotificationsAsRead();
        }, 1500);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-surface shadow-md z-20">
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar} 
          className="p-2 mr-2 rounded-md text-gray-300 hover:bg-gray-700 md:hidden"
          aria-label="Open sidebar"
        >
            <MenuIcon />
        </button>
        <h2 className="text-2xl font-semibold text-text-primary hidden md:block">Welcome, {user.name}!</h2>
      </div>
      <div className="flex-1 flex justify-center px-4">
          <SmartSearch 
            onSelectProject={onSelectProject}
            onSelectUser={onSelectUser}
            setCurrentPage={setCurrentPage}
          />
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationRef}>
            <button className="p-2 rounded-full hover:bg-gray-700" onClick={handleBellClick}>
              <BellIcon className="text-gray-300" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </button>
             {notificationsOpen && <NotificationPanel onSelectProject={onSelectProject} onSelectUser={onSelectUser} setCurrentPage={setCurrentPage} />}
        </div>
        
        <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
                <div title="You have unsaved changes">
                    <CloudWarningIcon className="text-primary" />
                </div>
            )}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                <div className='text-left hidden md:block'>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-text-primary">{user.role}</p>
                </div>
                <ChevronDownIcon className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50">
                  <p className="px-4 py-2 text-xs text-gray-400">Switch User</p>
                  {allUsers.map(u => (
                    <a
                      key={u.id}
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleUserChange(u); }}
                      className={`block px-4 py-2 text-sm ${user.id === u.id ? 'bg-blue-100 text-primary' : 'text-gray-200 hover:bg-gray-600'}`}
                    >
                      {u.name} ({u.role})
                    </a>
                  ))}
                  <div className="border-t border-gray-600 my-1"></div>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Fitur profil belum tersedia.'); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Profile</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateToSettings(); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Settings</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-red-500 hover:bg-red-900/20">Logout</a>
                </div>
              )}
            </div>
        </div>
      </div>
    </header>
  );
};

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const BellIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const CloudWarningIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;

export default Header;