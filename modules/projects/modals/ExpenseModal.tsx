import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected import path for types
import { Expense, ExpenseStatus } from '../../../types';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (expense: Expense) => void;
    expense: Expense | null;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave, expense }) => {
    const [item, setItem] = useState('');
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState('');
    const [receiptFilenames, setReceiptFilenames] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (expense) {
            setItem(expense.item);
            setAmount(expense.amount);
            setDate(expense.date);
            setReceiptFilenames(expense.receiptFilenames || []);
        } else {
            setItem('');
            setAmount(0);
            setDate(new Date().toISOString().split('T')[0]);
            setReceiptFilenames([]);
        }
    }, [expense, isOpen]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            // FIX: Explicitly type 'file' as File to access its 'name' property.
            const newFiles = Array.from(event.target.files).map((file: File) => file.name);
            setReceiptFilenames(prev => [...new Set([...prev, ...newFiles])]);
        }
    };
    
    const removeReceipt = (filenameToRemove: string) => {
        setReceiptFilenames(prev => prev.filter(name => name !== filenameToRemove));
    };

    const handleSave = () => {
        if (!item.trim() || amount <= 0) {
            alert('Item dan jumlah harus diisi dengan benar.');
            return;
        }
        onSave({
            id: expense?.id || `e${Date.now()}`,
            item,
            amount,
            date,
            status: expense?.status || ExpenseStatus.Pending,
            receiptFilenames
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">{expense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Item</label>
                        <input type="text" value={item} onChange={(e) => setItem(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah (Rp)</label>
                            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bukti Pembayaran</label>
                        <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-1 w-full flex justify-center items-center gap-2 px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <UploadIcon />
                            <span>Unggah File</span>
                        </button>
                        <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                            {receiptFilenames.map(name => (
                                <div key={name} className="flex items-center justify-between text-sm bg-gray-100 dark:bg-gray-700 p-1.5 rounded">
                                    <span className="truncate text-gray-700 dark:text-gray-200 pr-2">{name}</span>
                                    <button onClick={() => removeReceipt(name)} className="text-red-500 hover:text-red-700 flex-shrink-0">
                                       <XCircleIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Batal</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Simpan</button>
                </div>
            </div>
        </div>
    );
};

// Icons
const UploadIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
const XCircleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default ExpenseModal;
