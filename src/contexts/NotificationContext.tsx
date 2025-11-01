import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Notification, NotificationType } from '@/types';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: NotificationType, title: string, message: string, postId?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    postId?: string
  ) => {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      postId,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [notification, ...prev]);

    // Show toast notification
    const emoji = getEmojiForType(type);
    toast.success(`${emoji} ${title}`, {
      duration: 4000,
      position: 'top-right',
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
        unreadCount,
      }}
    >
      {children}
      <Toaster />
    </NotificationContext.Provider>
  );
};

function getEmojiForType(type: NotificationType): string {
  const emojiMap: Record<NotificationType, string> = {
    video_complete: '🎬',
    image_complete: '🖼️',
    post_scheduled: '📅',
    post_published: '🚀',
    approval_needed: '⚠️',
    comment_added: '💬',
    insight_available: '💡',
    queue_published: '📤',
  };
  return emojiMap[type] || '🔔';
}
