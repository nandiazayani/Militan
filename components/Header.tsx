import React, { useContext, useState, useRef, useEffect } from 'react';
import { UserContext } from '../App';
import { MOCK_USERS } from '../constants/mockData';
import { User } from '../types';

type Page = 'dashboard' | 'assets' | 'projects' | 'documents' | 'users' | 'departments' | 'settings';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage }) => {
  const context = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  if (!context) {
    return null;
  }
  const { user, setUser } = context;

  const handleUserChange = (newUser: User) => {
    setUser(newUser);
    setDropdownOpen(false);
  }

  const navigateToSettings = () => {
    setCurrentPage('settings');
    setDropdownOpen(false);
  }

  return (
    <header className="flex items-center justify-between p-4 bg-surface dark:bg-gray-800 shadow-md">
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold text-text-primary dark:text-gray-100">Welcome, {user.name}!</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pr-10 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <SearchIcon className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => alert('Fitur notifikasi belum tersedia.')}>
          <BellIcon className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
            <div className='text-left hidden md:block'>
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-text-secondary dark:text-gray-400">{user.role}</p>
            </div>
            <ChevronDownIcon className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50">
              <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">Switch User</p>
              {MOCK_USERS.map(u => (
                <a
                  key={u.id}
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleUserChange(u); }}
                  className={`block px-4 py-2 text-sm ${user.id === u.id ? 'bg-blue-100 text-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                >
                  {u.name} ({u.role})
                </a>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Fitur profil belum tersedia.'); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Profile</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigateToSettings(); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Settings</a>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Anda telah logout.'); }} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
const BellIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;

export default Header;