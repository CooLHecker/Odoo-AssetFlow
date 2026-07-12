/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  Wrench, 
  CalendarDays, 
  Share2, 
  CheckCircle, 
  Info,
  X,
  ChevronRight
} from "lucide-react";
import { NotificationItem } from "../types";

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  setCurrentTab: (tab: string) => void;
}

export default function NotificationsScreen({
  notifications,
  setNotifications,
  setCurrentTab
}: NotificationsScreenProps) {

  // Action: Mark all notifications as read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Action: Clear all notifications
  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
    }
  };

  // Action: Toggle unread status of single notification
  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, unread: !n.unread };
      }
      return n;
    }));
  };

  // Action: Delete single notification
  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Visual helper for type icons
  const getNotificationVisuals = (type: string) => {
    switch (type) {
      case "alert":
        return {
          icon: <AlertTriangle className="h-4.5 w-4.5" />,
          bgColor: "bg-rose-50 text-rose-700 border-rose-100",
          ringColor: "ring-rose-500/10"
        };
      case "maintenance":
        return {
          icon: <Wrench className="h-4.5 w-4.5" />,
          bgColor: "bg-amber-50 text-amber-700 border-amber-100",
          ringColor: "ring-amber-500/10"
        };
      case "booking":
        return {
          icon: <CalendarDays className="h-4.5 w-4.5" />,
          bgColor: "bg-violet-50 text-violet-700 border-violet-100",
          ringColor: "ring-violet-500/10"
        };
      case "transfer":
        return {
          icon: <Share2 className="h-4.5 w-4.5" />,
          bgColor: "bg-sky-50 text-sky-700 border-sky-100",
          ringColor: "ring-sky-500/10"
        };
      case "return":
        return {
          icon: <CheckCircle className="h-4.5 w-4.5" />,
          bgColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
          ringColor: "ring-emerald-500/10"
        };
      default:
        return {
          icon: <Info className="h-4.5 w-4.5" />,
          bgColor: "bg-slate-50 text-slate-700 border-slate-100",
          ringColor: "ring-slate-500/10"
        };
    }
  };

  // Group notifications helpers
  const todayNotifs = notifications.filter(n => n.group === "TODAY");
  const yesterdayNotifs = notifications.filter(n => n.group === "YESTERDAY");
  const earlierNotifs = notifications.filter(n => n.group === "EARLIER");

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div id="notifications-view" className="space-y-6 max-w-4xl mx-auto">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-700" />
            EAM Notification Center
          </h2>
          <p className="text-sm text-slate-500">Monitor automated system reports, resource requests, and sensor alerts.</p>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="mark-all-read-button"
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </button>
            <button
              id="clear-all-notifications"
              onClick={handleClearAll}
              className="px-3 py-1.5 border border-slate-250 hover:bg-slate-50 hover:text-rose-600 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
          <p className="font-bold text-slate-700">Inbox Completely Clean</p>
          <p className="text-slate-400 text-xs mt-1">All telemetry systems are operating within optimal threshold bounds.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Group 1: TODAY */}
          {todayNotifs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1">Today's Alerts ({todayNotifs.length})</h3>
              <div className="space-y-2.5">
                {todayNotifs.map(n => {
                  const visuals = getNotificationVisuals(n.type);
                  return (
                    <div 
                      key={n.id}
                      onClick={() => handleToggleRead(n.id)}
                      className={`p-4 bg-white border rounded-xl flex items-start justify-between gap-4 transition-all shadow-2xs hover:border-slate-350 cursor-pointer ${
                        n.unread ? "border-l-4 border-l-teal-500 border-slate-300" : "border-slate-200 opacity-85"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-xl border ${visuals.bgColor} shadow-3xs shrink-0 mt-0.5`}>
                          {visuals.icon}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className={`text-slate-950 text-sm tracking-tight ${n.unread ? "font-bold" : "font-semibold"}`}>
                              {n.title}
                            </h4>
                            {n.unread && (
                              <span className="h-1.5 w-1.5 bg-teal-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-normal font-medium">{n.description}</p>
                          <span className="text-[10px] font-mono text-slate-400 block pt-0.5">{n.timeText} &bull; Alert Node {n.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                        {n.actionable && (
                          <button
                            onClick={() => n.assetTag ? setCurrentTab("directory") : setCurrentTab("booking")}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                          >
                            Resolve
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteNotification(n.id, e)}
                          className="p-1 hover:bg-slate-100 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                          title="Dismiss notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Group 2: YESTERDAY */}
          {yesterdayNotifs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1">Yesterday</h3>
              <div className="space-y-2.5">
                {yesterdayNotifs.map(n => {
                  const visuals = getNotificationVisuals(n.type);
                  return (
                    <div 
                      key={n.id}
                      onClick={() => handleToggleRead(n.id)}
                      className={`p-4 bg-white border rounded-xl flex items-start justify-between gap-4 transition-all shadow-2xs hover:border-slate-350 cursor-pointer ${
                        n.unread ? "border-l-4 border-l-teal-500 border-slate-300" : "border-slate-200 opacity-85"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-xl border ${visuals.bgColor} shadow-3xs shrink-0 mt-0.5`}>
                          {visuals.icon}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className={`text-slate-950 text-sm tracking-tight ${n.unread ? "font-bold" : "font-semibold"}`}>
                              {n.title}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 leading-normal font-medium">{n.description}</p>
                          <span className="text-[10px] font-mono text-slate-400 block pt-0.5">{n.timeText} &bull; Alert Node {n.id}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteNotification(n.id, e)}
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer shrink-0"
                        title="Dismiss notification"
                      >
                        <X className="h-4 w-4" />
                      </button>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Group 3: EARLIER */}
          {earlierNotifs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1">Earlier Notifications</h3>
              <div className="space-y-2.5">
                {earlierNotifs.map(n => {
                  const visuals = getNotificationVisuals(n.type);
                  return (
                    <div 
                      key={n.id}
                      onClick={() => handleToggleRead(n.id)}
                      className={`p-4 bg-white border border-slate-200/80 rounded-xl flex items-start justify-between gap-4 transition-all opacity-80 hover:opacity-100 hover:border-slate-300 cursor-pointer`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-xl border ${visuals.bgColor} shadow-3xs shrink-0 mt-0.5`}>
                          {visuals.icon}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-slate-800 text-sm font-semibold tracking-tight">
                            {n.title}
                          </h4>
                          <p className="text-xs text-slate-500 leading-normal font-medium">{n.description}</p>
                          <span className="text-[10px] font-mono text-slate-400 block pt-0.5">{n.timeText} &bull; Alert Node {n.id}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteNotification(n.id, e)}
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer shrink-0"
                        title="Dismiss notification"
                      >
                        <X className="h-4 w-4" />
                      </button>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
