'use client'

import React, { useState } from 'react';
import { Post, Platform } from '@/types';
import { PLATFORMS, STATUS_CONFIG } from '@/constants';
import { publishPost } from '@/services/publishingService';
import { Link as LinkIcon, Globe, Send, Clock, X, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

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
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);
    const [publishSuccess, setPublishSuccess] = useState(false);

    const handlePublish = async () => {
        setIsPublishing(true);
        setPublishError(null);
        setPublishSuccess(false);
        
        try {
            // Actually publish to social media platforms!
            const results = await publishPost(post);
            
            // Check for failures
            const failures = results.filter(r => !r.success);
            
            if (failures.length === 0) {
                // All platforms succeeded
                const updates: Partial<Post> = { 
                    status: 'published', 
                    publishedAt: new Date().toISOString() 
                };
                onUpdatePost({ ...post, ...updates });
                setPublishSuccess(true);
                
                // Auto-hide success message after 3 seconds
                setTimeout(() => setPublishSuccess(false), 3000);
            } else {
                // Some platforms failed
                const failedPlatforms = failures.map(f => f.platform).join(', ');
                const errorMessages = failures.map(f => f.error).join('; ');
                setPublishError(`Failed to publish to ${failedPlatforms}: ${errorMessages}`);
            }
        } catch (error) {
            console.error('Publishing error:', error);
            setPublishError(error instanceof Error ? error.message : 'An unexpected error occurred while publishing');
        } finally {
            setIsPublishing(false);
        }
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
            status: 'ready_to_publish',
            scheduledAt: undefined
        };
        onUpdatePost({ ...post, ...updates });
    };

    const unconnectedPlatforms = post.platforms.filter(p => !connectedAccounts[p]);
    const canPublish = unconnectedPlatforms.length === 0;

    const StatusChip: React.FC<{ status: Post['status'] }> = ({ status }) => {
        const config = STATUS_CONFIG[status];
        const statusColors: Record<Post['status'], string> = {
            'draft': 'bg-gray-100 text-gray-800 border-gray-200',
            'needs_approval': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'approved': 'bg-purple-100 text-purple-800 border-purple-200',
            'ready_to_publish': 'bg-cyan-100 text-cyan-800 border-cyan-200',
            'scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
            'published': 'bg-green-100 text-green-800 border-green-200',
            'failed': 'bg-red-100 text-red-800 border-red-200'
        };
        const colorClass = statusColors[status];
        return <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colorClass}`}>{config.label}</span>;
    };

    const ActionButton: React.FC<{ onClick: () => void, icon: React.ElementType, label: string, className?: string, disabled?: boolean }> = 
    ({ onClick, icon: Icon, label, className, disabled }) => (
        <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center text-base font-bold py-2 px-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 hover:shadow-lg ${className}`}>
            <Icon className={`w-4 h-4 ${label ? 'mr-1.5' : ''} ${Icon === Loader2 ? 'animate-spin' : ''}`} />
            {label && <span className="whitespace-nowrap">{label}</span>}
        </button>
    );

    const ScheduleModal = () => (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsScheduleModalOpen(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Schedule Post</h2>
                    <button onClick={() => setIsScheduleModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </header>
                <div className="p-6 space-y-4">
                     <p className="text-gray-700">Select a date and time to schedule this post for.</p>
                     <input
                        type="datetime-local"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 p-3"
                        min={new Date().toISOString().slice(0, 16)}
                    />
                    <button
                        onClick={handleSchedule}
                        disabled={!scheduleDate}
                        className="w-full inline-flex justify-center items-center py-3 px-4 shadow-md text-base font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
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
        const rawContent = post.content[platform] || '';
        const content = typeof rawContent === 'string'
          ? rawContent
          : typeof rawContent === 'object'
          ? (rawContent as any)?.description || ''
          : '';

        return (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0">AI</div>
                    <div className="ml-2">
                        <p className="font-semibold text-gray-900 text-sm">{platformInfo.name}</p>
                        <p className="text-xs text-gray-600">AI Content OS</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 min-h-[120px]">
                    <p className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap">{content}</p>
                </div>
                {post.generatedImage && <img src={post.generatedImage} alt="Generated content" className="rounded-lg w-full border border-gray-300 mb-4" />}
                {post.generatedVideoUrl && <video src={post.generatedVideoUrl} controls className="rounded-lg w-full border border-gray-300" />}
            </div>
        );
    };

    const PlatformSwitcher = () => (
        <div className="flex items-center gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
            {post.platforms.map(p => {
                const platformInfo = PLATFORMS.find(info => info.id === p);
                if (!platformInfo) return null;
                const { icon: Icon } = platformInfo;
                return (
                    <button
                        key={p}
                        onClick={() => setActivePlatform(p)}
                        title={`Preview on ${platformInfo.name}`}
                        className={`flex-1 flex justify-center items-center p-2 rounded-md transition-all ${ activePlatform === p ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200' }`}
                    > <Icon className="w-5 h-5" /> </button>
                );
            })}
        </div>
    );

    const renderActions = () => {
        switch (post.status) {
            case 'ready_to_publish':
                return (
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex gap-1.5 flex-wrap">
                                <ActionButton onClick={() => setIsScheduleModalOpen(true)} icon={Clock} label="Schedule" className="text-white bg-purple-600 hover:bg-purple-700 shadow-md min-w-[110px]" />
                                <ActionButton 
                                    onClick={handlePublish} 
                                    disabled={!canPublish || isPublishing} 
                                    icon={isPublishing ? Loader2 : Send} 
                                    label={isPublishing ? 'Publishing...' : 'Publish Now'} 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md min-w-[130px]" 
                                />
                            </div>
                            <ActionButton onClick={() => onDeletePost(post.id)} icon={Trash2} label="" className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 shadow-md" />
                        </div>
                        {!canPublish && (
                            <div className="text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 flex-shrink-0" />
                                <span>Connect {unconnectedPlatforms.map(p => PLATFORMS.find(info => info.id === p)?.name).join(', ')} account(s) to publish.</span>
                            </div>
                        )}
                        {publishError && (
                            <div className="text-sm text-red-800 bg-red-50 border border-red-200 p-3 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{publishError}</span>
                            </div>
                        )}
                        {publishSuccess && (
                            <div className="text-sm text-green-800 bg-green-50 border border-green-200 p-3 rounded-lg flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                <span>Successfully published to all platforms! 🎉</span>
                            </div>
                        )}
                    </div>
                );
            case 'scheduled':
                return (
                     <div className="flex items-center justify-between w-full text-sm">
                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                           <Clock className="w-4 h-4"/>
                           <span className="font-medium">{new Date(post.scheduledAt!).toLocaleString()}</span>
                        </div>
                        <button onClick={handleUnschedule} className="text-sm text-gray-700 hover:text-gray-900 hover:underline">Unschedule</button>
                    </div>
                );
            case 'published':
                return (
                    <div className="flex items-center justify-between w-full text-sm">
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                           <Globe className="w-4 h-4"/>
                           <span className="font-medium">{new Date(post.publishedAt!).toLocaleString()}</span>
                        </div>
                        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline">View Live Post</a>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <>
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg flex flex-col overflow-hidden border border-gray-200 transition-all">
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex justify-between items-start gap-3">
                    <h3 className="font-semibold text-base text-gray-900 break-words flex-1">{post.topic}</h3>
                    <StatusChip status={post.status} />
                </div>
            </div>
            <div className="flex-grow p-4">
                <PlatformSwitcher />
                <PlatformPreview platform={activePlatform} />
            </div>
            <div className="p-4 bg-gray-50 flex flex-wrap gap-2 justify-between items-center border-t border-gray-200">
                {renderActions()}
            </div>
        </div>
        {isScheduleModalOpen && <ScheduleModal />}
        </>
    );
};

export default PublishedCard;