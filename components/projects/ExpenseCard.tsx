import React, { useState } from 'react';
import { Expense, ExpenseStatus, Project, ProjectHistoryLog } from '../../types';
import { ExpenseStatusBadge } from '../Badges';

interface ExpenseCardProps {
    expenses: Expense[];
    onOpenModal: (type: 'expense', data?: Expense | null) => void;
    onUpdateProject: (updater: (prev: Project) => Partial<Project>, log?: ProjectHistoryLog) => void;
    createHistoryLog: (action: string) => ProjectHistoryLog;
    canEdit: boolean;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expenses, onOpenModal, onUpdateProject, createHistoryLog, canEdit }) => {
    const [filter, setFilter] = useState<ExpenseStatus | 'All'>('All');

    const handleDeleteExpense = (expenseId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
            const expenseToDelete = expenses.find(e => e.id === expenseId);
            if (!expenseToDelete) return;
            const log = createHistoryLog(`Menghapus pengeluaran: "${expenseToDelete.item}".`);
            onUpdateProject(prev => ({ expenses: prev.expenses.filter(e => e.id !== expenseId) }), log);
        }
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
                        {Object.values(ExpenseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                {canEdit && (
                    <button onClick={() => onOpenModal('expense')} className="px-3 py-1 bg-secondary text-white text-sm rounded-lg hover:bg-green-700">
                        Tambah Pengeluaran
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
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

export default ExpenseCard;
