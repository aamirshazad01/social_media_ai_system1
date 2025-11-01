'use client'

import React, { useState } from 'react';
import { Post, Platform } from '@/types';
import { PLATFORMS, STATUS_CONFIG } from '@/constants';
import { Link as LinkIcon, Globe, Send, Clock, X, Trash2 } from 'lucide-react';

interface PublishedCardProps {
    post: Post;
    onUpdatePost: (post: Post) => void;
    onDeletePost: (postId: string) => void;
    connectedAccounts: Record<Platform, boolean>;
}

const PublishedCard: React.FC<PublishedCardProps> = ({ post, onUpdatePost, onDeletePost, connectedAccounts }) => {
    const [activePlatform, setActivePlatform] = useState<Platform>(post.platforms[0]);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');

    const handlePublish = () => {
        const updates: Partial<Post> = { status: 'published', publishedAt: new Date().toISOString() };
        onUpdatePost({ ...post, ...updates });
    };
    
    const handleSchedule = () => {
        if (!scheduleDate) return;
        const updates: Partial<Post> = { 
            status: 'scheduled', 
            scheduledAt: new Date(scheduleDate).toISOString() 
        };
        onUpdatePost({ ...post, ...updates });
        setIsScheduleModalOpen(false);
        setScheduleDate('');
    };

    const handleUnschedule = () => {
        const updates: Partial<Post> = { 
            status: 'ready to publish', 
            scheduledAt: undefined 
        };
        onUpdatePost({ ...post, ...updates });
    };

    const unconnectedPlatforms = post.platforms.filter(p => !connectedAccounts[p]);
    const canPublish = unconnectedPlatforms.length === 0;

    const StatusChip: React.FC<{ status: Post['status'] }> = ({ status }) => {
        const config = STATUS_CONFIG[status];
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full text-white ${config.color}`}>{config.label}</span>;
    };

    const ActionButton: React.FC<{ onClick: () => void, icon: React.ElementType, label: string, className?: string, disabled?: boolean }> = 
    ({ onClick, icon: Icon, label, className, disabled }) => (
        <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center text-xs font-bold py-2 px-3 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
            <Icon className="w-4 h-4 mr-1.5" />
            <span>{label}</span>
        </button>
    );

    const ScheduleModal = () => (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsScheduleModalOpen(false)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col border border-slate/30" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-slate/30">
                    <h2 className="text-xl font-bold text-charcoal-dark">Schedule Post</h2>
                    <button onClick={() => setIsScheduleModalOpen(false)} className="p-2 rounded-full text-slate hover:bg-slate/10 hover:text-charcoal-dark transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6 space-y-4">
                     <p className="text-charcoal">Select a date and time to schedule this post for.</p>
                     <input
                        type="datetime-local"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="mt-1 block w-full bg-white border-slate/30 rounded-md shadow-sm focus:ring-charcoal focus:border-charcoal text-charcoal p-3"
                        min={new Date().toISOString().slice(0, 16)}
                    />
                    <button
                        onClick={handleSchedule}
                        disabled={!scheduleDate}
                        className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-charcoal hover:bg-charcoal-dark disabled:bg-slate disabled:cursor-not-allowed"
                    >
                       Confirm Schedule
                    </button>
                </div>
            </div>
        </div>
    );

    const PlatformPreview: React.FC<{ platform: Platform }> = ({ platform }) => {
        const platformInfo = PLATFORMS.find(p => p.id === platform);
        if (!platformInfo) return null;
        const content = post.content[platform] || '';

        return (
            <div className="bg-slate/10 rounded-lg p-4">
                <div className="flex items-center mb-4">
                    <div className="w-11 h-11 bg-charcoal rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">AI</div>
                    <div className="ml-3">
                        <p className="font-semibold text-charcoal-dark leading-tight">AI Content OS</p>
                        <p className="flex items-center text-xs text-slate">Preview for {platformInfo.name}</p>
                    </div>
                </div>
                <p className="text-charcoal text-sm mb-4 whitespace-pre-wrap h-24 overflow-y-auto">{content}</p>
                {post.generatedImage && <img src={post.generatedImage} alt="Generated content" className="rounded-lg w-full border border-slate/30 mb-4" />}
                {post.generatedVideoUrl && <video src={post.generatedVideoUrl} controls className="rounded-lg w-full border border-slate/30" />}
            </div>
        );
    };

    const PlatformSwitcher = () => (
        <div className="flex items-center gap-1 mb-4 p-1 bg-light-gray rounded-lg">
            {post.platforms.map(p => {
                const platformInfo = PLATFORMS.find(info => info.id === p);
                if (!platformInfo) return null;
                const { icon: Icon } = platformInfo;
                return (
                    <button
                        key={p}
                        onClick={() => setActivePlatform(p)}
                        title={`Preview on ${platformInfo.name}`}
                        className={`flex-1 flex justify-center items-center p-2 rounded-md transition-all duration-200 ${ activePlatform === p ? 'bg-charcoal text-white' : 'text-slate hover:bg-slate/10 hover:text-charcoal-dark' }`}
                    > <Icon className="w-5 h-5" /> </button>
                );
            })}
        </div>
    );

    const renderActions = () => {
        switch (post.status) {
            case 'ready to publish':
                return (
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex gap-2 flex-wrap">
                                <ActionButton onClick={() => setIsScheduleModalOpen(true)} icon={Clock} label="Schedule" className="text-white bg-purple-600 hover:bg-purple-700" />
                                <ActionButton onClick={handlePublish} disabled={!canPublish} icon={Send} label="Publish Now" className="bg-charcoal hover:bg-charcoal-dark text-white" />
                            </div>
                            <ActionButton onClick={() => onDeletePost(post.id)} icon={Trash2} label="" className="bg-red-600 hover:bg-red-700 text-white" />
                        </div>
                        {!canPublish && (
                            <div className="text-xs text-yellow-300 bg-yellow-900/50 p-2 rounded flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 flex-shrink-0" />
                                <span>Connect {unconnectedPlatforms.map(p => PLATFORMS.find(info => info.id === p)?.name).join(', ')} account(s) to publish.</span>
                            </div>
                        )}
                    </div>
                );
            case 'scheduled':
                return (
                     <div className="flex items-center justify-between w-full text-sm">
                        <div className="flex items-center gap-2 text-blue-300">
                           <Clock className="w-4 h-4"/>
                           <span>{new Date(post.scheduledAt!).toLocaleString()}</span>
                        </div>
                        <button onClick={handleUnschedule} className="text-xs text-slate hover:text-charcoal-dark hover:underline">Unschedule</button>
                    </div>
                );
            case 'published':
                return (
                    <div className="flex items-center justify-between w-full text-sm">
                        <div className="flex items-center gap-2 text-green-300">
                           <Globe className="w-4 h-4"/>
                           <span>{new Date(post.publishedAt!).toLocaleString()}</span>
                        </div>
                        <a href="#" className="text-xs text-charcoal-dark hover:underline">View Live Post</a>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <>
        <div className="bg-white rounded-lg shadow-lg flex flex-col overflow-hidden border border-slate/30">
            <div className="p-4 bg-light-gray">
                <div className="flex justify-between items-start">
                    <p className="font-bold text-lg text-charcoal-dark pr-2 break-words flex-1 truncate">{post.topic}</p>
                    <StatusChip status={post.status} />
                </div>
            </div>
            <div className="flex-grow p-4 pt-2">
                <PlatformSwitcher />
                <PlatformPreview platform={activePlatform} />
            </div>
            <div className="p-3 bg-light-gray flex flex-wrap gap-2 justify-between items-center">
                {renderActions()}
            </div>
        </div>
        {isScheduleModalOpen && <ScheduleModal />}
        </>
    );
};

export default PublishedCard;