'use client'

import React, { useState } from 'react';
import { Post, Platform } from '@/types';
import { PLATFORMS } from '@/constants';
import { repurposeContent } from '@/services/api/geminiService';
import { Sparkles, Loader2, FileText, Link as LinkIcon, Upload, Save, Video, Image as ImageIcon } from 'lucide-react';

interface ContentRepurposerProps {
  onPostsCreated: (posts: Post[]) => void;
}

const ContentRepurposer: React.FC<ContentRepurposerProps> = ({ onPostsCreated }) => {
  const [inputType, setInputType] = useState<'text' | 'url' | 'file'>('text');
  const [longFormContent, setLongFormContent] = useState('');
  const [url, setUrl] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter', 'linkedin']);
  const [numberOfPosts, setNumberOfPosts] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([]);

  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setLongFormContent(text);
    };
    reader.readAsText(file);
  };

  const fetchContentFromURL = async () => {
    // In a real app, you'd use a backend service to fetch and parse the URL
    // For now, we'll just show a placeholder
    setError('URL fetching requires a backend service. Please paste the content directly.');
  };

  const handleRepurpose = async () => {
    if (!longFormContent.trim()) {
      setError('Please provide content to repurpose.');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setGeneratedPosts([]);

    try {
      const repurposedPosts = await repurposeContent(longFormContent, selectedPlatforms, numberOfPosts);

      const posts: Post[] = repurposedPosts.map(post => ({
        id: crypto.randomUUID(),
        topic: post.topic,
        platforms: selectedPlatforms,
        content: post.content,
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        isGeneratingImage: false,
        isGeneratingVideo: false,
        videoGenerationStatus: '',
      }));

      setGeneratedPosts(posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAll = () => {
    onPostsCreated(generatedPosts);
    setGeneratedPosts([]);
    setLongFormContent('');
    setUrl('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-charcoal-dark flex items-center">
          <Sparkles className="w-8 h-8 mr-3 text-yellow-400" />
          Content Repurposer
        </h2>
        <p className="text-slate mt-2">
          Transform long-form content into multiple engaging social media posts
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-xl border border-slate/30">
        {/* Input Type Selection */}
        <div className="mb-6">
          <label className="block text-md font-medium text-charcoal mb-3">Input Source</label>
          <div className="flex gap-4">
            <button
              onClick={() => setInputType('text')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                inputType === 'text' ? 'bg-charcoal text-white' : 'bg-gray-50 text-charcoal hover:bg-slate/10'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Paste Text
            </button>
            <button
              onClick={() => setInputType('url')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                inputType === 'url' ? 'bg-charcoal text-white' : 'bg-gray-50 text-charcoal hover:bg-slate/10'
              }`}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              From URL
            </button>
            <label
              className={`flex items-center px-4 py-2 rounded-lg transition cursor-pointer ${
                inputType === 'file' ? 'bg-charcoal text-white' : 'bg-gray-50 text-charcoal hover:bg-slate/10'
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
              <input
                type="file"
                accept=".txt,.md"
                onChange={(e) => {
                  setInputType('file');
                  handleFileUpload(e);
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Content Input */}
        {inputType === 'text' && (
          <div className="mb-6">
            <label className="block text-md font-medium text-charcoal mb-3">Long-Form Content</label>
            <textarea
              value={longFormContent}
              onChange={(e) => setLongFormContent(e.target.value)}
              placeholder="Paste your blog post, article, video transcript, or any long-form content here..."
              className="w-full h-64 px-4 py-3 bg-white border border-slate/30 rounded-lg text-charcoal focus:ring-2 focus:ring-charcoal focus:border-transparent resize-none"
            />
            <p className="text-sm text-slate mt-2">
              {longFormContent.length} characters · Minimum 500 characters recommended
            </p>
          </div>
        )}

        {inputType === 'url' && (
          <div className="mb-6">
            <label className="block text-md font-medium text-gray-300 mb-3">Content URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/blog-post"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={fetchContentFromURL}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
              >
                Fetch
              </button>
            </div>
            <p className="text-sm text-yellow-500 mt-2">
              Note: URL fetching requires backend integration (not yet implemented)
            </p>
          </div>
        )}

        {inputType === 'file' && longFormContent && (
          <div className="mb-6">
            <label className="block text-md font-medium text-gray-300 mb-3">File Content Preview</label>
            <textarea
              value={longFormContent}
              onChange={(e) => setLongFormContent(e.target.value)}
              className="w-full h-64 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
        )}

        {/* Platform Selection */}
        <div className="mb-6">
          <label className="block text-md font-medium text-charcoal mb-3">Target Platforms</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PLATFORMS.map(({ id, name, icon: Icon }) => (
              <label
                key={id}
                className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                  selectedPlatforms.includes(id)
                    ? 'bg-charcoal/10 border-charcoal'
                    : 'bg-gray-50 border-transparent hover:border-slate/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(id)}
                  onChange={() => handlePlatformChange(id)}
                  className="hidden"
                />
                <Icon className={`w-6 h-6 ${selectedPlatforms.includes(id) ? 'text-charcoal-dark' : 'text-slate'}`} />
                <span className="font-medium text-charcoal-dark">{name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Number of Posts */}
        <div className="mb-6">
          <label className="block text-md font-medium text-charcoal mb-3">
            Number of Posts to Generate: {numberOfPosts}
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={numberOfPosts}
            onChange={(e) => setNumberOfPosts(parseInt(e.target.value))}
            className="w-full h-2 bg-light-gray rounded-lg appearance-none cursor-pointer accent-charcoal"
          />
          <div className="flex justify-between text-xs text-slate mt-1">
            <span>3 posts</span>
            <span>10 posts</span>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Action Button */}
        <button
          onClick={handleRepurpose}
          disabled={isProcessing || !longFormContent.trim()}
          className="w-full flex items-center justify-center py-3 px-6 bg-charcoal hover:bg-charcoal-dark disabled:bg-slate disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
              Generating {numberOfPosts} Posts...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Repurpose Content
            </>
          )}
        </button>
      </div>

      {/* Generated Posts Preview */}
      {generatedPosts.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-charcoal-dark flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                Generated Posts
              </h3>
              <p className="text-sm text-slate mt-1">{generatedPosts.length} posts ready to save</p>
            </div>
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <Save className="w-4 h-4" />
              Save All to Drafts
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedPosts.map((post, index) => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg border border-slate/30 overflow-hidden hover:shadow-xl transition-shadow duration-200">
                {/* Card Header */}
                <div className="bg-light-gray px-6 py-4 border-b border-slate/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal-dark">Post {index + 1}</h4>
                        <p className="text-xs text-slate">Draft</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedPlatforms.map(platform => {
                        const platformInfo = PLATFORMS.find(p => p.id === platform);
                        if (!platformInfo) return null;
                        const { icon: Icon } = platformInfo;
                        return <Icon key={platform} className="w-5 h-5 text-slate" />;
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Topic */}
                  <div className="pb-3 border-b border-slate/20">
                    <p className="text-sm font-semibold text-charcoal-dark leading-relaxed">{post.topic}</p>
                  </div>
                  
                  {/* Content Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-charcoal" />
                      <p className="text-xs font-semibold text-charcoal uppercase tracking-wide">Content</p>
                    </div>
                    <div className="bg-slate/5 border border-slate/20 p-4 rounded-lg">
                      <p className="text-charcoal text-sm leading-relaxed line-clamp-4">
                        {post?.content?.[selectedPlatforms?.[0]] ?? 'No content'}
                      </p>
                    </div>
                  </div>

                  {/* Image Script Preview */}
                  {post.content?.imageSuggestion && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-teal-600" />
                        <p className="text-xs font-semibold text-charcoal uppercase tracking-wide">Picture Script</p>
                      </div>
                      <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
                        <p className="text-slate text-xs italic leading-relaxed line-clamp-3">
                          "{post.content.imageSuggestion}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Video Script Preview */}
                  {post.content?.videoSuggestion && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-600" />
                        <p className="text-xs font-semibold text-charcoal uppercase tracking-wide">Video Script</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                        <p className="text-slate text-xs italic leading-relaxed line-clamp-3">
                          "{post.content.videoSuggestion}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentRepurposer;
