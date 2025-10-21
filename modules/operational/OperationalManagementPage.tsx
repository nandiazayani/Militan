import React, { useState, useContext, useMemo } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { DataContext } from '../../contexts/DataContext';
// FIX: Corrected import path for types
import { User, UserRole, DailyReport, DailyReportStatus, DailyReportHistoryLog } from '../../types';
import DailyReportModal from './modals/DailyReportModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


interface Shift {
    startTime: Date;
    endTime: Date | null;
}

const OperationalManagementPage: React.FC = () => {
    const userContext = useContext(UserContext);
    const dataContext = useContext(DataContext);

    // State for individual user (Staff)
    const [isShiftActive, setIsShiftActive] = useState(false);
    const [shiftHistory, setShiftHistory] = useState<Shift[]>([]);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    
    // State for management view
    const [view, setView] = useState<'attendance' | 'reports'>('attendance');
    const [departmentFilter, setDepartmentFilter] = useState<string>('All');
    const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
    const [managerNotes, setManagerNotes] = useState('');


    if (!userContext || !dataContext) return null;
    const { user: currentUser } = userContext;
    const { allUsers, allDailyReports, addDailyReport, updateDailyReport } = dataContext;

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysReport = allDailyReports.find(r => r.userId === currentUser.id && r.date === todayStr);

    // --- Logic for Individual User (Staff) ---
    const startShift = () => {
        setIsShiftActive(true);
        setShiftHistory(prev => [...prev, { startTime: new Date(), endTime: null }]);
    };

    const endShift = () => {
        setIsShiftActive(false);
        setShiftHistory(prev => {
            const newHistory = [...prev];
            const lastShift = newHistory[newHistory.length - 1];
            if (lastShift && !lastShift.endTime) {
                lastShift.endTime = new Date();
            }
            return newHistory;
        });
    };
    
    const handleSaveReport = async (report: DailyReport) => {
        const isEditing = allDailyReports.some(r => r.id === report.id);
        const oldReport = allDailyReports.find(r => r.id === report.id);

        let logAction = '';
        if (!isEditing) {
            logAction = report.status === DailyReportStatus.Draft ? 'membuat draf laporan.' : 'membuat dan langsung mengirimkan laporan.';
        } else if (oldReport) {
            if (oldReport.status === DailyReportStatus.Draft && report.status === DailyReportStatus.Submitted) {
                logAction = 'mengirimkan laporan untuk direview.';
            } else if (oldReport.status === DailyReportStatus.Submitted && report.status === DailyReportStatus.Submitted) {
                logAction = 'merevisi laporan yang telah dikirim.';
            } else if (oldReport.status === DailyReportStatus.Revision && report.status === DailyReportStatus.Submitted) {
                logAction = 'mengirimkan kembali laporan setelah revisi.';
            } else {
                logAction = 'memperbarui draf laporan.';
            }
        }

        const createHistoryLog = (action: string): DailyReportHistoryLog => ({
            id: `drh-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: currentUser,
            action,
        });

        const newLog = createHistoryLog(logAction);
        const updatedHistory = [...(oldReport?.history || []), newLog];
        const reportToSave = { ...report, history: updatedHistory };

        if (isEditing) {
            await updateDailyReport(reportToSave);
        } else {
            await addDailyReport(reportToSave);
        }
        setIsReportModalOpen(false);
    };

    // --- Logic for Management View ---
    const departments = useMemo(() => ['All', ...new Set(allUsers.map(u => u.department).filter(Boolean))], [allUsers]) as string[];
    
    const filteredUsers = useMemo(() => {
        if (departmentFilter === 'All') return allUsers;
        return allUsers.filter(u => u.department === departmentFilter);
    }, [allUsers, departmentFilter]);
    
    const getUserStatus = (user: User): { status: 'Aktif' | 'Tidak Aktif'; startTime: string | null } => {
        if (user.id === 'u2' || user.id === 'u6') return { status: 'Aktif', startTime: '08:03' };
        if (user.id === 'u3' ) return { status: 'Aktif', startTime: '08:15' };
        return { status: 'Tidak Aktif', startTime: null };
    };
    
    const handleManagerAction = (status: DailyReportStatus.Reviewed | DailyReportStatus.Revision) => {
        if (selectedReport) {
            const logAction = status === DailyReportStatus.Reviewed
                ? 'menyetujui laporan harian.'
                : 'meminta revisi untuk laporan harian.';
            
            const log: DailyReportHistoryLog = {
                id: `drh-${Date.now()}`,
                timestamp: new Date().toISOString(),
                user: currentUser,
                action: logAction,
            };

            const updatedReport = {
                ...selectedReport,
                status: status,
                managerNotes: managerNotes,
                history: [...(selectedReport.history || []), log]
            };
            updateDailyReport(updatedReport);
            setSelectedReport(null);
            setManagerNotes('');
        }
    };


    const openReportDetail = (report: DailyReport) => {
        setSelectedReport(report);
        setManagerNotes(report.managerNotes || '');
    };

    const renderIndividualView = () => {
        const reportStatus = todaysReport?.status;

        const getReportButtonProps = () => {
            switch (reportStatus) {
                case DailyReportStatus.Draft:
                case DailyReportStatus.Revision:
                    return { text: reportStatus === 'Draft' ? 'Lanjutkan Laporan' : 'Revisi Laporan', className: 'bg-primary hover:bg-yellow-500 text-black', disabled: false };
                case DailyReportStatus.Submitted:
                    return { text: 'Laporan Terkirim', className: 'bg-gray-600 text-white', disabled: true };
                case DailyReportStatus.Reviewed:
                    return { text: 'Lihat Laporan', className: 'bg-gray-600 hover:bg-gray-500 text-white', disabled: false };
                default: // No report yet
                    return { text: 'Buat Laporan', className: 'bg-primary hover:bg-yellow-500 text-black', disabled: false };
            }
        };

        const buttonProps = getReportButtonProps();
        
        const statusStyles: { [key in DailyReportStatus]?: string } = {
            [DailyReportStatus.Draft]: 'text-yellow-400',
            [DailyReportStatus.Submitted]: 'text-green-400',
            [DailyReportStatus.Revision]: 'text-orange-400',
            [DailyReportStatus.Reviewed]: 'text-blue-400',
        };

        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Clock In/Out Section */}
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4">Absensi Harian</h3>
                        <button
                            onClick={isShiftActive ? endShift : startShift}
                            className={`w-full py-3 font-bold rounded-lg transition-transform transform hover:scale-105 ${isShiftActive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                        >
                            {isShiftActive ? 'Akhiri Shift' : 'Mulai Shift'}
                        </button>
                        {isShiftActive && (
                            <div className="p-3 bg-primary/20 text-primary rounded-lg text-center mt-4 text-sm">
                                Shift dimulai: {shiftHistory[shiftHistory.length - 1]?.startTime.toLocaleTimeString('id-ID')}
                            </div>
                        )}
                    </div>
                    {/* Daily Report Section */}
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <h3 className="font-semibold text-lg mb-4">Laporan Harian</h3>
                         <div className="text-center">
                            <p className="text-gray-400 text-sm mb-2">Status Laporan Hari Ini:</p>
                            <p className={`font-bold text-lg ${reportStatus ? statusStyles[reportStatus] : 'text-gray-500'}`}>{reportStatus || 'Belum Dibuat'}</p>
                             <button 
                                onClick={() => setIsReportModalOpen(true)}
                                className={`mt-3 w-full py-3 font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${buttonProps.className}`}
                                disabled={buttonProps.disabled}
                             >
                                {buttonProps.text}
                             </button>
                        </div>
                    </div>
                </div>
            </>
        );
    };
    
    const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
        <div className="bg-gray-700/50 p-4 rounded-lg flex items-center shadow-sm">
            <div className="p-3 rounded-full bg-primary/20 text-primary mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-xl font-bold text-gray-100">{value}</p>
            </div>
        </div>
    );

    const renderManagementView = () => {
        // --- Data processing for visualizations ---
        const getStartOfWeek = (date: Date) => {
            const d = new Date(date);
            d.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1)); // Week starts on Monday
            d.setHours(0, 0, 0, 0);
            return d;
        };

        const today = new Date();
        const startOfWeek = getStartOfWeek(today);

        const reportsToday = allDailyReports.filter(r => r.date === todayStr && (r.status === DailyReportStatus.Submitted || r.status === DailyReportStatus.Reviewed));
        const reportsThisWeek = allDailyReports.filter(r => new Date(r.date) >= startOfWeek);

        const totalHoursThisWeek = reportsThisWeek.reduce((sum, report) => {
            return sum + report.tasks.reduce((taskSum, task) => taskSum + task.hoursSpent, 0);
        }, 0);

        const productivityData = reportsThisWeek.reduce((acc, report) => {
            const user = allUsers.find(u => u.id === report.userId);
            if (!user) return acc;
            const totalHours = report.tasks.reduce((sum, task) => sum + task.hoursSpent, 0);
            acc[user.name] = (acc[user.name] || 0) + totalHours;
            return acc;
        }, {} as Record<string, number>);

        // FIX: Explicitly type 'a' and 'b' in the sort callback to resolve the arithmetic operation error.
        const mostProductiveEmployee = Object.entries(productivityData).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0];

        const departmentHours = reportsThisWeek.reduce((acc, report) => {
            const user = allUsers.find(u => u.id === report.userId);
            if (!user || !user.department) return acc;
            const totalHours = report.tasks.reduce((sum, task) => sum + task.hoursSpent, 0);
            acc[user.department] = (acc[user.department] || 0) + totalHours;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(departmentHours).map(([name, hours]) => ({ name, hours }));

        return (
            <>
                 <div className="mb-8">
                    <h3 className="text-xl font-semibold text-text-primary mb-4">Ringkasan Kinerja Tim (Minggu Ini)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <StatCard title="Laporan Dikirim Hari Ini" value={reportsToday.length.toString()} icon={<DocumentCheckIcon />} />
                        <StatCard title="Total Jam Tercatat" value={`${totalHoursThisWeek.toFixed(1)} jam`} icon={<ClockIcon />} />
                        <StatCard title="Karyawan Terproduktif" value={mostProductiveEmployee ? mostProductiveEmployee[0] : '-'} icon={<UserIcon />} />
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg h-80">
                        <h4 className="text-md font-semibold mb-4 text-text-secondary">Total Jam per Departemen</h4>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <YAxis tick={{ fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                                    labelStyle={{ color: '#F3F4F6' }}
                                    formatter={(value: number) => [`${value.toFixed(1)} jam`, 'Total Jam']}
                                />
                                <Bar dataKey="hours" name="Total Jam" fill="#FDB813" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">Manajemen Operasional Tim</h2>
                    <div className="flex items-center gap-4 p-1 bg-gray-700/50 rounded-lg">
                        <button onClick={() => setView('attendance')} className={`px-4 py-1.5 rounded-md text-sm font-semibold ${view === 'attendance' ? 'bg-primary text-black' : 'text-gray-300'}`}>Kehadiran</button>
                        <button onClick={() => setView('reports')} className={`px-4 py-1.5 rounded-md text-sm font-semibold ${view === 'reports' ? 'bg-primary text-black' : 'text-gray-300'}`}>Laporan Harian</button>
                    </div>
                </div>

                {view === 'attendance' ? (
                    // Attendance View
                    <div>
                        <div className="flex justify-end mb-4">
                            <select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                            >
                                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Karyawan</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Departemen</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Waktu Mulai</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface divide-y divide-gray-700">
                                    {filteredUsers.map((user) => {
                                        const { status, startTime } = getUserStatus(user);
                                        return (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} /><div className="ml-4"><div className="text-sm font-medium text-gray-100">{user.name}</div><div className="text-xs text-text-primary">{user.role}</div></div></div></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.department}</td>
                                                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'Aktif' ? 'bg-green-900/50 text-green-300' : 'bg-gray-600 text-gray-200'}`}>{status}</span></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{startTime || '-'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    // Reports View
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Laporan Harian Tim - {todayStr}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {allUsers.filter(u => u.role === UserRole.Staff).map(user => {
                                const report = allDailyReports.find(r => r.userId === user.id && r.date === todayStr);
                                const statusStyles: Record<DailyReportStatus, string> = {
                                    [DailyReportStatus.Draft]: 'text-yellow-400',
                                    [DailyReportStatus.Submitted]: 'text-green-400',
                                    [DailyReportStatus.Revision]: 'text-orange-400',
                                    [DailyReportStatus.Reviewed]: 'text-blue-400',
                                };
                                return (
                                    <div key={user.id} className="p-4 bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-semibold text-sm">{user.name}</p>
                                                <p className="text-xs text-gray-400">{user.department}</p>
                                            </div>
                                        </div>
                                        {report ? (
                                            <div>
                                                <p className="text-xs mb-2">Status: <span className={`font-bold ${statusStyles[report.status]}`}>{report.status}</span></p>
                                                <button onClick={() => openReportDetail(report)} className="w-full text-center text-xs py-1.5 bg-secondary text-white rounded-md hover:bg-gray-500">Lihat Detail</button>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-xs text-gray-500">Belum ada laporan</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                {selectedReport && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={() => setSelectedReport(null)}>
                        <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-bold mb-4 text-white">Detail Laporan - {allUsers.find(u=>u.id === selectedReport.userId)?.name}</h3>
                            <div className="flex-grow overflow-y-auto space-y-3 pr-2 -mr-2">
                                {selectedReport.tasks.map(task => (
                                    <div key={task.id} className="p-3 bg-gray-700 rounded-md">
                                        <p className="font-semibold">{task.description}</p>
                                        <p className="text-sm text-gray-400">Durasi: {task.hoursSpent} jam</p>
                                        {task.attachments.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-gray-600">
                                                <p className="text-xs font-medium text-gray-300">Lampiran:</p>
                                                <ul className="list-disc list-inside text-xs text-primary">
                                                    {task.attachments.map(file => <li key={file}>{file}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-gray-600">
                                    <h4 className="text-md font-semibold text-gray-200 mb-2">Review Manajer</h4>
                                    <textarea
                                        value={managerNotes}
                                        onChange={(e) => setManagerNotes(e.target.value)}
                                        placeholder="Tambahkan catatan atau umpan balik di sini..."
                                        rows={3}
                                        className="w-full bg-gray-600 rounded-md p-2 text-sm text-gray-100 focus:ring-primary focus:border-primary"
                                        disabled={selectedReport.status === 'Reviewed'}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3 border-t border-gray-700 pt-4">
                                <button onClick={() => setSelectedReport(null)} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Tutup</button>
                                {selectedReport.status === 'Submitted' && (
                                    <>
                                        <button 
                                            onClick={() => handleManagerAction(DailyReportStatus.Revision)} 
                                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                        >
                                            Minta Revisi
                                        </button>
                                        <button 
                                            onClick={() => handleManagerAction(DailyReportStatus.Reviewed)} 
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            Setujui Laporan
                                        </button>
                                    </>
                                )}
                                {selectedReport.status === 'Reviewed' && (
                                    <button 
                                        className="px-4 py-2 bg-green-800 text-white rounded-lg cursor-default"
                                        disabled
                                    >
                                        Telah Disetujui
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6">
            {(currentUser.role === UserRole.Admin || currentUser.role === UserRole.Manager)
                ? renderManagementView()
                : renderIndividualView()
            }
            <DailyReportModal 
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onSave={handleSaveReport}
                userId={currentUser.id}
                date={todayStr}
                existingReport={todaysReport}
                readOnly={todaysReport?.status === DailyReportStatus.Reviewed}
            />
        </div>
    );
};

// Icons for Stat Cards
const DocumentCheckIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClockIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;

export default OperationalManagementPage;