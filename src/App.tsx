'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Post, Platform } from '@/types';
import ContentStrategistView from '@/components/content/ContentStrategistView';
import ManagePosts from '@/components/posts/ManagePosts';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import PublishedView from '@/components/history/HistoryView';
import ConnectedAccountsView from '@/components/accounts/ConnectedAccountsView';
import MediaLibrary from '@/components/media/MediaLibrary';
import CampaignManager from '@/components/campaigns/CampaignManager';
import ContentRepurposer from '@/components/content/ContentRepurposer';
import NotificationBell from '@/components/ui/NotificationBell';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';
import { checkVideoOperationStatus, fetchVideo } from '@/services/api/geminiService';
import { autoSaveAIMedia } from '@/services/mediaService';
import { Edit3, LayoutGrid, BarChart3, Settings, History, Link as LinkIcon, Image, Target, Sparkles } from 'lucide-react';

type View = 'create' | 'manage' | 'history' | 'analytics' | 'accounts' | 'media' | 'campaigns' | 'repurpose';

const AppContent: React.FC = () => {
    const { addNotification } = useNotifications();
    const [activeView, setActiveView] = useState<View>('create');
    const [posts, setPosts] = useState<Post[]>([]);

    const [connectedAccounts, setConnectedAccounts] = useState<Record<Platform, boolean>>({
        twitter: false,
        linkedin: false,
        facebook: false,
        instagram: false
    });

    // Load data from localStorage on mount (client-side only)
    useEffect(() => {
        try {
            const savedPosts = localStorage.getItem('socialMediaPosts');
            if (savedPosts) {
                setPosts(JSON.parse(savedPosts));
            }
        } catch (error) {
            console.error("Could not parse posts from localStorage", error);
        }

        try {
            const savedAccounts = localStorage.getItem('connectedSocialAccounts');
            if (savedAccounts) {
                setConnectedAccounts(JSON.parse(savedAccounts));
            }
        } catch (error) {
            console.error("Could not parse connected accounts from localStorage", error);
        }
    }, []);


    const [isApiKeyReady, setIsApiKeyReady] = useState(false);

    const checkAndSetApiKey = useCallback(async () => {
        if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
            setIsApiKeyReady(true);
        } else {
            setIsApiKeyReady(false);
        }
    }, []);

    useEffect(() => {
        checkAndSetApiKey();
    }, [checkAndSetApiKey]);

    const handleSelectKey = useCallback(async () => {
        if(window.aistudio) {
            await window.aistudio.openSelectKey();
            // Assume success and optimistically update UI
            setIsApiKeyReady(true); 
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('socialMediaPosts', JSON.stringify(posts));
    }, [posts]);

    useEffect(() => {
        localStorage.setItem('connectedSocialAccounts', JSON.stringify(connectedAccounts));
    }, [connectedAccounts]);


    const checkScheduledPosts = useCallback(() => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.status === 'scheduled' && post.scheduledAt && new Date(post.scheduledAt) <= new Date()) {
                    return { ...post, status: 'published', publishedAt: new Date().toISOString() };
                }
                return post;
            })
        );
    }, []);

    const updatePost = useCallback((updatedPost: Post) => {
        setPosts(prevPosts => prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post));
    }, []);

    const pollVideoStatuses = useCallback(() => {
        posts.forEach(post => {
            if (post.isGeneratingVideo && post.videoOperation && !post.videoOperation.done) {
                checkVideoOperationStatus(post.videoOperation)
                    .then(async (updatedOp) => {
                        if (updatedOp.done) {
                            const uri = updatedOp.response?.generatedVideos?.[0]?.video?.uri;
                            if (uri) {
                                const videoUrl = await fetchVideo(uri);
                                // Auto-save to media library
                                await autoSaveAIMedia(videoUrl, 'video', post.topic);
                                // Send notification
                                addNotification('video_complete', 'Video Generation Complete', `Video for "${post.topic}" is ready!`, post.id);
                                updatePost({ ...post, generatedVideoUrl: videoUrl, isGeneratingVideo: false, videoGenerationStatus: 'Completed!', videoOperation: updatedOp });
                            } else {
                                updatePost({ ...post, isGeneratingVideo: false, videoGenerationStatus: 'Failed: No URI.', videoOperation: updatedOp });
                            }
                        } else {
                            updatePost({ ...post, videoOperation: updatedOp }); // Just update the operation status
                        }
                    })
                    .catch(error => {
                        console.error("Error polling video status:", error);
                        if(error.message === 'API_KEY_INVALID') {
                            setIsApiKeyReady(false);
                        }
                        updatePost({ ...post, isGeneratingVideo: false, videoGenerationStatus: 'Error polling status.' });
                    });
            }
        });
    }, [posts, updatePost, addNotification]);

    useEffect(() => {
        const scheduleInterval = setInterval(checkScheduledPosts, 60000);
        const videoPollInterval = setInterval(pollVideoStatuses, 15000); // Poll every 15s

        return () => {
            clearInterval(scheduleInterval);
            clearInterval(videoPollInterval);
        };
    }, [checkScheduledPosts, pollVideoStatuses]);

    const addPost = (post: Post) => {
        setPosts(prevPosts => [post, ...prevPosts]);
        setActiveView('manage');
        addNotification('post_scheduled', 'New Post Created', `Post "${post.topic}" has been added to drafts.`, post.id);
    };

    const addMultiplePosts = (newPosts: Post[]) => {
        setPosts(prevPosts => [...newPosts, ...prevPosts]);
        setActiveView('manage');
        addNotification('post_scheduled', 'Posts Created', `${newPosts.length} posts have been added to your drafts.`);
    };

    const deletePost = (postId: string) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    };
    
    const SidebarItem: React.FC<{ viewName: View; icon: React.ElementType; label: string }> = ({ viewName, icon: Icon, label }) => (
        <button
            onClick={() => setActiveView(viewName)}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeView === viewName
                    ? 'bg-charcoal text-white shadow-md'
                    : 'text-slate hover:bg-slate/10 hover:text-charcoal-dark'
            }`}
        >
            <Icon className="w-5 h-5 mr-3" />
            <span>{label}</span>
        </button>
    );

    const renderViewContent = () => {
        const viewProps = {
            posts,
            onUpdatePost: updatePost,
            onDeletePost: deletePost,
            isApiKeyReady,
            onSelectKey: handleSelectKey,
            resetApiKeyStatus: () => setIsApiKeyReady(false),
            connectedAccounts,
        };
        switch (activeView) {
            case 'create':
                return <ContentStrategistView onPostCreated={addPost} />;
            case 'manage':
                return <ManagePosts {...viewProps} />;
            case 'history':
                return <PublishedView {...viewProps} />;
            case 'analytics':
                return <AnalyticsDashboard posts={posts} />;
            case 'accounts':
                return <ConnectedAccountsView connectedAccounts={connectedAccounts} onUpdateAccounts={setConnectedAccounts} />;
            case 'media':
                return <MediaLibrary />;
            case 'campaigns':
                return <CampaignManager posts={posts} />;
            case 'repurpose':
                return <ContentRepurposer onPostsCreated={addMultiplePosts} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-white text-charcoal font-sans">
            <aside className="w-64 bg-light-gray p-4 flex flex-col justify-between border-r border-slate/30">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-xl font-bold text-charcoal-dark">
                           AI Content OS
                        </h1>
                        <NotificationBell />
                    </div>
                    <nav className="space-y-2">
                        <SidebarItem viewName="create" icon={Edit3} label="Create Content" />
                        <SidebarItem viewName="repurpose" icon={Sparkles} label="Repurpose" />
                        <SidebarItem viewName="manage" icon={LayoutGrid} label="Manage Posts" />
                        <SidebarItem viewName="history" icon={History} label="Published" />
                        <div className="border-t border-slate/30 my-2"></div>
                        <SidebarItem viewName="campaigns" icon={Target} label="Campaigns" />
                        <SidebarItem viewName="media" icon={Image} label="Media Library" />
                        <SidebarItem viewName="analytics" icon={BarChart3} label="Analytics" />
                        <SidebarItem viewName="accounts" icon={LinkIcon} label="Accounts" />
                    </nav>
                </div>
                 <div className="space-y-2">
                    <div className="text-xs p-3 bg-white border border-slate/30 rounded-lg">
                        <p className="font-semibold text-charcoal-dark">Video API Key</p>
                        <p className={`text-xs ${isApiKeyReady ? 'text-green-600' : 'text-yellow-600'}`}>
                            {isApiKeyReady ? 'Ready' : 'Selection required'}
                        </p>
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-charcoal hover:underline text-xs mt-1 block">
                            Billing info
                        </a>
                    </div>
                    <button
                        onClick={handleSelectKey}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-slate hover:bg-slate/10 hover:text-charcoal-dark"
                    >
                        <Settings className="w-5 h-5 mr-3" />
                        <span>Change API Key</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8">
                {renderViewContent()}
            </main>
        </div>
    );
};

// Wrap AppContent with NotificationProvider
const App: React.FC = () => {
    return (
        <NotificationProvider>
            <AppContent />
        </NotificationProvider>
    );
};

export default App;