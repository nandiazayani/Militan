import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { DataContext } from '../contexts/DataContext';
import { UserContext } from '../contexts/UserContext';
import { Project, Document, User, Page } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface SmartSearchResult {
    projects: Project[];
    documents: Document[];
    users: User[];
}

interface SmartSearchProps {
    onSelectProject: (projectId: string) => void;
    onSelectUser: (userId: string) => void;
    setCurrentPage: (page: Page) => void;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ onSelectProject, onSelectUser, setCurrentPage }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SmartSearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    
    const dataContext = useContext(DataContext);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce search input
    useEffect(() => {
        if (query.trim().length < 3) {
            setResults(null);
            setIsResultsOpen(false);
            return;
        }

        const handler = setTimeout(() => {
            performSearch(query);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    // Close results dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsResultsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const performSearch = useCallback(async (searchQuery: string) => {
        if (!dataContext) return;
        setIsLoading(true);
        setError(null);
        setIsResultsOpen(true);
        setResults(null);

        const { allProjects, allDocuments, allUsers } = dataContext;

        const dataToSearch = {
            projects: allProjects.map(p => ({ id: p.id, name: p.name, pic: p.pic.name, status: p.status })),
            documents: allDocuments.map(d => ({ id: d.id, name: d.name, description: d.description, category: d.category, tags: d.tags })),
            users: allUsers.map(u => ({ id: u.id, name: u.name, role: u.role, department: u.department })),
        };
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
Anda adalah asisten pencarian cerdas untuk dashboard internal. Berdasarkan kueri pengguna dan data JSON yang diberikan, temukan item yang paling relevan.
Kueri Pengguna: "${searchQuery}"

DATA UNTUK DICARI:
${JSON.stringify(dataToSearch, null, 2)}

Cari di dalam proyek, dokumen, dan pengguna. Kembalikan HANYA objek JSON yang berisi ID dari item-item yang cocok.
`;
            
            const responseSchema = {
              type: Type.OBJECT,
              properties: {
                projects: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Daftar ID proyek yang relevan'
                },
                documents: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Daftar ID dokumen yang relevan'
                },
                users: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Daftar ID pengguna yang relevan'
                }
              },
              required: ["projects", "documents", "users"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema,
                }
            });

            const resultIds = JSON.parse(response.text) as { projects: string[], documents: string[], users: string[] };

            setResults({
                projects: resultIds.projects.map(id => allProjects.find(p => p.id === id)).filter((p): p is Project => !!p),
                documents: resultIds.documents.map(id => allDocuments.find(d => d.id === id)).filter((d): d is Document => !!d),
                users: resultIds.users.map(id => allUsers.find(u => u.id === id)).filter((u): u is User => !!u)
            });

        } catch (err) {
            console.error("Smart search error:", err);
            setError("Gagal melakukan pencarian AI. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    }, [dataContext]);

    const handleResultClick = (action: () => void) => {
        action();
        setQuery('');
        setResults(null);
        setIsResultsOpen(false);
    };

    return (
        <div className="relative w-full max-w-xs" ref={searchRef}>
            <input
                type="text"
                placeholder="Pencarian Cerdas..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim().length >= 3 && setIsResultsOpen(true)}
                className="w-full px-4 py-2 pr-10 text-sm bg-gray-700 text-gray-200 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <SearchIcon className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
            
            {isResultsOpen && (
                <div className="absolute mt-2 w-full bg-surface rounded-lg shadow-xl z-50 overflow-hidden border border-gray-700">
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading && <div className="p-4 text-center text-sm text-gray-500">Mencari...</div>}
                        {error && <div className="p-4 text-center text-sm text-red-500">{error}</div>}
                        {results && (
                            (results.projects.length + results.documents.length + results.users.length > 0) ? (
                                <>
                                    {/* FIX: Property 'name' does not exist on type '{ id: string; }'. */}
                                    {results.projects.length > 0 && <ResultGroup title="Proyek" items={results.projects} onClick={p => handleResultClick(() => onSelectProject(p.id))} render={p => p.name} />}
                                    {/* FIX: Property 'name' does not exist on type '{ id: string; }'. */}
                                    {results.documents.length > 0 && <ResultGroup title="Dokumen" items={results.documents} onClick={d => handleResultClick(() => setCurrentPage('documents'))} render={d => d.name} />}
                                    {/* FIX: Property 'name' does not exist on type '{ id: string; }'. */}
                                    {results.users.length > 0 && <ResultGroup title="Pengguna" items={results.users} onClick={u => handleResultClick(() => onSelectUser(u.id))} render={u => u.name} />}
                                </>
                            ) : (
                                !isLoading && <div className="p-4 text-center text-sm text-gray-500">Tidak ada hasil ditemukan.</div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const ResultGroup = <T extends { id: string; name: string }>({ title, items, onClick, render }: { title: string; items: T[]; onClick: (item: T) => void; render: (item: T) => string }) => (
    <div>
        <h4 className="px-4 py-2 text-xs font-bold text-gray-400 bg-gray-700/50 uppercase">{title}</h4>
        <ul>
            {items.map(item => (
                <li key={item.id} onClick={() => onClick(item)} className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer">
                    {render(item)}
                </li>
            ))}
        </ul>
    </div>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;

export default SmartSearch;