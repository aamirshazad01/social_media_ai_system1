
import React from 'react';
import { Platform } from '@/types';
import { PLATFORMS } from '@/constants';
import { CheckCircle, Link } from 'lucide-react';

interface ConnectedAccountsViewProps {
    connectedAccounts: Record<Platform, boolean>;
    onUpdateAccounts: (accounts: Record<Platform, boolean>) => void;
}

const ConnectedAccountsView: React.FC<ConnectedAccountsViewProps> = ({ connectedAccounts, onUpdateAccounts }) => {
    
    const handleToggleConnection = (platformId: Platform) => {
        onUpdateAccounts({
            ...connectedAccounts,
            [platformId]: !connectedAccounts[platformId]
        });
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-white">Connected Accounts</h2>
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-3xl mx-auto">
                <p className="text-gray-400 mb-6">
                    Connect your social media accounts to enable direct publishing and scheduling from the app.
                    This is currently a simulation and does not connect to real accounts.
                </p>
                <div className="space-y-4">
                    {PLATFORMS.map(({ id, name, icon: Icon }) => {
                        const isConnected = connectedAccounts[id];
                        return (
                            <div key={id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <Icon className="w-8 h-8 text-gray-300" />
                                    <span className="text-lg font-medium text-white">{name}</span>
                                </div>
                                {isConnected ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center text-green-400">
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            <span className="font-semibold">Connected</span>
                                        </div>
                                        <button 
                                            onClick={() => handleToggleConnection(id)}
                                            className="px-4 py-2 text-sm font-medium bg-gray-600 hover:bg-gray-500 rounded-md text-white"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleToggleConnection(id)}
                                        className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 rounded-md text-white flex items-center"
                                    >
                                        <Link className="w-4 h-4 mr-2" />
                                        Connect
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ConnectedAccountsView;
