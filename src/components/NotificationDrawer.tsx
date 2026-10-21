import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bell,
  CheckCircle,
  Calendar,
  FileText,
  Megaphone,
  Award,
  CheckCheck,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  const userNotifications = currentUser
    ? notifications.filter(n => n.userId === currentUser.id)
    : [];

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (id: string, linkTab?: string) => {
    markNotificationRead(id);
    if (linkTab) {
      setActiveTab(linkTab);
      setIsNotificationDrawerOpen(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'class':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'attendance':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'assignment':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-indigo-600" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-slate-900 text-base">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-blue-700 font-semibold">({unreadCount} new)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 p-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {userNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-600">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1">
                You will receive alerts here for class timetables, attendance, assignments, and announcements.
              </p>
            </div>
          ) : (
            userNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.linkTab)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-white border-slate-200 hover:bg-slate-50'
                    : 'bg-blue-50/60 border-blue-200 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.linkTab && (
                      <span className="inline-block text-[11px] text-blue-700 font-semibold mt-1.5 hover:underline">
                        View Details →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
