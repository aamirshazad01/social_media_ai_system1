/**
 * PHASE 4: APP.TSX WITH FULL DATABASE INTEGRATION
 *
 * This is a guide for updating App.tsx to use database services
 * Key changes needed:
 * 1. Import PostLibraryService and ThreadService
 * 2. Replace localStorage with database calls
 * 3. Update addPost, updatePost, deletePost callbacks
 * 4. Add publishPost database integration
 */

'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Post, Platform } from '@/types'
import ContentStrategistView from '@/components/content/ContentStrategistView'
import ManagePosts from '@/components/posts/ManagePosts'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'
import PublishedView from '@/components/history/HistoryView'
import MediaLibrary from '@/components/media/MediaLibrary'
import CampaignManager from '@/components/campaigns/CampaignManager'
import ContentRepurposer from '@/components/content/ContentRepurposer'
import NotificationBell from '@/components/ui/NotificationBell'
import MigrationBanner from '@/components/migration/MigrationBanner'
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext'
import { useAuth } from '@/contexts/AuthContext'
import { checkVideoOperationStatus, fetchVideo } from '@/services/api/geminiService'
import { autoSaveAIMedia } from '@/services/mediaService'
// NEW: Import database services
import { PostService } from '@/services/database/postService'
import { PostLibraryService } from '@/services/database/postLibraryService'
import { ThreadService } from '@/services/database/threadService'
import { publishingService } from '@/services/publishingService'
import { Edit3, LayoutGrid, BarChart3, History, Image, Target, Sparkles, LogOut, User, Cog } from 'lucide-react'

type View = 'create' | 'manage' | 'history' | 'analytics' | 'media' | 'campaigns' | 'repurpose' | 'library'

