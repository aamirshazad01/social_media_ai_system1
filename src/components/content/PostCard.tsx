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
    const [editedContent, setEditedContent] = useState<PostContent>(post.content ?? ({} as PostContent));
    const [activePlatform, setActivePlatform] = useState<Platform>(post.platforms[0] ?? 'twitter');
    const [isImproving, setIsImproving] = useState<{ image: boolean; video: boolean }>({ image: false, video: false });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [improveModalOpen, setImproveModalOpen] = useState<'image' | 'video' | null>(null);
    const [improvePromptInput, setImprovePromptInput] = useState('');

    useEffect(() => {
        if (!isEditing) {
            setEditedContent(post.content ?? ({} as PostContent));
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

    const handleOpenImproveModal = (type: 'image' | 'video') => {
        setImproveModalOpen(type);
        setImprovePromptInput('');
    };

    const handleImproveSuggestion = async () => {
        if (!improveModalOpen) return;
        const type = improveModalOpen;
        const suggestionKey = type === 'image' ? 'imageSuggestion' : 'videoSuggestion';
        const currentSuggestion = editedContent[suggestionKey];
        if (!currentSuggestion) return;

        setIsImproving(prev => ({...prev, [type]: true}));
        setImproveModalOpen(null);
        try {
            const improved = await improvePrompt(currentSuggestion, type, improvePromptInput);
            setEditedContent(prev => ({ ...prev, [suggestionKey]: improved }));
        } catch (error) {
            console.error(`Error improving ${type} suggestion:`, error);
        } finally {
            setIsImproving(prev => ({...prev, [type]: false}));
            setImprovePromptInput('');
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
        <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center text-xs font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${className}`}>
            <Icon className={`w-4 h-4 ${label ? 'mr-2' : ''} ${disabled && (label.includes('Generating') || label.includes('Improving') || label.includes('Processing')) ? 'animate-spin' : ''}`} />
            {label && <span>{label}</span>}
        </button>
    );

    const ImproveModal = () => {
        if (!improveModalOpen) return null;
        const type = improveModalOpen;
        const typeLabel = type === 'image' ? 'Picture' : 'Video';

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setImproveModalOpen(null)}>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col border border-slate/30" onClick={e => e.stopPropagation()}>
                    <header className="flex justify-between items-center p-6 border-b border-slate/30">
                        <div>
                            <h2 className="text-xl font-bold text-charcoal-dark">Improve {typeLabel} Script</h2>
                            <p className="text-sm text-slate mt-1">Provide guidance to enhance the script</p>
                        </div>
                        <button onClick={() => setImproveModalOpen(null)} className="p-2 rounded-full text-slate hover:bg-slate/10 hover:text-charcoal-dark transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </header>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-charcoal mb-2">
                                What would you like to improve? (Optional)
                            </label>
                            <textarea
                                value={improvePromptInput}
                                onChange={(e) => setImprovePromptInput(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                                placeholder={`e.g., "Make it more cinematic", "Add more details about lighting", "Focus on emotional impact"...`}
                                className="w-full h-32 px-4 py-3 bg-white border border-slate/30 rounded-lg text-charcoal focus:ring-2 focus:ring-charcoal focus:border-transparent resize-none text-sm leading-relaxed"
                                autoFocus
                            />
                            <p className="text-xs text-slate mt-2">
                                Leave empty to use AI's default improvement suggestions
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleImproveSuggestion}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                            >
                                <Sparkles className="w-4 h-4" />
                                Improve Script
                            </button>
                            <button
                                onClick={() => setImproveModalOpen(null)}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-charcoal font-semibold rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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
                    {/* Content Section */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Edit className="w-4 h-4 text-charcoal" />
                            <p className="text-xs font-semibold text-charcoal uppercase tracking-wide">Content</p>
                        </div>
                        <div className="bg-slate/5 border border-slate/20 p-4 rounded-lg">
                            <textarea
                                readOnly={!isEditing}
                                value={typeof editedContent?.[activePlatform] === 'string'
                                  ? editedContent[activePlatform]
                                  : typeof editedContent?.[activePlatform] === 'object'
                                  ? (editedContent[activePlatform] as any)?.description || ''
                                  : ''}
                                onChange={(e) => handleContentChange(activePlatform, e.target.value)}
                                className={`w-full h-40 bg-transparent text-charcoal resize-none focus:outline-none text-sm leading-relaxed ${isEditing ? 'focus:ring-2 focus:ring-charcoal rounded p-2' : ''}`}
                            />
                        </div>
                    </div>
                    {isEditing ? (
                        <>
                            {/* EDITING VIEW FOR MEDIA */}
                            {post.content?.imageSuggestion && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-teal-600" />
                                        <label className="text-xs font-semibold text-charcoal uppercase tracking-wide">Picture Script</label>
                                    </div>
                                    <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg space-y-3">
                                        <textarea
                                            value={editedContent.imageSuggestion || ''}
                                            onChange={(e) => handleSuggestionChange('imageSuggestion', e.target.value)}
                                            className="w-full h-24 bg-white p-3 rounded-md text-sm text-charcoal resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 border border-teal-300"
                                            placeholder="Describe the image you want to generate..."
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <ActionButton onClick={() => handleOpenImproveModal('image')} disabled={isImproving.image} icon={isImproving.image ? Loader2 : Sparkles} label={isImproving.image ? 'Improving...' : 'Improve'} className="w-full bg-amber-500 hover:bg-amber-600 text-black" />
                                            <ActionButton onClick={handleGenerateImage} disabled={post.isGeneratingImage} icon={post.isGeneratingImage ? Loader2 : ImageIcon} label={post.isGeneratingImage ? 'Generating...' : 'Regenerate'} className="w-full text-white bg-teal-600 hover:bg-teal-700" />
                                        </div>
                                        {post.generatedImage && <img src={post.generatedImage} alt="Generated" className="rounded-lg w-full mt-2 border border-teal-300" />}
                                    </div>
                                </div>
                            )}
                            {post.content?.videoSuggestion && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Video className="w-4 h-4 text-purple-600" />
                                        <label className="text-xs font-semibold text-charcoal uppercase tracking-wide">Video Script</label>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg space-y-3">
                                        <textarea
                                            value={editedContent.videoSuggestion || ''}
                                            onChange={(e) => handleSuggestionChange('videoSuggestion', e.target.value)}
                                            className="w-full h-24 bg-white p-3 rounded-md text-sm text-charcoal resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-300"
                                            placeholder="Describe the video you want to generate..."
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <ActionButton onClick={() => handleOpenImproveModal('video')} disabled={isImproving.video} icon={isImproving.video ? Loader2 : Sparkles} label={isImproving.video ? 'Improving...' : 'Improve'} className="w-full bg-amber-500 hover:bg-amber-600 text-black" />
                                            {!isApiKeyReady && !post.generatedVideoUrl ? (
                                                <button onClick={onSelectKey} className="flex items-center justify-center gap-2 p-2 bg-yellow-900/50 rounded text-xs text-yellow-200 underline hover:text-white">
                                                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0"/>
                                                    <span>Select key to generate</span>
                                                </button>
                                            ) : (
                                                <ActionButton onClick={handleGenerateVideo} disabled={post.isGeneratingVideo} icon={post.isGeneratingVideo ? Loader2 : Video} label={post.isGeneratingVideo ? post.videoGenerationStatus.split(' ')[0] : 'Regenerate'} className="w-full text-white bg-purple-600 hover:bg-purple-700" />
                                            )}
                                        </div>
                                        {post.generatedVideoUrl && <video src={post.generatedVideoUrl} controls className="rounded-lg w-full mt-2 border border-purple-300" />}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* VIEWING VIEW FOR MEDIA */}
                            {post.content?.imageSuggestion && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-teal-600" />
                                        <p className="text-xs font-semibold text-charcoal uppercase tracking-wide">Picture Script</p>
                                    </div>
                                    <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg space-y-3">
                                        <p className="text-slate text-xs italic leading-relaxed">"{post.content?.imageSuggestion}"</p>
                                        {post.generatedImage ? (
                                            <img src={post.generatedImage} alt="Generated" className="rounded-lg w-full border border-teal-300" />
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
                                </div>
                            )}
                            {post.content?.videoSuggestion && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Video className="w-4 h-4 text-purple-600" />
                                        <p className="text-xs font-semibold text-charcoal uppercase tracking-wide">Video Script</p>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg space-y-3">
                                        <p className="text-slate text-xs italic leading-relaxed">"{post.content?.videoSuggestion}"</p>
                                        {post.generatedVideoUrl ? (
                                            <div className="relative">
                                                <video src={post.generatedVideoUrl} controls className="rounded-lg w-full border border-purple-300" />
                                                <a href={post.generatedVideoUrl} download={`video_${post.id}.mp4`} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/80 transition-colors">
                                                    <ExternalLink className="w-4 h-4"/>
                                                </a>
                                            </div>
                                        ) : (
                                            !isApiKeyReady ? (
                                                <button onClick={onSelectKey} className="flex items-center justify-center gap-2 w-full p-2 bg-yellow-900/50 rounded text-xs text-yellow-200 underline hover:text-white transition-colors">
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
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="p-4 bg-light-gray flex flex-wrap gap-3 justify-between items-center border-t border-slate/20">
                    {isEditing ? (
                         <div className="flex items-center justify-between w-full">
                            <div className="flex gap-2 flex-wrap">
                                <ActionButton onClick={handleSave} icon={Save} label="Save Changes" className="bg-green-600 hover:bg-green-700 text-white" />
                                <ActionButton onClick={handleCancel} icon={X} label="Cancel" className="bg-gray-500 hover:bg-gray-600 text-white" />
                                <ActionButton onClick={() => setIsPreviewOpen(true)} icon={Eye} label="Preview" className="bg-blue-600 hover:bg-blue-700 text-white" />
                            </div>
                            <ActionButton onClick={() => onDeletePost(post.id)} icon={Trash2} label="" className="bg-red-600 hover:bg-red-700 text-white w-10 h-10" />
                        </div>
                    ) : (
                         <div className="flex items-center justify-between w-full">
                            <div className="flex gap-2 flex-wrap">
                                <ActionButton onClick={() => setIsEditing(true)} icon={Edit} label="Edit" className="bg-charcoal hover:bg-charcoal-dark text-white" />
                                <ActionButton onClick={() => setIsPreviewOpen(true)} icon={Eye} label="Preview" className="bg-blue-600 hover:bg-blue-700 text-white" />
                                {post.status === 'draft' && <ActionButton onClick={() => handleStatusChange('needs approval')} icon={Send} label="Request Approval" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold" />}
                                {post.status === 'needs approval' && <ActionButton onClick={() => handleStatusChange('approved')} icon={CheckCircle} label="Approve" className="bg-cyan-500 hover:bg-cyan-600 text-white" />}
                                {post.status === 'approved' && (
                                    <ActionButton onClick={() => handleStatusChange('ready to publish')} icon={ArrowRightCircle} label="Finalize & Move" className="bg-charcoal hover:bg-charcoal-dark text-white" />
                                )}
                            </div>
                            <ActionButton onClick={() => onDeletePost(post.id)} icon={Trash2} label="" className="bg-red-600 hover:bg-red-700 text-white w-10 h-10" />
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
            <ImproveModal />
        </>
    );
};

export default PostCard;
