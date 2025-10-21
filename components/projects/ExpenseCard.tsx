import React, { useState } from 'react';
// FIX: Corrected import path for types
import { Expense, ExpenseStatus, Project, ProjectHistoryLog } from '../../types';
import { ExpenseStatusBadge } from '../Badges';

interface ExpenseCardProps {
    expenses: Expense[];
    projectName: string;
    onOpenModal: (type: 'expense', data?: Expense | null) => void;
    onUpdateProject: (updater: (prev: Project) => Partial<Project>, log?: ProjectHistoryLog) => void;
    createHistoryLog: (action: string) => ProjectHistoryLog;
    canEdit: boolean;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expenses, projectName, onOpenModal, onUpdateProject, createHistoryLog, canEdit }) => {
    const [filter, setFilter] = useState<ExpenseStatus | 'All'>('All');

    const handleDeleteExpense = (expenseId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
            const expenseToDelete = expenses.find(e => e.id === expenseId);
            if (!expenseToDelete) return;
            const log = createHistoryLog(`Menghapus pengeluaran: "${expenseToDelete.item}".`);
            onUpdateProject(prev => ({ expenses: prev.expenses.filter(e => e.id !== expenseId) }), log);
        }
    };
    
    const handleExportCSV = () => {
        const filtered = expenses.filter(e => filter === 'All' || e.status === filter);
        if (filtered.length === 0) {
            alert("Tidak ada data pengeluaran untuk diekspor.");
            return;
        }

        const headers = ['Item', 'Jumlah', 'Tanggal', 'Status'];
        const csvRows = [
            headers.join(','),
            ...filtered.map(expense => [
                `"${expense.item.replace(/"/g, '""')}"`, // Escape double quotes
                expense.amount,
                expense.date,
                expense.status
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        const url = URL.createObjectURL(blob);
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `pengeluaran_${projectName.replace(/ /g, '_')}_${dateStr}.csv`;

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredExpenses = expenses.filter(e => filter === 'All' || e.status === filter);

    return (
        <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold dark:text-gray-100">Pengeluaran</h3>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as ExpenseStatus | 'All')}
                        className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm text-gray-900 dark:text-gray-100"
                    >
                        <option value="All">Semua Status</option>
                        {/* FIX: Explicitly type 's' to resolve 'unknown' type error. */}
                        {Object.values(ExpenseStatus).map((s: ExpenseStatus) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                     <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition">
                        <DocumentArrowDownIcon />
                        <span>Ekspor CSV</span>
                    </button>
                    {canEdit && (
                        <button onClick={() => onOpenModal('expense')} className="px-3 py-1 bg-secondary text-white text-sm rounded-lg hover:bg-green-700">
                            Tambah Pengeluaran
                        </button>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="text-xs text-text-secondary uppercase bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-4 py-2 text-left">Item</th>
                            <th className="px-4 py-2 text-left">Jumlah</th>
                            <th className="px-4 py-2 text-left">Tanggal</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            {canEdit && <th className="px-4 py-2 text-left">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredExpenses.length > 0 ? (
                            filteredExpenses.map(expense => (
                                <tr key={expense.id} className="text-sm dark:text-gray-200">
                                    <td className="px-4 py-3 font-medium">{expense.item}</td>
                                    <td className="px-4 py-3">Rp {expense.amount.toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3">{expense.date}</td>
                                    <td className="px-4 py-3"><ExpenseStatusBadge status={expense.status} /></td>
                                    {canEdit && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => onOpenModal('expense', expense)} className="text-primary hover:underline">Edit</button>
                                                <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-600 hover:underline">Hapus</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={canEdit ? 5 : 4} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                                    Tidak ada data.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DocumentArrowDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;

export default ExpenseCard;
