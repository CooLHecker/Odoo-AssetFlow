/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Asset, AssetStatus, Department, AssetCategory, Employee, Reservation, NotificationItem, ActivityLog, UserProfile } from "./types";

export const INITIAL_USER: UserProfile = {
  name: "Marcus Chen",
  email: "marcus.chen@assetflow.com",
  role: "Fleet Manager",
  department: "IT Logistics",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuBQiDmQBAjCFHzREiYAU2iy2QmplS-VUAEkS-i5991Fa9AwWm63DJLM1_pd2-9hDy9CEkyof0W1MWTt-ESO9th5V6WpNRjloESfp5JP6l5HlT8wU-jqZ04ui1gtCoa-zYCF1QNO2-3bzDIRm2WZ6Dpf7kRwx9eMPYai4v8jTl_CilILyShdqrKrXoCjeB2GyeWxZwsuRxU1bG0xPCeWccU6NuanviwpyVgn1nKyM4bACTMpo8CMpeqQ"
};

export const INITIAL_ASSETS: Asset[] = [
  {
    tag: "AF-2024-001",
    name: "MacBook Pro M3 Max",
    category: "Laptops",
    department: "Engineering",
    status: AssetStatus.ALLOCATED,
    assignedTo: "Alex Rivera",
    assignedToTitle: "Lead Frontend Engineer",
    condition: "Excellent",
    location: "HQ - Floor 4",
    purchaseDate: "2024-01-12",
    purchaseValue: 3499.00,
    warrantyTill: "2027-01-12",
    serialNumber: "C02FX1ABC2D3",
    manufacturer: "Apple Inc.",
    specs: "16\" Liquid Retina XDR Display, 64GB RAM, 2TB SSD",
    history: [
      { date: "2024-01-15", action: "Initial deployment and setup", details: "Maintenance check verified by Mike Ross" },
      { date: "2024-01-12", action: "Received into inventory", details: "Initial logging and serialization completed" }
    ]
  },
  {
    tag: "AF-2024-104",
    name: "Logitech MX Master 3S",
    category: "Peripherals",
    department: "IT Support",
    status: AssetStatus.AVAILABLE,
    assignedTo: "",
    condition: "New",
    location: "Inventory A",
    purchaseDate: "2024-02-14",
    purchaseValue: 99.00,
    warrantyTill: "2026-02-14",
    serialNumber: "LGT-MX3S-992",
    manufacturer: "Logitech",
    specs: "Quiet Click, 8K DPI Sensor, Bluetooth/Logi Bolt",
    history: [
      { date: "2024-02-14", action: "Received into inventory", details: "Scanned and verified by Warehouse Team" }
    ]
  },
  {
    tag: "AF-2023-892",
    name: "Tesla Model 3 (Fleet)",
    category: "Vehicles",
    department: "Logistics",
    status: AssetStatus.MAINTENANCE,
    assignedTo: "",
    condition: "Fair",
    location: "Service Center",
    purchaseDate: "2023-06-20",
    purchaseValue: 42000.00,
    warrantyTill: "2028-06-20",
    serialNumber: "5YJ3E1EA5LF9",
    manufacturer: "Tesla Inc.",
    specs: "Standard Range Plus, Rear-Wheel Drive, White Paint, Autopilot",
    history: [
      { date: "2024-05-15", action: "Scheduled maintenance triggered", details: "Inspected at Service Center for tyre replacement" }
    ]
  },
  {
    tag: "AF-2024-002",
    name: "Dell UltraSharp 32\"",
    category: "Peripherals",
    department: "Marketing",
    status: AssetStatus.ALLOCATED,
    assignedTo: "Sarah Chen",
    assignedToTitle: "Senior Marketing Designer",
    condition: "Excellent",
    location: "HQ - Floor 2",
    purchaseDate: "2024-03-01",
    purchaseValue: 899.00,
    warrantyTill: "2027-03-01",
    serialNumber: "CN-0TY42D-728",
    manufacturer: "Dell Inc.",
    specs: "4K UHD Display, IPS panel, 98% DCI-P3, USB-C Hub",
    history: [
      { date: "2024-03-02", action: "Assigned to personnel", details: "Allocated to Sarah Chen for creative design works" }
    ]
  },
  {
    tag: "AF-2024-441",
    name: "ErgoDesk Platinum",
    category: "Furniture",
    department: "Operations",
    status: AssetStatus.AVAILABLE,
    assignedTo: "",
    condition: "Good",
    location: "Warehouse B",
    purchaseDate: "2024-04-10",
    purchaseValue: 650.00,
    warrantyTill: "2029-04-10",
    serialNumber: "ED-PLAT-551",
    manufacturer: "ErgoOffice",
    specs: "Motorized Dual-Motor, Bamboo Top, 3-Stage Height-Adjustable Frame",
    history: []
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  { code: "IT-2024-XP", name: "Information Technology", manager: "Robert Chen", staffCount: 42 },
  { code: "HR-CORP-01", name: "Human Resources", manager: "Angela White", staffCount: 15 },
  { code: "OPS-GLBL-55", name: "Operations", manager: "Marcus Thorne", staffCount: 128 },
  { code: "LOG-WARE-02", name: "Logistics", manager: "Sarah Miller", staffCount: 84 }
];

export const INITIAL_CATEGORIES: AssetCategory[] = [
  { id: "computing", name: "Computing Devices", description: "Laptops, Desktops, and Workstations", icon: "laptop", assetCount: 342 },
  { id: "fleet", name: "Fleet Vehicles", description: "Sedans, Vans, and Utility Trucks", icon: "truck", assetCount: 18 },
  { id: "machinery", name: "Heavy Machinery", description: "Production Floor and Warehouse Equipment", icon: "wrench", assetCount: 54 },
  { id: "peripherals", name: "Peripherals & Accessories", description: "Monitors, keyboards, and mice", icon: "monitor", assetCount: 156 }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: "EMP-9021", name: "James Sterling", email: "j.sterling@assetflow.com", department: "Information Technology", status: "Active" },
  { id: "EMP-1142", name: "Leah Michaels", email: "l.michaels@assetflow.com", department: "Operations", status: "Active" },
  { id: "EMP-3321", name: "Alex Rivera", email: "a.rivera@assetflow.com", department: "Engineering", status: "Active" },
  { id: "EMP-4109", name: "Sarah Chen", email: "s.chen@assetflow.com", department: "Marketing", status: "Active" },
  { id: "EMP-2092", name: "David K.", email: "d.k@assetflow.com", department: "Creative Labs", status: "Active" }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: "RES-001",
    resourceType: "Company Vehicles",
    specificAsset: "Tesla Model 3 - Unit 42",
    date: "2023-10-02",
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    purpose: "Client site inspection meeting in Silicon Valley.",
    bookedBy: "Sarah Jenkins",
    bookedByAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFAVwsbm61ziZBhaVpjjTKTm16fkdycTG1EMsvsdKDyEvLHi5TaY8OsJ9ChBXrpCYTYygB4o2NQcAf8YNLhpDlFRNbRjq7bgLeJ36I5l1q9uVXJHOLz-3fNLHSgD7ppIGJuOXptJ6LkOwgDO2l70M2NNdbreH0EVhSqBg21NlqmazUq7VyNORSqSL0wdO40Mryw3dj6KlPqkFEySQ4XHWqn-4HN0waXjxLWOHsa7VzhdGjUJ9Je0T1fA",
    status: "Active"
  },
  {
    id: "RES-002",
    resourceType: "Meeting Rooms",
    specificAsset: "Conference Room A",
    date: "2023-10-03",
    startTime: "02:00 PM",
    endTime: "04:30 PM",
    purpose: "Quarterly review of marketing designs and Q3 budgets.",
    bookedBy: "David Chen",
    bookedByAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdCBoqJuWuaNgVmxpugZMWQ4EEd6OA-qvgtC6aQoMiUC05vKCczEvlN8j3T_eGV5BKTnjLWw9lWpnA3USAiHtvbLXS6Wiw9HzRSRGK3XIGVMUoGBO36dBE_VpEDMohhF2FVMF50pExzOVfspgj-K2DhlBr4ZZm0UStBzk1WmQeif5MYrUpdMiL5p8mH2pVAgwgosUaEHIqR3VWhmxAZl65oYabfN6spLvn2jDebtwd4RFEJNVkpHdpZQ",
    status: "Pending"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-001",
    type: "alert",
    title: "Critical Audit Failure",
    description: "Asset LAP-7721-X failed the biometric security audit. Immediate investigation required for Site B.",
    timeText: "2m ago",
    group: "TODAY",
    unread: true,
    assetTag: "LAP-7721-X",
    actionable: true
  },
  {
    id: "NOTIF-002",
    type: "booking",
    title: "New Booking Request",
    description: "Sarah Jenkins requested Projector Suite #4 for the Q3 Strategic Meeting tomorrow.",
    timeText: "1h ago",
    group: "TODAY",
    unread: true
  },
  {
    id: "NOTIF-003",
    type: "maintenance",
    title: "Scheduled Maintenance Reminder",
    description: "HVAC System Central unit is due for filter replacement. Technician ID: MNT-440.",
    timeText: "4h ago",
    group: "TODAY",
    unread: false
  },
  {
    id: "NOTIF-004",
    type: "transfer",
    title: "Asset Transfer Completed",
    description: "15 units of Ergonomic Chairs successfully moved from Warehouse A to the Main Office.",
    timeText: "1d ago",
    group: "YESTERDAY",
    unread: false
  },
  {
    id: "NOTIF-005",
    type: "return",
    title: "Loaner Return Verified",
    description: "Field Tablet TAB-009 returned by James Miller. Status: OPTIMAL",
    timeText: "1d ago",
    group: "YESTERDAY",
    unread: false,
    assetTag: "TAB-009"
  },
  {
    id: "NOTIF-006",
    type: "info",
    title: "Log Export Available",
    description: "Your requested maintenance logs (Jun 2023) are ready for download.",
    timeText: "2 days ago",
    group: "EARLIER",
    unread: false
  },
  {
    id: "NOTIF-007",
    type: "info",
    title: "Team Permissions Updated",
    description: "3 new members added to the 'Maintenance Supervisors' group.",
    timeText: "3 days ago",
    group: "EARLIER",
    unread: false
  },
  {
    id: "NOTIF-008",
    type: "info",
    title: "System Patch Deployed",
    description: "AssetFlow v2.4.1 update was successfully applied at 02:00 AM.",
    timeText: "4 days ago",
    group: "EARLIER",
    unread: false
  },
  {
    id: "NOTIF-009",
    type: "info",
    title: "Weekly Asset Summary",
    description: "Total active assets increased by 4.2% since last week.",
    timeText: "5 days ago",
    group: "EARLIER",
    unread: false
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "LOG-001",
    timestamp: "2026-07-11 09:12:44",
    user: "Jordan Smyth",
    userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZUDX3SDnMbrQ68LfeSp9S6fwAkwmDpm1PiMlFerRzzyywN8VMWVo1Lc19Wwt1qvfBorAC62Hj7OisWQ6FaSkf47MeBuAIyoCjRtfi35Qau2i9OLIb6qa23u_--TuDLRUnr_6YbBIivK9W7U7G3CLJXLHMxQb_Izo6sg2w77ETvvSQ2feWxrkXKjsZ2yEsnJZOBX6k46SyuQBgjnDbLgGM-g2trCzBdvVu4cn5infui2Q3nCZNgpFWEQ",
    action: "ALLOCATED",
    assetId: "LAP-7729-PR0",
    department: "Product Engineering",
    status: "Success",
    details: "Assigned high-spec development rig to lead engineer"
  },
  {
    id: "LOG-002",
    timestamp: "2026-07-11 08:55:21",
    user: "Sarah Connor",
    userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRl39plU7L_4278z89E0xi6K8HxFQA8AP7JjGMzdsMtQL8W1pgzzUW2v4lXY38-BH75A8MWfT1VFJ3K_JoYVNBtait-K-0f4LI3WcyHheOTvi9ABFKz180w6TlL3NfUpIrs9yAA19vq7210NgeiG1eW4SwUU_LqdIibM-a-l3fBbzO4MhU-QHtswHRmIjLV_d3gerp9AwbPwUDHrAuwWWrWpiPZLp9HPwwAvn0dhwe15hcUehb_8C2zw",
    action: "MAINTAINED",
    assetId: "SRV-MAIN-04",
    department: "Infrastructure",
    status: "Verified",
    details: "Replaced faulty cooling fans on server rack node D"
  },
  {
    id: "LOG-003",
    timestamp: "2026-07-11 08:32:10",
    user: "System Process",
    userAvatar: "",
    action: "ACCESS DENIED",
    assetId: "DB-CLUSTER-01",
    department: "Database Admin",
    status: "Flagged",
    details: "Unauthorized connection attempt on database port 5432 from external IP"
  },
  {
    id: "LOG-004",
    timestamp: "2026-07-11 08:15:55",
    user: "Marcus Vane",
    userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqAZxqqrn-YlgkmGzWBBY-2qGtWB93k9d73jeibc8vhrs5byXUIM1qYrg3ztD2a6VjEDgKTFru63XzlO5e55bznoF4LDgE_dsJsmozkN4MtQn67bpCDl668OPRd19bEOc0nSK4FIp5xo5pvMLm9Yl8XQQyTXDoKcfdhgBemyapOsJRd1NFG7zWW845hagaqpLFvFdBrQKOWolsEy2905tENWDPofscV0hO84aQiIbmmf_zSQg5qZiVhw",
    action: "RETURNED",
    assetId: "TAB-990-AIR",
    department: "Marketing",
    status: "Pending Review",
    details: "Returned via self-service kiosk, unit requires thorough surface disinfection"
  },
  {
    id: "LOG-005",
    timestamp: "2026-07-11 07:44:12",
    user: "Elena Rodriguez",
    userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMIhi7aT0-6_7_j_1pGkoSlCSCFyPY6PT0uu5HBNXdxd533UxMK6CjVmvLnmhk0-JiHuTZ4LsXPF4h4J2_z1NhZ5yexU4EKdg8ZjcQTUNvozUe7JgfRxw4VdU9I6hCwkg0N1ysHmwRytn2zZgF83sS6BgxEcc5CPg7G34xtlGBxL1WZKpywfNjM9M94ktlM5ZotT8eq-9L4BUXcz43PMzK5GbELKcl8phKqHtxyl61K4FNwjnVLrbMFA",
    action: "ALLOCATED",
    assetId: "MON-SAMSUNG-32",
    department: "Customer Success",
    status: "Success",
    details: "Assigned high-definition curved monitor for support ticketing desk"
  }
];
