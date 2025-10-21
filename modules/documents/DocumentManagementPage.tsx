
import React, { useState, useContext } from 'react';
import { DataContext, UserContext } from '../../App';
import { Document, DocumentCategory, DocumentFileType, UserRole } from '../../types';
import { GoogleGenAI } from "@google/genai";


// Modal for adding/editing a document
const DocumentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (document: Document) => void;
    document: Document | null;
}> = ({ isOpen, onClose, onSave, document }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<DocumentCategory>('Konsep');
    const [fileType, setFileType] = useState<DocumentFileType>('PDF');
    const [tags, setTags] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);


    React.useEffect(() => {
        if (document) {
            setName(document.name);
            setDescription(document.description);
            setCategory(document.category);
            setFileType(document.fileType);
            setTags(document.tags.join(', '));
        } else {
            setName('');
            setDescription('');
            setCategory('Konsep');
            setFileType('PDF');
            setTags('');
        }
    }, [document, isOpen]);

    const handleGenerateDescription = async () => {
        if (!name.trim()) {
            alert("Harap isi Nama Dokumen terlebih dahulu untuk membuat deskripsi.");
            return;
        }
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Buat deskripsi singkat dan profesional (sekitar 20-30 kata) untuk sebuah dokumen dengan detail berikut:
- Nama Dokumen: "${name}"
- Kategori Dokumen: "${category}"

Deskripsi harus menjelaskan isi dan tujuan utama dokumen secara ringkas dalam Bahasa Indonesia.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setDescription(response.text);

        } catch (err) {
            console.error("Gemini description generation error:", err);
            alert("Gagal membuat deskripsi. Silakan coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };


    const handleSave = () => {
        if (!name.trim() || !description.trim()) {
            alert('Nama dan deskripsi dokumen harus diisi.');
            return;
        }
        const newDocument: Document = {
            id: document?.id || `d${Date.now()}`,
            name,
            description,
            category,
            fileType,
            version: document?.version || 1,
            lastUpdated: new Date().toISOString().split('T')[0],
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        };
        onSave(newDocument);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-white">{document ? 'Edit Dokumen' : 'Tambah Dokumen Baru'}</h3>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Nama Dokumen</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-300">Deskripsi</label>
                            <button
                                onClick={handleGenerateDescription}
                                disabled={isGenerating || !name.trim()}
                                className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary/20 text-gray-300 rounded-md hover:bg-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {isGenerating ? <SpinnerIcon/> : <SparklesIcon />}
                                <span>Buat dengan AI</span>
                            </button>
                        </div>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" disabled={isGenerating}></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Kategori</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value as DocumentCategory)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100">
                                {['Venue', 'Konsep', 'Talent', 'Vendor', 'MOU & SPK', 'Invoice & Kuitansi', 'Legalitas'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300">Tipe File</label>
                            <select value={fileType} onChange={(e) => setFileType(e.target.value as DocumentFileType)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100">
                                {['PDF', 'DOCX', 'JPG'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Tags (pisahkan dengan koma)</label>
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500">Simpan</button>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    documentName?: string;
}> = ({ isOpen, onClose, onConfirm, documentName }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-2 text-white">Konfirmasi Penghapusan</h3>
                <p className="text-gray-300 mb-6">
                    Apakah Anda yakin ingin menghapus dokumen <strong className="text-white">{documentName || 'ini'}</strong>? Tindakan ini tidak dapat diurungkan.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500">Batal</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus</button>
                </div>
            </div>
        </div>
    );
};

const DocumentManagementPage: React.FC = () => {
    const dataContext = useContext(DataContext);
    const userContext = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

    if (!dataContext || !userContext) {
        return <div>Memuat data dokumen...</div>;
    }

    const { allDocuments, addDocument, updateDocument, deleteDocument } = dataContext;
    const { user } = userContext;
    const canManageDocuments = user.role === UserRole.Admin || user.role === UserRole.Manager;

    const handleAddDocument = () => {
        setEditingDocument(null);
        setIsModalOpen(true);
    };
    
    const handleEditDocument = (doc: Document) => {
        setEditingDocument(doc);
        setIsModalOpen(true);
    };

    const handleSaveDocument = async (savedDocument: Document) => {
        const isEditing = allDocuments.some(d => d.id === savedDocument.id);
        const docToSave = isEditing ? { ...savedDocument, version: savedDocument.version + 1 } : savedDocument;
        
        if (isEditing) {
            await updateDocument(docToSave);
        } else {
            await addDocument(docToSave);
        }
        setIsModalOpen(false);
    };
    
    const handleDeleteClick = (doc: Document) => {
        setDocumentToDelete(doc);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteDocument = async () => {
        if (documentToDelete) {
            await deleteDocument(documentToDelete.id);
        }
        setIsDeleteConfirmOpen(false);
        setDocumentToDelete(null);
    };

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Document Management</h2>
                {canManageDocuments && (
                    <button onClick={handleAddDocument} className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500 transition">
                        Tambah Dokumen Baru
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nama Dokumen</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Kategori</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Versi</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Update Terakhir</th>
                            {canManageDocuments && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>}
                        </tr>
                    </thead>
                    <tbody className="bg-surface divide-y divide-gray-700">
                        {allDocuments.map((doc: Document) => (
                            <tr key={doc.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-100">{doc.name}</div>
                                    <div className="text-xs text-gray-400">{doc.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{doc.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">v{doc.version}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{doc.lastUpdated}</td>
                                {canManageDocuments && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEditDocument(doc)} className="text-primary hover:text-yellow-500 mr-4">Edit</button>
                                        <button onClick={() => handleDeleteClick(doc)} className="text-red-500 hover:text-red-400">Hapus</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <DocumentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveDocument}
                document={editingDocument}
            />
            <DeleteConfirmationModal 
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDeleteDocument}
                documentName={documentToDelete?.name}
            />
        </div>
    );
};

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-15l1.09 2.18L12 6l-2.18 1.09L9 9.27l-1.09-2.18L6 6l2.18-1.09L9 2.73zM18 15l-1.09-2.18L15 12l2.18-1.09L18 8.73l1.09 2.18L21 12l-2.18 1.09L18 15z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-4 w-4 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default DocumentManagementPage;