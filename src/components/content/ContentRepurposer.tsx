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
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          Content Repurposer
        </h2>
        <p className="text-gray-600 mt-1 text-sm">
          Transform long-form content into multiple engaging social media posts
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {/* Input Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Input Source</label>
          <div className="flex gap-3">
            <button
              onClick={() => setInputType('text')}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-all font-medium transform hover:scale-105 active:scale-95 ${
                inputType === 'text' ? 'bg-indigo-600 text-white shadow-md hover:shadow-lg' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Paste Text
            </button>
            <button
              onClick={() => setInputType('url')}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-all font-medium transform hover:scale-105 active:scale-95 ${
                inputType === 'url' ? 'bg-indigo-600 text-white shadow-md hover:shadow-lg' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              From URL
            </button>
            <label
              className={`flex items-center px-4 py-2.5 rounded-lg transition-all cursor-pointer font-medium transform hover:scale-105 active:scale-95 ${
                inputType === 'file' ? 'bg-indigo-600 text-white shadow-md hover:shadow-lg' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">Long-Form Content</label>
            <textarea
              value={longFormContent}
              onChange={(e) => setLongFormContent(e.target.value)}
              placeholder="Paste your blog post, article, video transcript, or any long-form content here..."
              className="w-full h-64 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">Target Platforms</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORMS.map(({ id, name, icon: Icon }) => (
              <label
                key={id}
                className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all border-2 transform hover:scale-105 active:scale-95 ${
                  selectedPlatforms.includes(id)
                    ? 'bg-indigo-50 border-indigo-500 shadow-md hover:shadow-lg'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(id)}
                  onChange={() => handlePlatformChange(id)}
                  className="hidden"
                />
                <Icon className={`w-6 h-6 ${selectedPlatforms.includes(id) ? 'text-indigo-600' : 'text-gray-600'}`} />
                <span className={`font-medium ${selectedPlatforms.includes(id) ? 'text-indigo-900' : 'text-gray-700'}`}>{name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Number of Posts */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Number of Posts to Generate: <span className="text-indigo-600 font-bold">{numberOfPosts}</span>
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={numberOfPosts}
            onChange={(e) => setNumberOfPosts(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3 posts</span>
            <span>10 posts</span>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}

        {/* Action Button */}
        <button
          onClick={handleRepurpose}
          disabled={isProcessing || !longFormContent.trim()}
          className="w-full flex items-center justify-center py-2 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-bold text-base shadow-md transform hover:scale-105 active:scale-95 hover:shadow-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-1.5" />
              <span className="whitespace-nowrap">Generating {numberOfPosts} Posts...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span className="whitespace-nowrap">Repurpose Content</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Posts Preview */}
      {generatedPosts.length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                Generated Posts
              </h3>
              <p className="text-sm text-gray-600 mt-1">{generatedPosts.length} posts ready to save</p>
            </div>
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-bold text-base shadow-md transform hover:scale-105 active:scale-95 hover:shadow-lg min-w-[150px]"
            >
              <Save className="w-4 h-4" />
              Save All to Drafts
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedPosts.map((post, index) => (
              <div key={post.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all transform hover:scale-[1.02] hover:-translate-y-1">
                {/* Card Header */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">Post {index + 1}</h4>
                        <p className="text-xs text-gray-600">Draft</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {selectedPlatforms.map(platform => {
                        const platformInfo = PLATFORMS.find(p => p.id === platform);
                        if (!platformInfo) return null;
                        const { icon: Icon } = platformInfo;
                        return <Icon key={platform} className="w-4 h-4 text-gray-600" />;
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Topic */}
                  <div className="pb-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 leading-relaxed">{post.topic}</p>
                  </div>
                  
                  {/* Content Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Content</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg min-h-[100px]">
                      <p className="text-gray-900 text-base leading-relaxed line-clamp-4">
                        {typeof post?.content?.[selectedPlatforms?.[0]] === 'string'
                          ? post.content[selectedPlatforms[0]]
                          : typeof post?.content?.[selectedPlatforms?.[0]] === 'object'
                          ? (post.content[selectedPlatforms[0]] as any)?.description || 'No content'
                          : 'No content'}
                      </p>
                    </div>
                  </div>

                  {/* Image Script Preview */}
                  {post.content?.imageSuggestion && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Picture Script</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                        <p className="text-gray-700 text-xs italic leading-relaxed line-clamp-3">
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
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Video Script</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                        <p className="text-gray-700 text-xs italic leading-relaxed line-clamp-3">
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
