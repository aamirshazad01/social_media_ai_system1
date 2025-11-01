'use client'

import React, { useState } from 'react';
import { Post, Platform, Tone, ContentType, TONES, CONTENT_TYPES } from '@/types';
import { PLATFORMS } from '@/constants';
import { generateSocialMediaContent } from '@/services/api/geminiService';
import { Loader2 } from 'lucide-react';

interface CreateContentFormProps {
    onPostCreated: (post: Post) => void;
}

const CreateContentForm: React.FC<CreateContentFormProps> = ({ onPostCreated }) => {
    const [topic, setTopic] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
    const [contentType, setContentType] = useState<ContentType>('engaging');
    const [tone, setTone] = useState<Tone>('casual');
    const [schedule, setSchedule] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePlatformChange = (platform: Platform) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || selectedPlatforms.length === 0) {
            setError('Please provide a topic and select at least one platform.');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const content = await generateSocialMediaContent(topic, selectedPlatforms, contentType, tone);
            const newPost: Post = {
                id: crypto.randomUUID(),
                topic,
                platforms: selectedPlatforms,
                content,
                status: schedule ? 'scheduled' : 'draft',
                createdAt: new Date().toISOString(),
                scheduledAt: schedule ? new Date(schedule).toISOString() : undefined,
                isGeneratingImage: false,
                isGeneratingVideo: false,
                videoGenerationStatus: ''
            };
            onPostCreated(newPost);
            setTopic('');
            setSelectedPlatforms([]);
            setSchedule('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-charcoal-dark">Create New Content</h2>
            <div className="bg-white p-8 rounded-lg shadow-xl border border-slate/30">
            <form onSubmit={handleSubmit} className="space-y-8">

                <div>
                    <label className="block text-md font-medium text-charcoal mb-3">1. Select Platforms</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {PLATFORMS.map(({ id, name, icon: Icon }) => (
                            <label key={id} className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${selectedPlatforms.includes(id) ? 'bg-charcoal/10 border-charcoal' : 'bg-gray-50 border-transparent hover:border-slate/30'}`}>
                                <input type="checkbox" checked={selectedPlatforms.includes(id)} onChange={() => handlePlatformChange(id)} className="hidden" />
                                <Icon className={`w-6 h-6 ${selectedPlatforms.includes(id) ? 'text-charcoal-dark' : 'text-slate'}`} />
                                <span className="font-medium text-charcoal-dark">{name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="topic" className="block text-md font-medium text-charcoal mb-3">2. Enter Topic/Subject</label>
                    <textarea
                        id="topic"
                        rows={4}
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="mt-1 block w-full bg-white border border-slate/30 rounded-md shadow-sm focus:ring-charcoal focus:border-charcoal text-charcoal p-3"
                        placeholder="e.g., Launch of our new productivity app..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="contentType" className="block text-md font-medium text-charcoal mb-3">3. Choose Content Type</label>
                        <select id="contentType" value={contentType} onChange={(e) => setContentType(e.target.value as ContentType)} className="mt-1 block w-full bg-white border-slate/30 rounded-md shadow-sm focus:ring-charcoal focus:border-charcoal text-charcoal p-3 capitalize">
                            {CONTENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tone" className="block text-md font-medium text-charcoal mb-3">4. Adjust Tone</label>
                        <select id="tone" value={tone} onChange={(e) => setTone(e.target.value as Tone)} className="mt-1 block w-full bg-white border-slate/30 rounded-md shadow-sm focus:ring-charcoal focus:border-charcoal text-charcoal p-3 capitalize">
                            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="schedule" className="block text-md font-medium text-charcoal mb-3">5. Schedule for Later (Optional)</label>
                    <input
                        type="datetime-local"
                        id="schedule"
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        className="mt-1 block w-full bg-white border-slate/30 rounded-md shadow-sm focus:ring-charcoal focus:border-charcoal text-charcoal p-3"
                    />
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <div className="text-center pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center items-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-charcoal hover:bg-charcoal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-charcoal disabled:bg-slate disabled:cursor-not-allowed transition-transform duration-200 transform hover:scale-105"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                Generating...
                            </>
                        ) : 'Generate AI Content'}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default CreateContentForm;