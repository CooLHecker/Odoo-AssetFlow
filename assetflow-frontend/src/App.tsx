/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import {
  INITIAL_USER,
  INITIAL_ASSETS,
  INITIAL_DEPARTMENTS,
  INITIAL_CATEGORIES,
  INITIAL_EMPLOYEES,
  INITIAL_RESERVATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
} from "./data";
import {
  Asset,
  Department,
  AssetCategory,
  Employee,
  Reservation,
  NotificationItem,
  ActivityLog,
  UserProfile,
} from "./types";

import Sidebar from "./components/Sidebar";
import TopNavBar from "./components/TopNavBar";
import LoginScreen from "./components/LoginScreen";
import DashboardScreen from "./components/DashboardScreen";
import AssetDirectoryScreen from "./components/AssetDirectoryScreen";
import AssetAllocationScreen from "./components/AssetAllocationScreen";
import ResourceBookingScreen from "./components/ResourceBookingScreen";
import OrgSetupScreen from "./components/OrgSetupScreen";
import ActivityLogsScreen from "./components/ActivityLogsScreen";
import NotificationsScreen from "./components/NotificationsScreen";
import SettingsScreen from "./components/SettingsScreen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem("assetflow_logged_in");
    return saved === "true";
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("assetflow_user");
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem("assetflow_assets");
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem("assetflow_departments");
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [categories, setCategories] = useState<AssetCategory[]>(() => {
    const saved = localStorage.getItem("assetflow_categories");
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("assetflow_employees");
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem("assetflow_reservations");
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("assetflow_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem("assetflow_activity_logs");
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("assetflow_theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("assetflow_logged_in", String(isLoggedIn));
    localStorage.setItem("assetflow_user", JSON.stringify(user));
    localStorage.setItem("assetflow_assets", JSON.stringify(assets));
    localStorage.setItem("assetflow_departments", JSON.stringify(departments));
    localStorage.setItem("assetflow_categories", JSON.stringify(categories));
    localStorage.setItem("assetflow_employees", JSON.stringify(employees));
    localStorage.setItem("assetflow_reservations", JSON.stringify(reservations));
    localStorage.setItem("assetflow_notifications", JSON.stringify(notifications));
    localStorage.setItem("assetflow_activity_logs", JSON.stringify(activityLogs));
  }, [isLoggedIn, user, assets, departments, categories, employees, reservations, notifications, activityLogs]);

  useEffect(() => {
    localStorage.setItem("assetflow_theme", theme);
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
    document.body.classList.toggle("theme-dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    setCategories((prev) =>
      prev.map((cat) => {
        const matchCount = assets.filter(
          (a) => a.category.toLowerCase() === cat.name.toLowerCase() || a.category.toLowerCase() === cat.id.toLowerCase(),
        ).length;
        const baseMap: Record<string, number> = {
          computing: 340,
          fleet: 15,
          machinery: 50,
          peripherals: 150,
        };
        const base = baseMap[cat.id] || 0;
        return {
          ...cat,
          assetCount: base + matchCount,
        };
      }),
    );
  }, [assets]);

  const handleLoginSuccess = (validatedUser: UserProfile) => {
    setUser(validatedUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("assetflow_logged_in");
  };

  const handleResetDatabase = () => {
    setAssets(INITIAL_ASSETS);
    setDepartments(INITIAL_DEPARTMENTS);
    setCategories(INITIAL_CATEGORIES);
    setEmployees(INITIAL_EMPLOYEES);
    setReservations(INITIAL_RESERVATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setUser(INITIAL_USER);
    setCurrentTab("dashboard");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);

      const randomActivities = [
        "Network telemetry node CL-04 pinged successfully.",
        "Automatic database compliance check validated 100% security rules.",
        "ISO backup scheduled task executed flawlessly.",
      ];
      const randomText = randomActivities[Math.floor(Math.random() * randomActivities.length)];

      const refreshLog: ActivityLog = {
        id: `LOG-REF-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        user: "System Daemon",
        userAvatar: "",
        action: "TELEMETRY SYNC",
        assetId: "SYS-SYNC-NODE",
        department: "IT Logistics",
        status: "Success",
        details: randomText,
      };

      setActivityLogs((prev) => [refreshLog, ...prev]);
    }, 1000);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const renderViewContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <DashboardScreen
            assets={assets}
            reservations={reservations}
            notifications={notifications}
            setReservations={setReservations}
            setNotifications={setNotifications}
            setCurrentTab={setCurrentTab}
          />
        );
      case "directory":
        return (
          <AssetDirectoryScreen
            assets={assets}
            setAssets={setAssets}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
      case "allocation":
        return (
          <AssetAllocationScreen assets={assets} setAssets={setAssets} employees={employees} setActivityLogs={setActivityLogs} />
        );
      case "booking":
        return <ResourceBookingScreen reservations={reservations} setReservations={setReservations} />;
      case "org_setup":
        return (
          <OrgSetupScreen
            departments={departments}
            setDepartments={setDepartments}
            categories={categories}
            setCategories={setCategories}
          />
        );
      case "activity":
        return <ActivityLogsScreen activityLogs={activityLogs} setActivityLogs={setActivityLogs} />;
      case "notifications":
        return (
          <NotificationsScreen
            notifications={notifications}
            setNotifications={setNotifications}
            setCurrentTab={setCurrentTab}
          />
        );
      case "settings":
        return <SettingsScreen user={user} setUser={setUser} onResetDatabase={handleResetDatabase} />;
      default:
        return <div className="p-8 text-center text-slate-500 font-mono">Error: View Node "{currentTab}" Unrecognized.</div>;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} defaultUser={INITIAL_USER} />;
  }

  return (
    <div className={`flex h-screen overflow-hidden font-sans antialiased ${isDarkMode ? "theme-dark bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-800"}`}>
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} user={user} onLogout={handleLogout} unreadCount={unreadCount} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopNavBar
          currentTab={currentTab}
          user={user}
          unreadCount={unreadCount}
          setCurrentTab={setCurrentTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleTheme}
        />

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50 relative transition-colors">{renderViewContent()}</main>
      </div>
    </div>
  );
}
