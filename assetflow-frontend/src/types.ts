/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AssetStatus {
  AVAILABLE = "AVAILABLE",
  ALLOCATED = "ALLOCATED",
  MAINTENANCE = "MAINTENANCE"
}

export interface Asset {
  tag: string;
  name: string;
  category: string;
  department: string;
  status: AssetStatus;
  assignedTo: string;
  assignedToTitle?: string;
  condition: string;
  location: string;
  purchaseDate: string;
  purchaseValue: number;
  warrantyTill: string;
  serialNumber: string;
  manufacturer: string;
  specs: string;
  history: Array<{
    date: string;
    action: string;
    details: string;
  }>;
}

export interface Department {
  code: string;
  name: string;
  manager: string;
  staffCount: number;
}

export interface AssetCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  assetCount: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "Active" | "Inactive";
}

export interface Reservation {
  id: string;
  resourceType: string;
  specificAsset: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  bookedBy: string;
  bookedByAvatar: string;
  status: "Active" | "Pending" | "Completed";
}

export interface NotificationItem {
  id: string;
  type: "alert" | "booking" | "maintenance" | "transfer" | "return" | "info";
  title: string;
  description: string;
  timeText: string;
  group: "TODAY" | "YESTERDAY" | "EARLIER";
  unread: boolean;
  assetTag?: string;
  actionable?: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  userAvatar: string;
  action: string;
  assetId: string;
  department: string;
  status: "Success" | "Verified" | "Flagged" | "Pending Review";
  details: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
}
