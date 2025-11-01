'use client'

import React, { useState, useEffect } from 'react';
import { Post, Platform, PostContent } from '@/types';
import { PLATFORMS, STATUS_CONFIG } from '@/constants';
import { generateImageForPost, generateVideoForPost, improvePrompt } from '@/services/api/geminiService';
import { autoSaveAIMedia } from '@/services/mediaService';
import { Loader2, Video, Image as ImageIcon, Edit, Save, Trash2, Send, CheckCircle, AlertTriangle, ExternalLink, Sparkles, Eye, X, ArrowRightCircle } from 'lucide-react';
import PreviewModal from '@/components/ui/PreviewModal';

interface PostCardProps {
    post: Post;
    onUpdatePost: (post: Post) => void;
    onDeletePost: (postId: string) => void;
    isApiKeyReady: boolean;
    onSelectKey: () => void;
    resetApiKeyStatus: () => void;
    connectedAccounts: Record<Platform, boolean>;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdatePost, onDeletePost, isApiKeyReady, onSelectKey, resetApiKeyStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState<PostContent>(post.content);
    const [activePlatform, setActivePlatform] = useState<Platform>(post.platforms[0]);
    const [isImproving, setIsImproving] = useState<{ image: boolean; video: boolean }>({ image: false, video: false });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        if (!isEditing) {
            setEditedContent(post.content);
        }
    }, [post.content, isEditing]);

    const handleContentChange = (platform: Platform, value: string) => {
        setEditedContent(prev => ({ ...prev, [platform]: value }));
    };

    const handleSuggestionChange = (type: 'imageSuggestion' | 'videoSuggestion', value: string) => {
        setEditedContent(prev => ({ ...prev, [type]: value }));
    }

    const handleSave = () => {
        onUpdatePost({ ...post, content: editedContent });
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        setEditedContent(post.content);
    };

    const handleStatusChange = (newStatus: Post['status']) => {
        const updates: Partial<Post> = { status: newStatus };
        onUpdatePost({ ...post, ...updates });
    };

    const handleImproveSuggestion = async (type: 'image' | 'video') => {
        const suggestionKey = type === 'image' ? 'imageSuggestion' : 'videoSuggestion';
        const currentSuggestion = editedContent[suggestionKey];
        if (!currentSuggestion) return;

        setIsImproving(prev => ({...prev, [type]: true}));
        try {
            const improved = await improvePrompt(currentSuggestion, type);
            setEditedContent(prev => ({ ...prev, [suggestionKey]: improved }));
        } catch (error) {
            console.error(`Error improving ${type} suggestion:`, error);
        } finally {
            setIsImproving(prev => ({...prev, [type]: false}));
        }
    };

    const handleGenerateImage = async () => {
        if (!editedContent.imageSuggestion) return;
        onUpdatePost({ ...post, isGeneratingImage: true, generatedImage: undefined });
        try {
            const imageUrl = await generateImageForPost(editedContent.imageSuggestion);
            // Auto-save to media library
            await autoSaveAIMedia(imageUrl, 'image', post.topic);
            onUpdatePost({ ...post, generatedImage: imageUrl, isGeneratingImage: false, content: editedContent });
        } catch (error) {
            console.error(error);
            onUpdatePost({ ...post, isGeneratingImage: false });
        }
    };
    
    const handleGenerateVideo = async () => {
        if (!editedContent.videoSuggestion) return;
        try {
            onUpdatePost({ ...post, isGeneratingVideo: true, videoGenerationStatus: 'Starting...', generatedVideoUrl: undefined });
            const operation = await generateVideoForPost(editedContent.videoSuggestion);
            onUpdatePost({ ...post, videoGenerationStatus: 'Processing...', videoOperation: operation, content: editedContent });
        } catch (error) {
            if (error instanceof Error && error.message === 'API_KEY_INVALID') {
                resetApiKeyStatus();
            }
            onUpdatePost({ ...post, isGeneratingVideo: false, videoGenerationStatus: 'Generation failed.' });
        }
    };

    const StatusChip: React.FC<{ status: Post['status'] }> = ({ status }) => {
        const config = STATUS_CONFIG[status];
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full text-white ${config.color}`}>{config.label}</span>;
    };
    
    const PlatformTab: React.FC<{ platform: Platform }> = ({ platform }) => {
        const platformInfo = PLATFORMS.find(p => p.id === platform);
        if (!platformInfo) return null;
        const { icon: Icon } = platformInfo;

        return (
            <button
                onClick={() => setActivePlatform(platform)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-t-lg transition-colors duration-200 border-b-2 ${
                    activePlatform === platform ? 'border-charcoal text-charcoal-dark' : 'border-transparent text-slate hover:text-charcoal-dark'
                }`}
            >
                <Icon className="w-5 h-5" />
            </button>
        );
    };

    const ActionButton: React.FC<{ onClick: () => void, icon: React.ElementType, label: string, className?: string, disabled?: boolean }> = 
    ({ onClick, icon: Icon, label, className, disabled }) => (
        <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center text-xs font-bold py-2 px-3 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
            <Icon className={`w-4 h-4 ${label ? 'mr-1.5' : ''} ${disabled && (label.includes('Generating') || label.includes('Improving') || label.includes('Processing')) ? 'animate-spin' : ''}`} />
            {label && <span>{label}</span>}
        </button>
    );

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg flex flex-col overflow-hidden border border-slate/30">
                <div className="p-4 bg-light-gray">
                    <div className="flex justify-between items-start">
                        <p className="font-bold text-lg text-charcoal-dark pr-2 break-words flex-1">
                            {post.topic}
                        </p>
                        <StatusChip status={post.status} />
                    </div>
                    <p className="text-xs text-slate mt-1">
                        {`Created: ${new Date(post.createdAt).toLocaleString()}`}
                    </p>
                </div>
                <div className="flex-grow p-4 space-y-4">
                    <div className="flex border-b border-slate/30">
                        {post.platforms.map(p => <PlatformTab key={p} platform={p} />)}
                    </div>
                    <div className="bg-slate/10 p-3 rounded-lg">
                        <textarea
                            readOnly={!isEditing}
                            value={editedContent[activePlatform] || ''}
                            onChange={(e) => handleContentChange(activePlatform, e.target.value)}
                            className={`w-full h-28 bg-transparent text-charcoal resize-none focus:outline-none text-sm ${isEditing ? 'focus:ring-2 focus:ring-charcoal rounded' : ''}`}
                        />
                    </div>
                    {isEditing ? (
                        <>
                            {/* EDITING VIEW FOR MEDIA */}
                            {post.content.imageSuggestion && (
                                <div className="p-3 bg-slate/10 rounded-lg space-y-3">
                                    <label className="text-sm font-semibold text-charcoal">Image Prompt</label>
                                    <textarea
                                        value={editedContent.imageSuggestion || ''}
                                        onChange={(e) => handleSuggestionChange('imageSuggestion', e.target.value)}
                                        className="w-full h-24 bg-white p-2 rounded-md text-sm text-charcoal resize-none focus:outline-none focus:ring-2 focus:ring-charcoal border border-slate/30"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <ActionButton onClick={() => handleImproveSuggestion('image')} disabled={isImproving.image} icon={isImproving.image ? Loader2 : Sparkles} label={isImproving.image ? 'Improving...' : 'Improve'} className="w-full bg-amber-500 hover:bg-amber-600 text-black" />
                                        <ActionButton onClick={handleGenerateImage} disabled={post.isGeneratingImage} icon={post.isGeneratingImage ? Loader2 : ImageIcon} label={post.isGeneratingImage ? 'Generating...' : 'Regenerate'} className="w-full text-white bg-teal-600 hover:bg-teal-700" />
                                    </div>
                                    {post.generatedImage && <img src={post.generatedImage} alt="Generated" className="rounded-md w-full mt-2" />}
                                </div>
                            )}
                            {post.content.videoSuggestion && (
                                <div className="p-3 bg-slate/10 rounded-lg space-y-3">
                                    <label className="text-sm font-semibold text-charcoal">Video Prompt</label>
                                    <textarea
                                        value={editedContent.videoSuggestion || ''}
                                        onChange={(e) => handleSuggestionChange('videoSuggestion', e.target.value)}
                                        className="w-full h-24 bg-white p-2 rounded-md text-sm text-charcoal resize-none focus:outline-none focus:ring-2 focus:ring-charcoal border border-slate/30"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <ActionButton onClick={() => handleImproveSuggestion('video')} disabled={isImproving.video} icon={isImproving.video ? Loader2 : Sparkles} label={isImproving.video ? 'Improving...' : 'Improve'} className="w-full bg-amber-500 hover:bg-amber-600 text-black" />
                                        {!isApiKeyReady && !post.generatedVideoUrl ? (
                                            <button onClick={onSelectKey} className="flex items-center justify-center gap-2 p-2 bg-yellow-900/50 rounded text-xs text-yellow-200 underline hover:text-white">
                                                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0"/>
                                                <span>Select key to generate</span>
                                            </button>
                                        ) : (
                                            <ActionButton onClick={handleGenerateVideo} disabled={post.isGeneratingVideo} icon={post.isGeneratingVideo ? Loader2 : Video} label={post.isGeneratingVideo ? post.videoGenerationStatus.split(' ')[0] : 'Regenerate'} className="w-full text-white bg-purple-600 hover:bg-purple-700" />
                                        )}
                                    </div>
                                    {post.generatedVideoUrl && <video src={post.generatedVideoUrl} controls className="rounded-md w-full mt-2" />}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* VIEWING VIEW FOR MEDIA */}
                            {post.content.imageSuggestion && (
                                <div className="p-3 bg-slate/10 rounded-lg space-y-2">
                                    <p className="text-xs text-slate italic">"{post.content.imageSuggestion}"</p>
                                    {post.generatedImage ? (
                                        <img src={post.generatedImage} alt="Generated" className="rounded-md w-full" />
                                    ) : (
                                        <ActionButton
                                            onClick={handleGenerateImage}
                                            disabled={post.isGeneratingImage}
                                            icon={post.isGeneratingImage ? Loader2 : ImageIcon}
                                            label={post.isGeneratingImage ? 'Generating...' : 'Generate Image'}
                                            className="w-full text-white bg-teal-600 hover:bg-teal-700"
                                        />
                                    )}
                                </div>
                            )}
                            {post.content.videoSuggestion && (
                                <div className="p-3 bg-slate/10 rounded-lg space-y-2">
                                    <p className="text-xs text-slate italic">"{post.content.videoSuggestion}"</p>
                                    {post.generatedVideoUrl ? (
                                        <div className="relative">
                                            <video src={post.generatedVideoUrl} controls className="rounded-md w-full" />
                                            <a href={post.generatedVideoUrl} download={`video_${post.id}.mp4`} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/80">
                                                <ExternalLink className="w-4 h-4"/>
                                            </a>
                                        </div>
                                    ) : (
                                        !isApiKeyReady ? (
                                            <button onClick={onSelectKey} className="flex items-center justify-center gap-2 w-full p-2 bg-yellow-900/50 rounded text-xs text-yellow-200 underline hover:text-white">
                                                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0"/>
                                                <span>Select key to generate</span>
                                            </button>
                                        ) : (
                                            <ActionButton
                                                onClick={handleGenerateVideo}
                                                disabled={post.isGeneratingVideo}
                                                icon={post.isGeneratingVideo ? Loader2 : Video}
                                                label={post.isGeneratingVideo ? post.videoGenerationStatus.split(' ')[0] : 'Generate Video'}
                                                className="w-full text-white bg-purple-600 hover:bg-purple-700"
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="p-3 bg-light-gray flex flex-wrap gap-2 justify-between items-center">
                    {isEditing ? (
                         <div className="flex items-center justify-between w-full">
                            <div className="flex gap-2">
                                <ActionButton onClick={handleSave} icon={Save} label="Save" className="bg-green-600 hover:bg-green-700 text-white" />
                                <ActionButton onClick={handleCancel} icon={X} label="Cancel" className="bg-slate hover:bg-slate/80 text-white" />
                                <ActionButton onClick={() => setIsPreviewOpen(true)} icon={Eye} label="Preview" className="bg-blue-600 hover:bg-blue-700 text-white" />
                            </div>
                            <ActionButton onClick={() => onDeletePost(post.id)} icon={Trash2} label="" className="bg-red-600 hover:bg-red-700 text-white" />
                        </div>
                    ) : (
                         <div className="flex items-center justify-between w-full">
                            <div className="flex gap-2 flex-wrap">
                                <ActionButton onClick={() => setIsEditing(true)} icon={Edit} label="Edit" className="bg-slate hover:bg-slate/80 text-white" />
                                <ActionButton onClick={() => setIsPreviewOpen(true)} icon={Eye} label="Preview" className="bg-blue-600 hover:bg-blue-700 text-white" />
                                {post.status === 'draft' && <ActionButton onClick={() => handleStatusChange('needs approval')} icon={Send} label="Request Approval" className="bg-yellow-500 hover:bg-yellow-600 text-black" />}
                                {post.status === 'needs approval' && <ActionButton onClick={() => handleStatusChange('approved')} icon={CheckCircle} label="Approve" className="bg-cyan-500 hover:bg-cyan-600 text-white" />}
                                {post.status === 'approved' && (
                                    <ActionButton onClick={() => handleStatusChange('ready to publish')} icon={ArrowRightCircle} label="Finalize & Move" className="bg-charcoal hover:bg-charcoal-dark text-white" />
                                )}
                            </div>
                            <ActionButton onClick={() => onDeletePost(post.id)} icon={Trash2} label="" className="bg-red-600 hover:bg-red-700 text-white" />
                        </div>
                    )}
                </div>
            </div>
            {isPreviewOpen && (
                <PreviewModal 
                    post={{ ...post, content: editedContent }} 
                    onClose={() => setIsPreviewOpen(false)} 
                />
            )}
        </>
    );
};

export default PostCard;