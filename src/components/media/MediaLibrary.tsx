import React, { useState, useEffect, useCallback } from 'react';
import { MediaAsset } from '@/types';
import {
  getAllMediaAssets,
  deleteMediaAsset,
  uploadMediaFile,
  updateMediaTags,
  searchMediaByTags,
  getStorageStats,
} from '@/services/mediaService';
import { Upload, Search, Trash2, Tag, Image as ImageIcon, Video, Download, X, Filter } from 'lucide-react';

const MediaLibrary: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<MediaAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [storageStats, setStorageStats] = useState({ totalAssets: 0, totalSize: 0 });
  const [isUploading, setIsUploading] = useState(false);

  const loadAssets = useCallback(async () => {
    const allAssets = await getAllMediaAssets();
    setAssets(allAssets);
    setFilteredAssets(allAssets);
    const stats = await getStorageStats();
    setStorageStats(stats);
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    let filtered = assets;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(asset => asset.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredAssets(filtered);
  }, [assets, filterType, searchTerm]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMediaFile(file);
      }
      await loadAssets();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this media asset?')) {
      await deleteMediaAsset(id);
      await loadAssets();
      setSelectedAsset(null);
    }
  };

  const handleUpdateTags = async (id: string, tags: string[]) => {
    await updateMediaTags(id, tags);
    await loadAssets();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Media Library</h2>
          <p className="text-gray-400 mt-1">
            {storageStats.totalAssets} assets · {formatFileSize(storageStats.totalSize)} total
          </p>
        </div>
        <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
          <Upload className="w-5 h-5 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Media'}
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filterType === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filterType === 'image' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filterType === 'video' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Videos
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-lg">
          <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400">No media assets found</h3>
          <p className="text-gray-500 mt-2">Upload images or videos to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="group relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition"
            >
              <div className="aspect-square bg-gray-900 flex items-center justify-center">
                {asset.type === 'image' ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="relative w-full h-full">
                    {asset.thumbnailUrl ? (
                      <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-300 truncate">{asset.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{formatFileSize(asset.size)}</span>
                  {asset.source === 'ai-generated' && (
                    <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded">AI</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAsset(null)}>
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white">{selectedAsset.name}</h3>
                <button onClick={() => setSelectedAsset(null)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                {selectedAsset.type === 'image' ? (
                  <img src={selectedAsset.url} alt={selectedAsset.name} className="w-full rounded-lg" />
                ) : (
                  <video src={selectedAsset.url} controls className="w-full rounded-lg" />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <p className="text-white capitalize">{selectedAsset.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Size</p>
                  <p className="text-white">{formatFileSize(selectedAsset.size)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Source</p>
                  <p className="text-white capitalize">{selectedAsset.source.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-white">{new Date(selectedAsset.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAsset.tags.length > 0 ? (
                      selectedAsset.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded text-sm">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No tags</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <a
                  href={selectedAsset.url}
                  download={selectedAsset.name}
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
                <button
                  onClick={() => handleDelete(selectedAsset.id)}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
