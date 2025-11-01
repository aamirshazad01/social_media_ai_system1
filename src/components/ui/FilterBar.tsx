import React from 'react';
import { PostStatus, Platform } from '@/types';
import { PLATFORMS, STATUS_CONFIG } from '@/constants';
import { Search } from 'lucide-react';

interface FilterBarProps {
    onSearchChange: (value: string) => void;
    onStatusChange: (value: PostStatus | 'all') => void;
    onPlatformChange: (value: Platform | 'all') => void;
    showStatusFilter?: boolean;
    excludeStatuses?: PostStatus[];
}

const FilterBar: React.FC<FilterBarProps> = ({ onSearchChange, onStatusChange, onPlatformChange, showStatusFilter = true, excludeStatuses = [] }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by topic..."
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2 pl-10"
                />
            </div>
            <div className="flex w-full md:w-auto gap-4">
                {showStatusFilter && (
                    <select
                        onChange={(e) => onStatusChange(e.target.value as PostStatus | 'all')}
                        className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2 capitalize"
                    >
                        <option value="all">All Statuses</option>
                        {Object.entries(STATUS_CONFIG)
                            .filter(([status]) => !excludeStatuses.includes(status as PostStatus))
                            .map(([status, { label }]) => (
                            <option key={status} value={status}>{label}</option>
                        ))}
                    </select>
                )}
                <select
                    onChange={(e) => onPlatformChange(e.target.value as Platform | 'all')}
                    className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2"
                >
                    <option value="all">All Platforms</option>
                    {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
        </div>
    );
};

export default FilterBar;
