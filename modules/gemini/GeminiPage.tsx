
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";

interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

const GeminiPage: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [streamingResponse, setStreamingResponse] = useState<string>('');
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const chatSession = useRef<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom of the chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history, streamingResponse]);

    const initializeChat = () => {
         try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatSession.current = ai.chats.create({
                model: 'gemini-2.5-flash',
            });
        } catch (err) {
            console.error("Failed to initialize Gemini:", err);
            setError("Gagal menginisialisasi sesi Gemini. Pastikan API Key valid.");
        }
    };
    
    // Initialize chat session on mount
    useEffect(() => {
        initializeChat();
    }, []);

    const handleNewChat = () => {
        setIsLoading(true);
        setHistory([]);
        setPrompt('');
        setStreamingResponse('');
        setError(null);
        initializeChat();
        setIsLoading(false);
    };

    const handleGenerate = async () => {
        if (!prompt.trim() || !chatSession.current) {
            setError('Prompt tidak boleh kosong.');
            return;
        }
        setIsLoading(true);
        setError(null);
        
        setHistory(prev => [...prev, { role: 'user', content: prompt }]);

        try {
            const stream = await chatSession.current.sendMessageStream({ message: prompt });
            setPrompt('');
            
            let fullResponse = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                fullResponse += chunkText;
                setStreamingResponse(fullResponse);
            }
            
            setHistory(prev => [...prev, { role: 'model', content: fullResponse }]);

        } catch (err) {
            console.error('Gemini API Error:', err);
            const errorMessage = 'Terjadi kesalahan saat berkomunikasi dengan Gemini API. Silakan coba lagi.';
            setError(errorMessage);
            setHistory(prev => [...prev, { role: 'model', content: `Error: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
            setStreamingResponse('');
        }
    };

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 text-primary rounded-full">
                        <SparklesIcon />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary">Gemini AI Playground</h2>
                        <p className="text-text-secondary">Kirim prompt langsung ke model Gemini.</p>
                    </div>
                </div>
                 <button
                    onClick={handleNewChat}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 bg-secondary text-white rounded-lg hover:bg-gray-500 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <ArrowPathIcon />
                    <span className="text-sm font-medium">Percakapan Baru</span>
                </button>
            </div>
            
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-4 -mr-4 mb-4 space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl px-4 py-2 rounded-xl whitespace-pre-wrap ${
                            msg.role === 'user' 
                                ? 'bg-primary text-black font-semibold' 
                                : 'bg-gray-700 text-text-primary'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && streamingResponse && (
                    <div className="flex justify-start">
                         <div className="max-w-xl px-4 py-2 rounded-xl bg-gray-700 text-text-primary whitespace-pre-wrap">
                            {streamingResponse}
                            <span className="inline-block w-2 h-4 bg-gray-200 animate-pulse ml-1" />
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-3 mb-2 text-sm text-center text-red-300 bg-red-900/30 rounded-lg" role="alert">
                    {error}
                </div>
            )}

            <div className="flex-shrink-0">
                <div className="flex gap-2">
                    <textarea
                        rows={1}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleGenerate();
                            }
                        }}
                        placeholder="Ketik pesan Anda di sini..."
                        className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100 resize-none"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-yellow-500 transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <SpinnerIcon /> : <SendIcon />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Icons
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.696-2.696L11.25 18l1.938-.648a3.375 3.375 0 002.696-2.696L16.25 13l.648 1.938a3.375 3.375 0 002.696 2.696L21.5 18l-1.938.648a3.375 3.375 0 00-2.696 2.696z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>;
const ArrowPathIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-4.991v4.99" /></svg>;


export default GeminiPage;