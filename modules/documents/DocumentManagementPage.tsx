import React, { useState, useRef, useEffect } from 'react';
import { MOCK_DOCUMENTS } from '../../constants/mockData';
// Fix: Import specific types for stronger type checking.
import { Document, DocumentCategory, DocumentFileType } from '../../types';

const AddDocumentModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onSave: (doc: Document) => void;
    selectedFile: File | null;
}> = ({ isOpen, onClose, onSave, selectedFile }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    // Fix: Use the imported DocumentCategory type for state.
    const [category, setCategory] = useState<DocumentCategory>('Venue');
    // Fix: Use the imported DocumentFileType type for state.
    const [fileType, setFileType] = useState<DocumentFileType>('PDF');
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (selectedFile) {
            const fileNameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
            setName(fileNameWithoutExt);

            const extension = selectedFile.name.split('.').pop()?.toLowerCase();
            if (extension === 'pdf') {
                setFileType('PDF');
            } else if (['doc', 'docx'].includes(extension || '')) {
                setFileType('DOCX');
            } else if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
                setFileType('JPG');
            }
        }
    }, [selectedFile]);

    const handleResetAndClose = () => {
        setName('');
        setDescription('');
        setCategory('Venue');
        setFileType('PDF');
        setTags('');
        onClose();
    };

    const handleSubmit = () => {
        if (!name || !category || !fileType) {
            alert('Harap isi semua kolom yang wajib diisi.');
            return;
        }
        
        const newDocument: Document = {
            id: `d${Date.now()}`,
            name,
            description,
            category,
            fileType,
            version: 1,
            lastUpdated: new Date().toISOString().split('T')[0],
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        };
        onSave(newDocument);
        handleResetAndClose();
    };

    if (!isOpen) return null;

    const categories: DocumentCategory[] = ['Venue', 'Konsep', 'Talent', 'Vendor', 'MOU & SPK', 'Invoice & Kuitansi', 'Legalitas'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Detail Dokumen</h3>
                 {selectedFile && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-700 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
                        <p className="text-gray-600 dark:text-gray-300">File yang dipilih:</p>
                        <p className="font-semibold text-primary">{selectedFile.name}</p>
                    </div>
                )}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Dokumen</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description / Note</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Berikan informasi singkat tentang dokumen ini..."
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
                        {/* Fix: Replace `as any` with specific type assertion. */}
                        <select value={category} onChange={(e) => setCategory(e.target.value as DocumentCategory)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe File</label>
                        {/* Fix: Replace `as any` with specific type assertion. */}
                        <select value={fileType} onChange={(e) => setFileType(e.target.value as DocumentFileType)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100">
                            <option value="PDF">PDF</option>
                            <option value="DOCX">DOCX</option>
                            <option value="JPG">JPG</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (pisahkan dengan koma)</label>
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., jogja, legal, 2024" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={handleResetAndClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Batal</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Simpan</button>
                </div>
            </div>
        </div>
    );
};


const DocumentManagementPage: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSaveDocument = (newDocument: Document) => {
        setDocuments([newDocument, ...documents]);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setIsModalOpen(true);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const categories = ['All', ...Array.from(new Set(MOCK_DOCUMENTS.map(doc => doc.category)))];

    const filteredDocuments = documents.filter(doc => {
        const matchesCategory = filterCategory === 'All' || doc.category === filterCategory;
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const getFileIcon = (fileType: 'PDF' | 'DOCX' | 'JPG') => {
        switch (fileType) {
            case 'PDF': return <FilePdfIcon />;
            case 'DOCX': return <FileDocxIcon />;
            case 'JPG': return <FileJpgIcon />;
            default: return <FileDefaultIcon />;
        }
    }

    return (
        <div className="bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">Document Management</h2>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Cari dokumen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:border-gray-600"
                    />
                     <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 dark:border-gray-600"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.docx,.jpg,.jpeg,.png"
                    />
                    <button onClick={handleUploadClick} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap">
                        Unggah Dokumen
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Dokumen</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kategori</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Versi</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Update Terakhir</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tags</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredDocuments.map((doc: Document) => (
                            <tr key={doc.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="text-red-500 mr-3">{getFileIcon(doc.fileType)}</div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doc.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{doc.version}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doc.lastUpdated}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-wrap gap-1">
                                        {doc.tags.map(tag => <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full">{tag}</span>)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => alert(`Fitur unduh untuk ${doc.name} belum tersedia.`)} className="text-primary hover:text-blue-700">Unduh</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AddDocumentModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleSaveDocument}
                selectedFile={selectedFile}
            />
        </div>
    );
};

// Simple file icons
const FilePdfIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const FileDocxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const FileJpgIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const FileDefaultIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;

export default DocumentManagementPage;