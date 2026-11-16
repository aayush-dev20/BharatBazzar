import React from 'react';
import { NotificationItem, Language } from '../types';
import { translations } from '../data/translations';
import { formatDate } from '../utils/formatters';
import {
  X,
  Bell,
  Package,
  Tag,
  Gift,
  AlertCircle,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  language: Language;
  onMarkAllAsRead: () => void;
  onNotificationClick: (notif: NotificationItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  language,
  onMarkAllAsRead,
  onNotificationClick
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'bhaav':
        return <Tag className="w-4 h-4 text-brass" />;
      case 'price_drop':
        return <TrendingDown className="w-4 h-4 text-brick" />;
      case 'reward':
        return <Gift className="w-4 h-4 text-brass" />;
      default:
        return <Bell className="w-4 h-4 text-slate-deep dark:text-zinc-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-surface dark:bg-charcoal-800 border-l border-subtle flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 border-b border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-brass" />
              <h2 className="text-base font-heading font-semibold text-ink dark:text-zinc-100">
                {t.notifications}
              </h2>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-brick text-white text-[10px] font-bold rounded">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-[11px] text-brass hover:underline font-medium"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 text-ink-muted hover:text-ink dark:text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-xs text-ink-muted dark:text-zinc-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onNotificationClick(n)}
                  className={`p-3 rounded border transition cursor-pointer text-xs space-y-1 ${
                    n.isRead
                      ? 'bg-concrete/30 dark:bg-charcoal-700/30 border-subtle'
                      : 'bg-brass-light/40 dark:bg-brass/10 border-brass/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-semibold text-ink dark:text-zinc-100">
                      {getIcon(n.type)}
                      <span>{n.title}</span>
                    </div>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brass shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-ink-muted dark:text-zinc-300 leading-snug">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-ink-light block pt-1">
                    {formatDate(n.createdAt, language)}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-subtle text-[11px] text-center text-ink-muted">
            SMS & WhatsApp alerts enabled via Haat Connect
          </div>
        </div>
      </div>
    </div>
  );
};
