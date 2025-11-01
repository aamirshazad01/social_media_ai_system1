import React, { useState, useEffect, useMemo } from 'react';
import { Campaign, Post } from '../types';
import { getAllCampaigns, createCampaign, deleteCampaign, saveCampaign } from '../services/campaignService';
import { Plus, Trash2, Edit, Target, Calendar, TrendingUp, X } from 'lucide-react';

interface CampaignManagerProps {
  posts: Post[];
}

const CampaignManager: React.FC<CampaignManagerProps> = ({ posts }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    goals: '' as string,
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    const allCampaigns = getAllCampaigns();
    setCampaigns(allCampaigns);
  };

  const handleCreate = () => {
    if (!formData.name.trim()) return;

    const goals = formData.goals
      .split('\n')
      .map(g => g.trim())
      .filter(g => g.length > 0);

    createCampaign(
      formData.name,
      formData.description,
      formData.startDate || undefined,
      formData.endDate || undefined,
      goals.length > 0 ? goals : undefined
    );

    setFormData({ name: '', description: '', startDate: '', endDate: '', goals: '' });
    setIsCreating(false);
    loadCampaigns();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign? Posts will not be deleted.')) {
      deleteCampaign(id);
      loadCampaigns();
      setSelectedCampaign(null);
    }
  };

  const getCampaignStats = (campaignId: string) => {
    const campaignPosts = posts.filter(p => p.campaignId === campaignId);
    return {
      total: campaignPosts.length,
      published: campaignPosts.filter(p => p.status === 'published').length,
      scheduled: campaignPosts.filter(p => p.status === 'scheduled').length,
      draft: campaignPosts.filter(p => p.status === 'draft').length,
    };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Campaign Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Campaign
        </button>
      </div>

      {campaigns.length === 0 && !isCreating ? (
        <div className="text-center py-20 bg-gray-800 rounded-lg">
          <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400">No campaigns yet</h3>
          <p className="text-gray-500 mt-2">Create a campaign to organize your content strategy</p>
          <button
            onClick={() => setIsCreating(true)}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            Create Your First Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Campaign Card */}
          {isCreating && (
            <div className="bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">New Campaign</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Campaign Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={3}
                />
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Goals (one per line)</label>
                  <textarea
                    placeholder="Increase brand awareness&#10;Drive website traffic&#10;Generate leads"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    disabled={!formData.name.trim()}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setFormData({ name: '', description: '', startDate: '', endDate: '', goals: '' });
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Cards */}
          {campaigns.map(campaign => {
            const stats = getCampaignStats(campaign.id);
            return (
              <div
                key={campaign.id}
                className="bg-gray-800 rounded-lg p-6 hover:ring-2 hover:ring-indigo-500 transition cursor-pointer"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: campaign.color }}
                    />
                    <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(campaign.id);
                    }}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {campaign.description && (
                  <p className="text-gray-400 text-sm mb-4">{campaign.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(campaign.startDate).toLocaleDateString()}
                    {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-xs text-gray-400">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{stats.published}</p>
                    <p className="text-xs text-gray-400">Published</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{stats.scheduled}</p>
                    <p className="text-xs text-gray-400">Scheduled</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">{stats.draft}</p>
                    <p className="text-xs text-gray-400">Drafts</p>
                  </div>
                </div>

                {campaign.goals && campaign.goals.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Goals:</p>
                    <ul className="space-y-1">
                      {campaign.goals.slice(0, 2).map((goal, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start">
                          <span className="text-indigo-400 mr-2">•</span>
                          {goal}
                        </li>
                      ))}
                      {campaign.goals.length > 2 && (
                        <li className="text-sm text-gray-500">+{campaign.goals.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCampaign(null)}>
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedCampaign.color }}
                  />
                  <h3 className="text-2xl font-bold text-white">{selectedCampaign.name}</h3>
                </div>
                <button onClick={() => setSelectedCampaign(null)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedCampaign.description && (
                <p className="text-gray-300 mb-6">{selectedCampaign.description}</p>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-white">
                    {new Date(selectedCampaign.startDate).toLocaleDateString()}
                    {selectedCampaign.endDate && ` - ${new Date(selectedCampaign.endDate).toLocaleDateString()}`}
                  </p>
                </div>

                {selectedCampaign.goals && selectedCampaign.goals.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Campaign Goals</p>
                    <ul className="space-y-2">
                      {selectedCampaign.goals.map((goal, index) => (
                        <li key={index} className="text-white flex items-start">
                          <Target className="w-4 h-4 text-indigo-400 mr-2 mt-0.5 flex-shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Campaign Statistics</h4>
                {(() => {
                  const stats = getCampaignStats(selectedCampaign.id);
                  return (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-3xl font-bold text-white">{stats.total}</p>
                        <p className="text-gray-400">Total Posts</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-3xl font-bold text-green-400">{stats.published}</p>
                        <p className="text-gray-400">Published</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-3xl font-bold text-blue-400">{stats.scheduled}</p>
                        <p className="text-gray-400">Scheduled</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg">
                        <p className="text-3xl font-bold text-gray-400">{stats.draft}</p>
                        <p className="text-gray-400">In Progress</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManager;
