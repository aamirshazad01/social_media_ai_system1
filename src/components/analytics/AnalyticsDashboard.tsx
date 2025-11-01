
import React, { useMemo } from 'react';
import { Post, Platform, PostStatus } from '@/types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PLATFORMS, STATUS_CONFIG } from '@/constants';

interface AnalyticsDashboardProps {
    posts: Post[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ posts }) => {

    const stats = useMemo(() => {
        const statusCounts = posts.reduce((acc, post) => {
            acc[post.status] = (acc[post.status] || 0) + 1;
            return acc;
        }, {} as { [key in PostStatus]: number });

        const platformCounts = posts.reduce((acc, post) => {
            post.platforms.forEach(platform => {
                acc[platform] = (acc[platform] || 0) + 1;
            });
            return acc;
        }, {} as { [key in Platform]: number });

        const platformData = Object.entries(platformCounts)
            // Fix: Explicitly convert value to a number to resolve type inference issues.
            .map(([name, value]) => ({ name: PLATFORMS.find(p => p.id === name)?.name || name, value: Number(value) }))
            .filter(item => item.value > 0);

        const statusData = (Object.keys(STATUS_CONFIG) as PostStatus[])
            .map(status => ({
                name: STATUS_CONFIG[status].label,
                value: statusCounts[status] || 0,
                color: STATUS_CONFIG[status].color.replace('bg-', '#').replace('-500', '') // basic color conversion
            }))
            .filter(item => item.value > 0);


        return { totalPosts: posts.length, platformData, statusData, statusCounts };
    }, [posts]);

    const StatCard: React.FC<{ title: string; value: number; className?: string }> = ({ title, value, className }) => (
        <div className={`bg-white p-6 rounded-lg shadow-lg border border-slate/30 ${className}`}>
            <h3 className="text-sm font-medium text-slate">{title}</h3>
            <p className="mt-2 text-3xl font-semibold text-charcoal-dark">{value || 0}</p>
        </div>
    );

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-charcoal-dark">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <StatCard title="Total Posts" value={stats.totalPosts} className="bg-indigo-900" />
                <StatCard title="Published" value={stats.statusCounts.published} className="bg-green-900" />
                <StatCard title="Scheduled" value={stats.statusCounts.scheduled} className="bg-blue-900" />
                <StatCard title="Needs Approval" value={stats.statusCounts['needs approval']} className="bg-yellow-900" />
                <StatCard title="Drafts" value={stats.statusCounts.draft} className="bg-gray-700" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-slate/30">
                    <h3 className="text-lg font-semibold text-charcoal-dark mb-4">Platform Distribution</h3>
                    {stats.platformData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={stats.platformData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                    {stats.platformData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-gray-500 text-center py-10">No data to display.</p>}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg border border-slate/30">
                    <h3 className="text-lg font-semibold text-charcoal-dark mb-4">Post Status Overview</h3>
                     {stats.statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.statusData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <XAxis type="number" stroke="#9ca3af" />
                                <YAxis type="category" dataKey="name" stroke="#9ca3af" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}/>
                                <Bar dataKey="value" barSize={25}>
                                    {stats.statusData.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={STATUS_CONFIG[entry.name.toLowerCase().replace(' ', '-') as PostStatus]?.color.replace('bg-', '#').replace('-500', '') || '#8884d8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-gray-500 text-center py-10">No data to display.</p>}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;