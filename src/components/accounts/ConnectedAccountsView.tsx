'use client'

import React, { useState, useEffect } from 'react';
import { Platform, TwitterCredentials, LinkedInCredentials, FacebookCredentials, InstagramCredentials } from '@/types';
import { PLATFORMS } from '@/constants';
import { CheckCircle, Link, AlertCircle, Settings, Loader2 } from 'lucide-react';
import CredentialModal from './CredentialModal';
import {
    savePlatformCredentials,
    getPlatformCredentials,
    disconnectPlatform,
    getConnectionSummary
} from '@/services/credentialService';
import { verifyTwitterCredentials } from '@/services/platforms/twitterService';
import { verifyLinkedInCredentials } from '@/services/platforms/linkedinService';
import { verifyFacebookCredentials } from '@/services/platforms/facebookService';
import { verifyInstagramCredentials } from '@/services/platforms/instagramService';

interface ConnectedAccountsViewProps {
    connectedAccounts: Record<Platform, boolean>;
    onUpdateAccounts: (accounts: Record<Platform, boolean>) => void;
}

const ConnectedAccountsView: React.FC<ConnectedAccountsViewProps> = ({ connectedAccounts, onUpdateAccounts }) => {
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
    const [verifyingPlatform, setVerifyingPlatform] = useState<Platform | null>(null);
    const [platformErrors, setPlatformErrors] = useState<Record<Platform, string | undefined>>({
        twitter: undefined,
        linkedin: undefined,
        facebook: undefined,
        instagram: undefined
    });
    const [platformUsernames, setPlatformUsernames] = useState<Record<Platform, string | undefined>>({
        twitter: undefined,
        linkedin: undefined,
        facebook: undefined,
        instagram: undefined
    });

    // Load connection status on mount
    useEffect(() => {
        loadConnectionStatus();
    }, []);

    const loadConnectionStatus = () => {
        const summary = getConnectionSummary();
        onUpdateAccounts(summary);

        // Load usernames for connected accounts
        const usernames: Record<Platform, string | undefined> = {
            twitter: undefined,
            linkedin: undefined,
            facebook: undefined,
            instagram: undefined
        };

        (Object.keys(summary) as Platform[]).forEach(platform => {
            if (summary[platform]) {
                const credentials = getPlatformCredentials(platform);
                if (credentials) {
                    if (platform === 'twitter') {
                        usernames[platform] = (credentials as TwitterCredentials).username;
                    } else if (platform === 'linkedin') {
                        usernames[platform] = (credentials as LinkedInCredentials).profileName;
                    } else if (platform === 'facebook') {
                        usernames[platform] = (credentials as FacebookCredentials).pageName;
                    } else if (platform === 'instagram') {
                        usernames[platform] = (credentials as InstagramCredentials).username;
                    }
                }
            }
        });

        setPlatformUsernames(usernames);
    };

    const handleConnect = (platform: Platform) => {
        setSelectedPlatform(platform);
        setPlatformErrors(prev => ({ ...prev, [platform]: undefined }));
    };

    const handleDisconnect = (platform: Platform) => {
        disconnectPlatform(platform);
        loadConnectionStatus();
        setPlatformErrors(prev => ({ ...prev, [platform]: undefined }));
    };

    const handleSaveCredentials = async (credentials: any) => {
        if (!selectedPlatform) return;

        setVerifyingPlatform(selectedPlatform);
        setPlatformErrors(prev => ({ ...prev, [selectedPlatform]: undefined }));

        try {
            let verificationResult;

            // Verify credentials based on platform
            switch (selectedPlatform) {
                case 'twitter':
                    verificationResult = await verifyTwitterCredentials(credentials as TwitterCredentials);
                    if (verificationResult.success && verificationResult.username) {
                        credentials.username = verificationResult.username;
                    }
                    break;
                case 'linkedin':
                    verificationResult = await verifyLinkedInCredentials(credentials as LinkedInCredentials);
                    if (verificationResult.success && verificationResult.profileName) {
                        credentials.profileName = verificationResult.profileName;
                    }
                    break;
                case 'facebook':
                    verificationResult = await verifyFacebookCredentials(credentials as FacebookCredentials);
                    if (verificationResult.success && verificationResult.pageName) {
                        credentials.pageName = verificationResult.pageName;
                    }
                    break;
                case 'instagram':
                    verificationResult = await verifyInstagramCredentials(credentials as InstagramCredentials);
                    if (verificationResult.success && verificationResult.username) {
                        credentials.username = verificationResult.username;
                    }
                    break;
            }

            if (verificationResult && !verificationResult.success) {
                throw new Error(verificationResult.error || 'Verification failed');
            }

            // Save credentials
            savePlatformCredentials(selectedPlatform, credentials);

            // Reload connection status
            loadConnectionStatus();

            setSelectedPlatform(null);
        } catch (error) {
            console.error('Failed to save credentials:', error);
            setPlatformErrors(prev => ({
                ...prev,
                [selectedPlatform]: error instanceof Error ? error.message : 'Failed to connect'
            }));
            throw error; // Re-throw to show error in modal
        } finally {
            setVerifyingPlatform(null);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-charcoal-dark">Connected Accounts</h2>
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl mx-auto border border-slate/30">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
                    <Settings className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Production-Ready Integration</p>
                        <p>
                            Connect your social media accounts by providing your API credentials.
                            Once connected, you'll be able to publish posts directly from this app.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {PLATFORMS.map(({ id, name, icon: Icon }) => {
                        const isConnected = connectedAccounts[id];
                        const isVerifying = verifyingPlatform === id;
                        const error = platformErrors[id];
                        const username = platformUsernames[id];

                        return (
                            <div key={id} className="bg-light-gray rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <Icon className="w-8 h-8 text-charcoal" />
                                        <div>
                                            <span className="text-lg font-medium text-charcoal-dark block">{name}</span>
                                            {isConnected && username && (
                                                <span className="text-sm text-slate">@{username}</span>
                                            )}
                                        </div>
                                    </div>
                                    {isVerifying ? (
                                        <div className="flex items-center gap-2 text-slate">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span className="font-semibold">Verifying...</span>
                                        </div>
                                    ) : isConnected ? (
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center text-green-600">
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                <span className="font-semibold">Connected</span>
                                            </div>
                                            <button
                                                onClick={() => handleDisconnect(id)}
                                                className="px-4 py-2 text-sm font-medium bg-slate hover:bg-slate/80 rounded-md text-white transition-colors"
                                            >
                                                Disconnect
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleConnect(id)}
                                            className="px-4 py-2 text-sm font-medium bg-charcoal hover:bg-charcoal-dark rounded-md text-white flex items-center transition-colors"
                                        >
                                            <Link className="w-4 h-4 mr-2" />
                                            Connect
                                        </button>
                                    )}
                                </div>
                                {error && (
                                    <div className="px-4 pb-4">
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-6 border-t border-slate/30">
                    <p className="text-sm text-slate">
                        <strong>Note:</strong> Your credentials are stored locally in your browser.
                        For production deployment, consider implementing a secure backend service to store and manage API credentials.
                    </p>
                </div>
            </div>

            {selectedPlatform && (
                <CredentialModal
                    platform={selectedPlatform}
                    isOpen={true}
                    onClose={() => setSelectedPlatform(null)}
                    onSave={handleSaveCredentials}
                />
            )}
        </div>
    );
};

export default ConnectedAccountsView;
