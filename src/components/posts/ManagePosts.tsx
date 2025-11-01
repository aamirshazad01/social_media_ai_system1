
import React, { useState, useMemo } from 'react';
import { Post, PostStatus, Platform } from '@/types';
import PostCard from '@/components/content/PostCard';
import FilterBar from '@/components/ui/FilterBar';
import CalendarView from '@/components/calendar/CalendarView';
import { LayoutGrid, Calendar } from 'lucide-react';

interface ManagePostsProps {
    posts: Post[];
    onUpdatePost: (post: Post) => void;
    onDeletePost: (postId: string) => void;
    isApiKeyReady: boolean;
    onSelectKey: () => void;
    resetApiKeyStatus: () => void;
    connectedAccounts: Record<Platform, boolean>;
}

type ViewMode = 'grid' | 'calendar';

const ManagePosts: React.FC<ManagePostsProps> = ({ posts, onUpdatePost, onDeletePost, isApiKeyReady, onSelectKey, resetApiKeyStatus, connectedAccounts }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
    const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');

    const nonFinalizedPosts = useMemo(() => posts.filter(post => !['ready to publish', 'scheduled', 'published'].includes(post.status)), [posts]);

    const filteredPosts = useMemo(() => {
        return nonFinalizedPosts.filter(post => {
            const matchesSearch = post.topic.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
            const matchesPlatform = platformFilter === 'all' || post.platforms.includes(platformFilter);
            return matchesSearch && matchesStatus && matchesPlatform;
        });
    }, [nonFinalizedPosts, searchTerm, statusFilter, platformFilter]);

    const ViewToggleButton: React.FC<{ mode: ViewMode, icon: React.ElementType, label: string }> = ({ mode, icon: Icon, label }) => (
        <button
            onClick={() => setViewMode(mode)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === mode ? 'bg-charcoal text-white' : 'bg-white hover:bg-slate/10 border border-slate/30'
            }`}
        >
            <Icon className="w-4 h-4 mr-2" />
            {label}
        </button>
    );

    const renderGridContent = () => {
        if (nonFinalizedPosts.length === 0) {
             return (
                <div className="text-center py-20">
                    <h2 className="text-3xl font-semibold text-slate">Your content queue is empty!</h2>
                    <p className="text-slate mt-2">Go to "Create Content" to generate a new post, or check "Published" for finalized items.</p>
                </div>
            );
        }
        if (filteredPosts.length === 0) {
            return (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-semibold text-slate">No Posts Match Your Filters</h2>
                    <p className="text-slate mt-2">Try adjusting your search or selected filters.</p>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onUpdatePost={onUpdatePost}
                        onDeletePost={onDeletePost}
                        isApiKeyReady={isApiKeyReady}
                        onSelectKey={onSelectKey}
                        resetApiKeyStatus={resetApiKeyStatus}
                        connectedAccounts={connectedAccounts}
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-charcoal-dark">Manage & Finalize Posts</h2>
                <div className="flex items-center space-x-2 bg-light-gray p-1 rounded-lg">
                    <ViewToggleButton mode="grid" icon={LayoutGrid} label="Grid" />
                    <ViewToggleButton mode="calendar" icon={Calendar} label="Calendar" />
                </div>
            </div>

            <FilterBar
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
                onPlatformChange={setPlatformFilter}
                excludeStatuses={['published', 'scheduled', 'ready to publish']}
            />

            {viewMode === 'grid' ? renderGridContent() : <CalendarView posts={filteredPosts} />}
        </div>
    );
};

export default ManagePosts;