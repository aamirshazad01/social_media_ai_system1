'use client'

import React, { useState, useEffect } from 'react';
import { Post, Platform } from '@/types';
import { PLATFORMS } from '@/constants';
import { X, ThumbsUp, MessageCircle, Repeat, Send, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

interface PreviewModalProps {
    post: Post;
    onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ post, onClose }) => {
    const [activePlatform, setActivePlatform] = useState<Platform>(post.platforms[0] ?? 'twitter');

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const PlatformPreview: React.FC<{ platform: Platform }> = ({ platform }) => {
        const platformInfo = PLATFORMS.find(p => p.id === platform);
        if (!platformInfo) return null;

        const content = post.content?.[platform] || '';
        const hasGeneratedMedia = post.generatedImage || post.generatedVideoUrl;

        return (
            <div className="bg-light-gray rounded-lg p-4 w-full max-w-lg mx-auto border border-slate/30">
                <div className="flex items-center mb-4">
                     <div className="w-11 h-11 bg-charcoal rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        AI
                    </div>
                    <div className="ml-3">
                        <p className="font-semibold text-charcoal-dark leading-tight">AI Content OS (Preview)</p>
                        <p className="text-xs text-slate">Posting to {platformInfo.name}</p>
                    </div>
                </div>

                <p className="text-charcoal text-sm mb-4 whitespace-pre-wrap">{content}</p>

                {post.generatedImage ? (
                    <img src={post.generatedImage} alt="Generated content" className="rounded-lg w-full border border-slate/30 mb-4" />
                ) : post.generatedVideoUrl ? (
                    <video src={post.generatedVideoUrl} controls className="rounded-lg w-full border border-slate/30 mb-4" />
                ) : post.content?.imageSuggestion ? (
                    <div className="bg-white rounded-lg w-full aspect-video flex flex-col items-center justify-center text-slate p-4 mb-4 border border-slate/30">
                         <ImageIcon className="w-12 h-12 mb-2" />
                         <p className="text-center text-xs italic">Image will be generated for: "{post.content.imageSuggestion}"</p>
                    </div>
                ) : post.content?.videoSuggestion && (
                    <div className="bg-white rounded-lg w-full aspect-video flex flex-col items-center justify-center text-slate p-4 mb-4 border border-slate/30">
                         <VideoIcon className="w-12 h-12 mb-2" />
                         <p className="text-center text-xs italic">Video will be generated for: "{post.content.videoSuggestion}"</p>
                    </div>
                )}

                 <div className="pt-3 border-t border-slate/30 flex justify-around text-slate">
                    <div className="flex items-center space-x-2 p-2 rounded-md"><ThumbsUp className="w-5 h-5" /><span className="text-sm font-medium">Like</span></div>
                    <div className="flex items-center space-x-2 p-2 rounded-md"><MessageCircle className="w-5 h-5" /><span className="text-sm font-medium">Comment</span></div>
                    <div className="flex items-center space-x-2 p-2 rounded-md"><Repeat className="w-5 h-5" /><span className="text-sm font-medium">Repost</span></div>
                    <div className="flex items-center space-x-2 p-2 rounded-md"><Send className="w-5 h-5" /><span className="text-sm font-medium">Send</span></div>
                </div>
            </div>
        );
    };

    const PlatformTabs: React.FC = () => (
        <div className="flex items-center border-b border-slate/30 mb-4">
            {post.platforms.map(p => {
                const platformInfo = PLATFORMS.find(info => info.id === p);
                if (!platformInfo) return null;
                const { icon: Icon, name } = platformInfo;
                return (
                    <button
                        key={p}
                        onClick={() => setActivePlatform(p)}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                            activePlatform === p ? 'border-charcoal text-charcoal-dark' : 'border-transparent text-slate hover:text-charcoal-dark'
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span>{name}</span>
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate/30" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-slate/30 flex-shrink-0">
                    <h2 className="text-xl font-bold text-charcoal-dark">Post Preview</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-slate hover:bg-slate/10 hover:text-charcoal-dark transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto">
                    <PlatformTabs />
                    <PlatformPreview platform={activePlatform} />
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PreviewModal;
