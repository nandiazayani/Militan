import React, { useState, useRef, useEffect, useContext } from 'react';
import { ProjectComment } from '../../types';
import { UserContext } from '../../contexts/UserContext';

interface CommentCardProps {
    comments: ProjectComment[];
    onAddComment: (content: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comments, onAddComment }) => {
    const [newComment, setNewComment] = useState('');
    const userContext = useContext(UserContext);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [comments]);

    const handleSendComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment('');
        }
    };
    
    const formatTimestamp = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    
    if (!userContext) return null;
    const { user: currentUser } = userContext;

    return (
        <div className="bg-surface rounded-xl shadow-lg p-4 flex flex-col h-96">
            <h3 className="text-lg font-semibold mb-3 text-text-primary flex-shrink-0">Diskusi Tim</h3>
            
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-3">
                {comments.map(comment => (
                    <div key={comment.id} className={`flex items-start gap-2.5 ${comment.user.id === currentUser.id ? 'justify-end' : ''}`}>
                         {comment.user.id !== currentUser.id && (
                            <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-8 h-8 rounded-full" />
                         )}
                        <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-3 border-gray-200 rounded-xl ${comment.user.id === currentUser.id ? 'bg-primary text-black rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'}`}>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-semibold">{comment.user.name}</span>
                                <span className="text-xs font-normal opacity-70">{formatTimestamp(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm font-normal py-2">{comment.content}</p>
                        </div>
                         {comment.user.id === currentUser.id && (
                            <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-8 h-8 rounded-full" />
                         )}
                    </div>
                ))}
                 <div ref={commentsEndRef} />
            </div>

            <div className="flex-shrink-0 mt-auto pt-3 border-t border-gray-700">
                <div className="flex items-center gap-2">
                    <textarea
                        rows={1}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendComment();
                            }
                        }}
                        placeholder="Tulis pesan..."
                        className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-100 text-sm resize-none"
                    />
                    <button
                        onClick={handleSendComment}
                        disabled={!newComment.trim()}
                        className="p-2 bg-primary text-black rounded-lg hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                       <PaperAirplaneIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

const PaperAirplaneIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>;

export default CommentCard;