const AppContent: React.FC = () => {
    const { addNotification } = useNotifications()
    const { user, signOut, userRole, workspaceId } = useAuth()
    const [activeView, setActiveView] = useState<View>('create')
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(false)

    const [connectedAccounts, setConnectedAccounts] = useState<Record<Platform, boolean>>({
        twitter: false,
        linkedin: false,
        facebook: false,
        instagram: false,
        tiktok: false,
        youtube: false,
    })

    // UPDATED: Load posts from database on mount
    useEffect(() => {
        if (!user || !workspaceId) {
            setLoading(false)
            return
        }

        const loadData = async () => {
            try {
                setLoading(true)

                // Load posts from database
                const dbPosts = await PostService.getAllPosts(workspaceId)
                setPosts(dbPosts)

                // Load connected accounts from API
                const credStatusRes = await fetch('/api/credentials/status')
                if (!credStatusRes.ok) throw new Error('Failed to load credentials status')
                const accountsStatus = await credStatusRes.json()
                const accountsSummary: Record<Platform, boolean> = {
                    twitter: accountsStatus.twitter?.isConnected ?? false,
                    linkedin: accountsStatus.linkedin?.isConnected ?? false,
                    facebook: accountsStatus.facebook?.isConnected ?? false,
                    instagram: accountsStatus.instagram?.isConnected ?? false,
                    tiktok: accountsStatus.tiktok?.isConnected ?? false,
                    youtube: accountsStatus.youtube?.isConnected ?? false,
                }
                setConnectedAccounts(accountsSummary)
            } catch (error) {
                console.error('Error loading data from database:', error)
                addNotification('error', 'Load Error', 'Failed to load posts from database')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [user, workspaceId, addNotification])

    const [isApiKeyReady, setIsApiKeyReady] = useState(false)

    const checkAndSetApiKey = useCallback(async () => {
        if (window.aistudio && (await window.aistudio.hasSelectedApiKey())) {
            setIsApiKeyReady(true)
        } else {
            setIsApiKeyReady(false)
        }
    }, [])

    useEffect(() => {
        checkAndSetApiKey()
    }, [checkAndSetApiKey])

    const handleSelectKey = useCallback(async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey()
            setIsApiKeyReady(true)
        }
    }, [])

    // UPDATED: Update post in both state and database
    const updatePost = useCallback(
        async (updatedPost: Post) => {
            // Update local state immediately for responsiveness
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
            )

            // Save to database in background
            if (user && workspaceId) {
                try {
                    await PostService.updatePost(updatedPost, user.id, workspaceId)
                    addNotification('post_scheduled', 'Post Updated', `"${updatedPost.topic}" has been updated.`)
                } catch (error) {
                    console.error('Error updating post in database:', error)
                    addNotification('error', 'Update Error', 'Failed to save changes to database')
                }
            }
        },
        [user, workspaceId, addNotification]
    )

    const pollVideoStatuses = useCallback(() => {
        posts.forEach((post) => {
            if (post.isGeneratingVideo && post.videoOperation && !post.videoOperation.done) {
                checkVideoOperationStatus(post.videoOperation)
                    .then(async (updatedOp) => {
                        if (updatedOp.done) {
                            const uri = updatedOp.response?.generatedVideos?.[0]?.video?.uri
                            if (uri) {
                                const videoUrl = await fetchVideo(uri)
                                await autoSaveAIMedia(videoUrl, 'video', post.topic)
                                addNotification(
                                    'video_complete',
                                    'Video Generation Complete',
                                    `Video for "${post.topic}" is ready!`,
                                    post.id
                                )
                                updatePost({
                                    ...post,
                                    generatedVideoUrl: videoUrl,
                                    isGeneratingVideo: false,
                                    videoGenerationStatus: 'Completed!',
                                    videoOperation: updatedOp,
                                })
                            } else {
                                updatePost({
                                    ...post,
                                    isGeneratingVideo: false,
                                    videoGenerationStatus: 'Failed: No URI.',
                                    videoOperation: updatedOp,
                                })
                            }
                        } else {
                            updatePost({ ...post, videoOperation: updatedOp })
                        }
                    })
                    .catch((error) => {
                        console.error('Error polling video status:', error)
                        if (error.message === 'API_KEY_INVALID') {
                            setIsApiKeyReady(false)
                        }
                        updatePost({
                            ...post,
                            isGeneratingVideo: false,
                            videoGenerationStatus: 'Error polling status.',
                        })
                    })
            }
        })
    }, [posts, updatePost, addNotification])

    // UPDATED: Check for scheduled posts and auto-publish them
    const checkScheduledPosts = useCallback(async () => {
        const now = new Date()
        const readyToPublish = posts.filter(
            (post) => post.status === 'scheduled' && post.scheduledAt && new Date(post.scheduledAt) <= now
        )

        for (const post of readyToPublish) {
            try {
                // Auto-publish the post
                await publishPost(post)
            } catch (error) {
                console.error(`Failed to auto-publish post ${post.id}:`, error)
                addNotification('error', 'Publishing Error', `Failed to publish "${post.topic}"`)
            }
        }
    }, [posts, addNotification])

    useEffect(() => {
        const scheduleInterval = setInterval(checkScheduledPosts, 60000) // Check every minute
        const videoPollInterval = setInterval(pollVideoStatuses, 15000) // Poll every 15s

        return () => {
            clearInterval(scheduleInterval)
            clearInterval(videoPollInterval)
        }
    }, [checkScheduledPosts, pollVideoStatuses])

    // UPDATED: Add post to database
    const addPost = useCallback(
        async (post: Post) => {
            // Add to local state immediately for responsiveness
            setPosts((prevPosts) => [post, ...prevPosts])
            setActiveView('manage')

            // Save to database
            if (user && workspaceId) {
                try {
                    await PostService.createPost(post, user.id, workspaceId)
                    addNotification(
                        'post_scheduled',
                        'New Post Created',
                        `Post "${post.topic}" has been added to drafts.`,
                        post.id
                    )
                } catch (error) {
                    console.error('Error saving post to database:', error)
                    addNotification('error', 'Save Error', 'Failed to save post to database')
                    // Remove from state if save fails
                    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id))
                }
            }
        },
        [user, workspaceId, addNotification]
    )

    // UPDATED: Add multiple posts to database
    const addMultiplePosts = useCallback(
        async (newPosts: Post[]) => {
            // Add to local state immediately
            setPosts((prevPosts) => [...newPosts, ...prevPosts])
            setActiveView('manage')

            // Save all to database
            if (user && workspaceId) {
                try {
                    for (const post of newPosts) {
                        await PostService.createPost(post, user.id, workspaceId)
                    }
                    addNotification(
                        'post_scheduled',
                        'Posts Created',
                        `${newPosts.length} posts have been added to your drafts.`
                    )
                } catch (error) {
                    console.error('Error saving posts to database:', error)
                    addNotification('error', 'Save Error', 'Failed to save some posts to database')
                }
            }
        },
        [user, workspaceId, addNotification]
    )

    // UPDATED: Delete post from database
    const deletePost = useCallback(
        async (postId: string) => {
            // Delete from local state immediately
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))

            // Delete from database
            if (user && workspaceId) {
                try {
                    await PostService.deletePost(postId, user.id, workspaceId)
                    addNotification('post_scheduled', 'Post Deleted', 'Post has been removed.')
                } catch (error) {
                    console.error('Error deleting post from database:', error)
                    addNotification('error', 'Delete Error', 'Failed to delete post from database')
                }
            }
        },
        [user, workspaceId, addNotification]
    )

    // NEW: Publish post to all platforms and archive to library
    const publishPost = useCallback(
        async (post: Post) => {
            try {
                // Validate post
                const validation = publishingService.validatePostForPublishing(post)
                if (!validation.valid) {
                    addNotification('error', 'Validation Error', validation.errors?.join(', ') || 'Post validation failed')
                    return
                }

                // Publish to platforms
                const results = await publishingService.publishPost(post)

                // Archive to library
                if (user && workspaceId) {
                    await PostLibraryService.archivePost(post, results, workspaceId, user.id)
                }

                // Remove from posts table
                await deletePost(post.id)

                // Notify user
                const successCount = results.filter((r) => r.success).length
                addNotification(
                    'post_published',
                    'Post Published',
                    `Posted to ${successCount}/${results.length} platforms`,
                    post.id
                )
            } catch (error) {
                console.error('Error publishing post:', error)
                addNotification('error', 'Publishing Error', 'Failed to publish post to platforms')
            }
        },
        [user, workspaceId, deletePost, addNotification]
    )

    const SidebarItem: React.FC<{ viewName: View; icon: React.ElementType; label: string }> = ({
        viewName,
        icon: Icon,
        label,
    }) => (
        <button
            onClick={() => setActiveView(viewName)}
            className={`flex items-center w-full px-3 py-2.5 text-[11px] font-medium rounded-lg transition-all transform hover:translate-x-1 ${
                activeView === viewName
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
            }`}
        >
            <Icon className="w-4 h-4 mr-2.5" />
            <span>{label}</span>
        </button>
    )

    const renderViewContent = () => {
        const viewProps = {
            posts,
            onUpdatePost: updatePost,
            onDeletePost: deletePost,
            isApiKeyReady,
            onSelectKey: handleSelectKey,
            resetApiKeyStatus: () => setIsApiKeyReady(false),
            connectedAccounts,
        }
        switch (activeView) {
            case 'create':
                return <ContentStrategistView onPostCreated={addPost} />
            case 'manage':
                return <ManagePosts {...viewProps} />
            case 'history':
                return <PublishedView {...viewProps} onPublishPost={publishPost} />
            case 'analytics':
                return <AnalyticsDashboard posts={posts} />
            case 'media':
                return <MediaLibrary />
            case 'campaigns':
                return <CampaignManager posts={posts} onUpdatePost={updatePost} onCreatePost={addPost} />
            case 'repurpose':
                return <ContentRepurposer onPostsCreated={addMultiplePosts} />
            case 'library':
                return <div>Library View - Coming Soon</div> // TODO: Implement LibraryView
            default:
                return null
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <aside className="w-56 bg-white p-4 flex flex-col justify-between border-r border-gray-200 shadow-sm">
                <div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">AI Content OS</h1>
                            <p className="text-xs text-gray-500 mt-0.5">Content Platform</p>
                        </div>
                        <NotificationBell />
                    </div>
                    <nav className="space-y-1">
                        <SidebarItem viewName="create" icon={Edit3} label="Create Content" />
                        <SidebarItem viewName="repurpose" icon={Sparkles} label="Repurpose" />
                        <SidebarItem viewName="manage" icon={LayoutGrid} label="Manage Posts" />
                        <SidebarItem viewName="history" icon={History} label="Published" />
                        <div className="border-t border-gray-200 my-3"></div>
                        <SidebarItem viewName="campaigns" icon={Target} label="Campaigns" />
                        <SidebarItem viewName="media" icon={Image} label="Media Library" />
                        <SidebarItem viewName="analytics" icon={BarChart3} label="Analytics" />
                    </nav>
                </div>

                {/* User Section */}
                <div className="border-t border-gray-200 pt-3">
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-gray-700">
                            {user?.email || 'User'} • {userRole}
                        </p>
                    </div>
                    <button
                        onClick={signOut}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900">Social Media Content Manager</h2>
                    <p className="text-sm text-gray-500">Workspace: {workspaceId}</p>
                </header>

                {/* Content Area */}
                <section className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading posts...</p>
                            </div>
                        </div>
                    ) : (
                        renderViewContent()
                    )}
                </section>
            </main>
        </div>
    )
}

export default function App() {
    return (
        <NotificationProvider>
            <AppContent />
        </NotificationProvider>
    )
}
