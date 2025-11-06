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
        const statusColors = {
            'draft': 'bg-gray-100 text-gray-800 border-gray-200',
            'needs_approval': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'approved': 'bg-purple-100 text-purple-800 border-purple-200',
            'ready_to_publish': 'bg-cyan-100 text-cyan-800 border-cyan-200',
            'scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
            'published': 'bg-green-100 text-green-800 border-green-200',
            'failed': 'bg-red-100 text-red-800 border-red-200'
        };
        const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
        return <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colorClass}`}>{config.label}</span>;
    };
    
    const PlatformTab: React.FC<{ platform: Platform }> = ({ platform }) => {
        const platformInfo = PLATFORMS.find(p => p.id === platform);
        if (!platformInfo) return null;
        const { icon: Icon } = platformInfo;

        return (
            <button
                onClick={() => setActivePlatform(platform)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-all border-b-2 ${
                    activePlatform === platform ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
                <Icon className="w-5 h-5" />
            </button>
        );
    };

    const ActionButton: React.FC<{ onClick: () => void, icon: React.ElementType, label: string, className?: string, disabled?: boolean }> = 
    ({ onClick, icon: Icon, label, className, disabled }) => (
        <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center text-base font-bold py-2 px-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 hover:shadow-lg ${className}`}>
            <Icon className={`w-4 h-4 ${label ? 'mr-1.5' : ''} ${disabled && (label.includes('Generating') || label.includes('Improving') || label.includes('Processing')) ? 'animate-spin' : ''}`} />
            {label && <span className="whitespace-nowrap">{label}</span>}
        </button>
    );

    const ImproveModal = () => {
        if (!improveModalOpen) return null;
        const type = improveModalOpen;
        const typeLabel = type === 'image' ? 'Picture' : 'Video';

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setImproveModalOpen(null)}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" onClick={e => e.stopPropagation()}>
                    <header className="flex justify-between items-center p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Improve {typeLabel} Script</h2>
                            <p className="text-sm text-gray-600 mt-1">Provide guidance to enhance the script</p>
                        </div>
                        <button onClick={() => setImproveModalOpen(null)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </header>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                What would you like to improve? (Optional)
                            </label>
                            <textarea
                                value={improvePromptInput}
                                onChange={(e) => setImprovePromptInput(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                                placeholder={`e.g., "Make it more cinematic", "Add more details about lighting", "Focus on emotional impact"...`}
                                className="w-full h-32 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm leading-relaxed"
                                autoFocus
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Leave empty to use AI's default improvement suggestions
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleImproveSuggestion}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-amber-500/30"
                            >
                                <Sparkles className="w-4 h-4" />
                                Improve Script
                            </button>
                            <button
                                onClick={() => setImproveModalOpen(null)}
                                className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all"
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
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg flex flex-col overflow-hidden border border-gray-200 transition-all">
                <div className="flex-grow p-4 space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <div className="flex">
                            {post.platforms.map(p => <PlatformTab key={p} platform={p} />)}
                        </div>
                        <StatusChip status={post.status} />
                    </div>
                    {/* Content Section */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Edit className="w-4 h-4 text-gray-600" />
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Content</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg min-h-[120px]">
                            <textarea
                                readOnly={!isEditing}
                                value={typeof editedContent?.[activePlatform] === 'string'
                                  ? editedContent[activePlatform]
                                  : typeof editedContent?.[activePlatform] === 'object'
                                  ? (editedContent[activePlatform] as any)?.description || ''
                                  : ''}
                                onChange={(e) => handleContentChange(activePlatform, e.target.value)}
                                className={`w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-gray-900 text-base leading-relaxed ${
                                    !isEditing ? 'cursor-default' : ''
                                }`}
                                style={{ minHeight: '100px' }}
                            />
                        </div>
                    </div>
                    {isEditing ? (
                        <>
                            {/* EDITING VIEW FOR MEDIA */}
                            {post.content?.imageSuggestion && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Picture Script</label>
                                    </div>
                                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg space-y-2">
                                        <textarea
                                            value={editedContent.imageSuggestion || ''}
                                            onChange={(e) => handleSuggestionChange('imageSuggestion', e.target.value)}
                                            className="w-full h-24 bg-white p-3 rounded-lg text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-300"
                                            placeholder="Describe the image you want to generate..."
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <ActionButton onClick={() => handleOpenImproveModal('image')} disabled={isImproving.image} icon={isImproving.image ? Loader2 : Sparkles} label={isImproving.image ? 'Improving...' : 'Improve'} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md" />
                                            <ActionButton onClick={handleGenerateImage} disabled={post.isGeneratingImage} icon={post.isGeneratingImage ? Loader2 : ImageIcon} label={post.isGeneratingImage ? 'Generating...' : 'Regenerate'} className="w-full text-white bg-emerald-600 hover:bg-emerald-700 shadow-md" />
                                        </div>
                                        {post.generatedImage && <img src={post.generatedImage} alt="Generated" className="rounded-lg w-full mt-2 border border-emerald-300" />}
                                    </div>
                                </div>
                            )}
                            {post.content?.videoSuggestion && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Video className="w-4 h-4 text-purple-600" />
                                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Video Script</label>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg space-y-2">
                                        <textarea
                                            value={editedContent.videoSuggestion || ''}
                                            onChange={(e) => handleSuggestionChange('videoSuggestion', e.target.value)}
                                            className="w-full h-24 bg-white p-3 rounded-lg text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-300"
                                            placeholder="Describe the video you want to generate..."
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <ActionButton onClick={() => handleOpenImproveModal('video')} disabled={isImproving.video} icon={isImproving.video ? Loader2 : Sparkles} label={isImproving.video ? 'Improving...' : 'Improve'} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md" />
                                            {!isApiKeyReady && !post.generatedVideoUrl ? (
                                                <button onClick={onSelectKey} className="flex items-center justify-center gap-2 px-3 py-2.5 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 hover:bg-yellow-100 transition-colors">
                                                    <AlertTriangle className="w-4 h-4 flex-shrink-0"/>
                                                    <span>Select key to generate</span>
                                                </button>
                                            ) : (
                                                <ActionButton onClick={handleGenerateVideo} disabled={post.isGeneratingVideo} icon={post.isGeneratingVideo ? Loader2 : Video} label={post.isGeneratingVideo ? post.videoGenerationStatus.split(' ')[0] : 'Regenerate'} className="w-full text-white bg-purple-600 hover:bg-purple-700 shadow-md" />
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
                                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Picture Script</p>
                                    </div>
                                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg space-y-2">
                                        <p className="text-gray-700 text-sm italic leading-relaxed">"{post.content?.imageSuggestion}"</p>
                                        {post.generatedImage ? (
                                            <img src={post.generatedImage} alt="Generated" className="rounded-lg w-full border border-emerald-300" />
                                        ) : (
                                            <ActionButton
                                                onClick={handleGenerateImage}
                                                disabled={post.isGeneratingImage}
                                                icon={post.isGeneratingImage ? Loader2 : ImageIcon}
                                                label={post.isGeneratingImage ? 'Generating...' : 'Generate Image'}
                                                className="w-full text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                            {post.content?.videoSuggestion && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Video className="w-4 h-4 text-purple-600" />
                                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Video Script</p>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg space-y-2">
                                        <p className="text-gray-700 text-sm italic leading-relaxed">"{post.content?.videoSuggestion}"</p>
                                        {post.generatedVideoUrl ? (
                                            <div className="relative">
                                                <video src={post.generatedVideoUrl} controls className="rounded-lg w-full border border-purple-300" />
                                                <a href={post.generatedVideoUrl} download={`video_${post.id}.mp4`} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 bg-black/60 p-2 rounded-lg text-white hover:bg-black/80 transition-colors">
                                                    <ExternalLink className="w-4 h-4"/>
                                                </a>
                                            </div>
                                        ) : (
                                            !isApiKeyReady ? (
                                                <button onClick={onSelectKey} className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 hover:bg-yellow-100 transition-colors">
                                                    <AlertTriangle className="w-4 h-4 flex-shrink-0"/>
                                                    <span>Select key to generate</span>
                                                </button>
                                            ) : (
                                                <ActionButton
                                                    onClick={handleGenerateVideo}
                                                    disabled={post.isGeneratingVideo}
                                                    icon={post.isGeneratingVideo ? Loader2 : Video}
                                                    label={post.isGeneratingVideo ? post.videoGenerationStatus.split(' ')[0] : 'Generate Video'}
                                                    className="w-full text-white bg-purple-600 hover:bg-purple-700 shadow-md"
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="p-4 bg-gray-50 flex flex-wrap gap-2 justify-between items-center border-t border-gray-200">
                    {isEditing ? (
                         <div className="flex items-center justify-between w-full">
                            <div className="flex gap-1.5 flex-wrap">
                                <ActionButton onClick={handleSave} icon={Save} label="Save Changes" className="bg-green-600 hover:bg-green-700 text-white shadow-md min-w-[120px]" />
                                <ActionButton onClick={handleCancel} icon={X} label="Cancel" className="bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 shadow-sm min-w-[100px]" />
                                <ActionButton onClick={() => setIsPreviewOpen(true)} icon={Eye} label="Preview" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md min-w-[100px]" />
                            </div>
                            <ActionButton onClick={() => onDeletePost(post.id)} icon={Trash2} label="" className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 shadow-md" />
                        </div>
                    ) : (
                         <div className="flex items-center justify-between w-full">
                            <div className="flex gap-1.5 flex-wrap">
                                <ActionButton onClick={() => setIsEditing(true)} icon={Edit} label="Edit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md min-w-[80px]" />
                                <ActionButton onClick={() => setIsPreviewOpen(true)} icon={Eye} label="Preview" className="bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 shadow-sm min-w-[100px]" />
                                {post.status === 'draft' && <ActionButton onClick={() => handleStatusChange('needs_approval')} icon={Send} label="Request Approval" className="bg-orange-500 hover:bg-orange-600 text-white shadow-md min-w-[150px]" />}
                                {post.status === 'needs_approval' && <ActionButton onClick={() => handleStatusChange('approved')} icon={CheckCircle} label="Approve" className="bg-purple-600 hover:bg-purple-700 text-white shadow-md min-w-[110px]" />}
                                {post.status === 'approved' && (
                                    <ActionButton onClick={() => handleStatusChange('ready_to_publish')} icon={ArrowRightCircle} label="Finalize & Move" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md min-w-[150px]" />
                                )}
                            </div>
                            <ActionButton onClick={() => onDeletePost(post.id)} icon={Trash2} label="" className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 shadow-md" />
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
