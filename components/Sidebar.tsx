import React, { useContext } from 'react';
import { Page, UserRole } from '../types';
import { UserContext } from '../App';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  // FIX: Changed icon type to be more specific, accepting a className prop. This resolves the React.cloneElement type error.
  icon: React.ReactElement<{ className?: string }>;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}> = ({ page, label, icon, currentPage, setCurrentPage }) => {
  const isActive = currentPage === page;
  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage(page);
        }}
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
          isActive ? 'bg-primary text-black font-bold shadow-lg' : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        {/* FIX: Removed unnecessary type assertion as the icon prop type is now more specific. */}
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
        <span className="flex-1">{label}</span>
      </a>
    </li>
  );
};

// FIX: Added an interface for navigation item data to enforce type safety for the 'page' property.
interface NavItemData {
  page: Page;
  label: string;
  icon: React.ReactElement<{ className?: string }>;
}

// Define page permissions for each role
const PAGE_PERMISSIONS: Record<UserRole, Page[]> = {
  [UserRole.Admin]: [
    'dashboard', 'operational', 'projects', 'assets', 'documents', 'users', 
    'departments', 'gemini', 'notifications', 'calendar', 'settings'
  ],
  [UserRole.Manager]: [
    'dashboard', 'operational', 'projects', 'assets', 'documents', 
    'departments', 'gemini', 'notifications', 'calendar', 'settings'
  ],
  [UserRole.Staff]: [
    'dashboard', 'operational', 'projects', 'assets', 'documents', 
    'notifications', 'calendar', 'settings'
  ],
  [UserRole.AssetManager]: [
    'dashboard', 'operational', 'assets', 'notifications', 'calendar', 'settings'
  ],
  [UserRole.Finance]: [
    'dashboard', 'operational', 'projects', 'documents', 'notifications', 'calendar', 'settings'
  ],
};


const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const userContext = useContext(UserContext);
  if (!userContext) return null; // Should not happen in a logged-in state
  const { user } = userContext;

  const allowedPages = PAGE_PERMISSIONS[user.role] || [];

  // FIX: Applied the NavItemData type to ensure all items have a 'page' property of type Page.
  const mainNavItems: NavItemData[] = [
    { page: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { page: 'operational', label: 'Operasional', icon: <ClipboardListIcon /> },
    { page: 'projects', label: 'Proyek', icon: <FolderIcon /> },
    { page: 'calendar', label: 'Kalender', icon: <CalendarIcon /> },
    { page: 'assets', label: 'Aset', icon: <CubeIcon /> },
    { page: 'documents', label: 'Dokumen', icon: <DocumentTextIcon /> },
    { page: 'users', label: 'Pengguna', icon: <UsersIcon /> },
  ];

  // FIX: Applied the NavItemData type to ensure all items have a 'page' property of type Page.
  const additionalNavItems: NavItemData[] = [
    { page: 'departments', label: 'Departemen Lain', icon: <OfficeBuildingIcon /> },
    { page: 'gemini', label: 'Gemini AI', icon: <SparklesIcon /> },
  ];

  const visibleMainNavItems = mainNavItems.filter(item => allowedPages.includes(item.page));
  const visibleAdditionalNavItems = additionalNavItems.filter(item => allowedPages.includes(item.page));


  return (
    <aside className="w-64 bg-surface-secondary flex-shrink-0 p-4 flex flex-col shadow-lg">
      <div className="flex items-center gap-3 p-3 mb-6">
        <img src="/logo.png" alt="Mili Cipta Karya" className="h-10 w-10" />
        <h1 className="text-xl font-bold text-text-primary whitespace-nowrap">MILITAN DASH</h1>
      </div>
      <nav className="flex-1">
        <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Utama</h2>
        <ul className="space-y-2">
          {visibleMainNavItems.map(item => (
            <NavItem key={item.page} {...item} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          ))}
        </ul>
        {visibleAdditionalNavItems.length > 0 && (
          <>
            <h2 className="px-3 mt-8 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tambahan</h2>
            <ul className="space-y-2">
              {visibleAdditionalNavItems.map(item => (
                <NavItem key={item.page} {...item} currentPage={currentPage} setCurrentPage={setCurrentPage} />
              ))}
            </ul>
          </>
        )}
      </nav>
      <div className="mt-auto">
        <ul className="space-y-2">
          <NavItem page="notifications" label="Notifikasi" icon={<BellIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <NavItem page="settings" label="Pengaturan" icon={<CogIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </ul>
      </div>
    </aside>
  );
};

// Icon components (using Heroicons style for consistency)
const HomeIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.125 1.125 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
const ClipboardListIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const FolderIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const CubeIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;
const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const UsersIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663v.005zM18 7.5a3 3 0 11-6 0 3 3 0 016 0zM12 12.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const OfficeBuildingIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.75.75 0 01.75.75v3.375a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75V7.5a.75.75 0 01.75-.75zm0 9h6.375a.75.75 0 01.75.75v3.375a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-3.375a.75.75 0 01.75-.75z" /></svg>;
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.696-2.696L11.25 18l1.938-.648a3.375 3.375 0 002.696-2.696L16.25 13l.648 1.938a3.375 3.375 0 002.696 2.696L21.5 18l-1.938.648a3.375 3.375 0 00-2.696 2.696z" /></svg>;
const BellIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
const CogIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.227l.128-.051c.66-.264 1.37-.264 2.03 0l.128.051c.55.22 1.02-.685 1.11 1.227l.068.411a11.96 11.96 0 002.822 1.658l.37.153c.64.264 1.04.88 1.04 1.554v.499c0 .674-.4 1.29-.98 1.554l-.37.153a11.96 11.96 0 00-2.822 1.658l-.068.411c-.09.542-.56 1.007-1.11 1.227l-.128.051c-.66.264-1.37.264-2.03 0l-.128-.051c-.55-.22-1.02-.685-1.11-1.227l-.068-.411a11.96 11.96 0 00-2.822-1.658l-.37-.153c-.64-.264-1.04-.88-1.04-1.554v-.499c0-.674.4-1.29.98-1.554l.37-.153a11.96 11.96 0 002.822 1.658l.068-.411zM12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>;

export default Sidebar;