
import React, { useState, useMemo } from 'react';
import { Post, PostStatus, Platform } from '@/types';
import FilterBar from '@/components/ui/FilterBar';
import PublishedCard from '@/components/history/HistoryCard';

interface PublishedViewProps {
    posts: Post[];
    onUpdatePost: (post: Post) => void;
    onDeletePost: (postId: string) => void;
    connectedAccounts: Record<Platform, boolean>;
}

const PublishedView: React.FC<PublishedViewProps> = ({ posts, onUpdatePost, onDeletePost, connectedAccounts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');

    const postsForPublishing = useMemo(() => {
        const relevantPosts = posts.filter(post => ['ready to publish', 'scheduled', 'published'].includes(post.status));
        
        return relevantPosts
            .filter(post => {
                const matchesSearch = post.topic.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesPlatform = platformFilter === 'all' || post.platforms.includes(platformFilter);
                return matchesSearch && matchesPlatform;
            })
            .sort((a, b) => {
                const statusOrder = { 'ready to publish': 1, 'scheduled': 2, 'published': 3 };
                if (statusOrder[a.status] !== statusOrder[b.status]) {
                    return statusOrder[a.status] - statusOrder[b.status];
                }
                const dateA = a.publishedAt || a.scheduledAt || a.createdAt;
                const dateB = b.publishedAt || b.scheduledAt || b.createdAt;
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });
    }, [posts, searchTerm, platformFilter]);

    if (postsForPublishing.length === 0 && searchTerm === '' && platformFilter === 'all') {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-semibold text-slate">Nothing to Publish</h2>
                <p className="text-slate mt-2">Finalize a post in "Manage Posts" and it will appear here, ready for action.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-charcoal-dark">Publishing Command Center</h2>
            </div>

            <FilterBar
                onSearchChange={setSearchTerm}
                onStatusChange={() => {}} 
                onPlatformChange={setPlatformFilter}
                showStatusFilter={false}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {postsForPublishing.map(post => (
                    <PublishedCard
                        key={post.id}
                        post={post}
                        onUpdatePost={onUpdatePost}
                        onDeletePost={onDeletePost}
                        connectedAccounts={connectedAccounts}
                    />
                ))}
            </div>
        </div>
    );
};

export default PublishedView;