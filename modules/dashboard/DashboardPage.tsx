
import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Project, ProjectStatus } from '../../types';
import { DataContext } from '../../App';
import { ProjectStatusBadge } from '../../components/Badges';
import AISummaryCard from './AISummaryCard';

const DashboardCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-surface rounded-xl shadow-lg p-6 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-text-secondary text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;
    const { allProjects } = dataContext;

    const totalProjects = allProjects.length;
    const activeProjects = allProjects.filter(p => p.status === 'On Progress').length;
    const totalRevenue = allProjects.reduce((sum, p) => sum + p.budget.pemasukan, 0);
    const totalExpense = allProjects.reduce((sum, p) => {
        const projectExpenses = p.expenses.reduce((expenseSum, item) => expenseSum + item.amount, 0);
        return sum + projectExpenses;
    }, 0);
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpense) / totalRevenue * 100).toFixed(1) + '%' : '0%';

    const chartData = allProjects.slice(0, 5).map(p => {
        const pengeluaran = p.expenses.reduce((sum, item) => sum + item.amount, 0);
        return {
            name: p.name.substring(0, 15) + '...',
            Pemasukan: p.budget.pemasukan,
            Pengeluaran: pengeluaran,
        }
    });

    return (
        <div className="space-y-8">
            <AISummaryCard />
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Total Proyek Aktif" value={activeProjects.toString()} color="bg-blue-900/50 text-blue-300" icon={<FolderOpenIcon />} />
                <DashboardCard title="Total Pendapatan" value={`Rp ${new Intl.NumberFormat('id-ID').format(totalRevenue)}`} color="bg-green-900/50 text-green-300" icon={<TrendingUpIcon />} />
                <DashboardCard title="Total Pengeluaran" value={`Rp ${new Intl.NumberFormat('id-ID').format(totalExpense)}`} color="bg-red-900/50 text-red-400" icon={<TrendingDownIcon />} />
                <DashboardCard title="Margin Profit" value={profitMargin} color="bg-yellow-800/50 text-primary" icon={<ScaleIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Analitik */}
                <div className="lg:col-span-2 bg-surface rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Analitik Pendapatan vs Pengeluaran</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.3)" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <YAxis tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value as number)} tick={{ fill: '#9CA3AF' }} />
                                <Tooltip
                                    formatter={(value) => `Rp ${new Intl.NumberFormat('id-ID').format(value as number)}`}
                                    contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '0.5rem' }}
                                    labelStyle={{ color: '#F3F4F6' }}
                                />
                                <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                                <Bar dataKey="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-surface rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Aktivitas Proyek Terkini</h3>
                    <ul className="space-y-4">
                        {allProjects.slice(0, 5).map((project: Project) => (
                            <li key={project.id} className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <img className="w-10 h-10 rounded-full" src={project.pic.avatarUrl} alt={project.pic.name} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-text-primary">{project.name}</p>
                                    <div className="flex items-center justify-between text-xs text-text-secondary mt-1">
                                        <span>{project.pic.name}</span>
                                        <ProjectStatusBadge status={project.status} />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

// Icons
const FolderOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 0a2.25 2.25 0 01-2.25-2.25V5.25A2.25 2.25 0 013.75 3h5.218c.453 0 .894.18 1.22.486l2.36 1.968c.327.27.768.446 1.22.446h5.218a2.25 2.25 0 012.25 2.25v2.25M3.75 9.75a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 003.75 21h16.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25H3.75z" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625V3.375" /></svg>;
const TrendingDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" /></svg>;
const ScaleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.153.34c-1.325 0-2.59-.383-3.628-1.035a11.944 11.944 0 01-2.824-2.824 5.988 5.988 0 01-1.035-3.628 5.988 5.988 0 01.34-2.153c.175-.483.703-.71 1.202-.589L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.153.34c-1.325 0-2.59-.383-3.628-1.035a11.944 11.944 0 01-2.824-2.824 5.988 5.988 0 01-1.035-3.628 5.988 5.988 0 01.34-2.153c.175-.483.703-.71 1.202-.589L5.25 4.971z" /></svg>;


export default DashboardPage;