import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTimeAgo = (dateString: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 max-h-[600px] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-700/50 transition ${
                      !notification.read ? 'bg-indigo-900/20' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <p className="text-white font-medium text-sm">{notification.title}</p>
                        <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                        <p className="text-gray-500 text-xs mt-2">{getTimeAgo(notification.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-indigo-400 hover:text-indigo-300"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-300"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
