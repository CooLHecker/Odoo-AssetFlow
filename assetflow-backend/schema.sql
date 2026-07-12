-- AssetFlow schema: Phase 1 (Dashboard data: assets, bookings, notifications)
-- Run this against your Aiven MySQL database (e.g. via Aiven's console, or:
--   mysql --host=<DB_HOST> --port=<DB_PORT> -u <DB_USER> -p --ssl-mode=REQUIRED <DB_NAME> < schema.sql

CREATE TABLE IF NOT EXISTS assets (
  tag             VARCHAR(20) PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  category        VARCHAR(100),
  department      VARCHAR(100),
  status          ENUM('AVAILABLE','ALLOCATED','MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
  assigned_to     VARCHAR(150),
  assigned_to_title VARCHAR(150),
  asset_condition VARCHAR(50),
  location        VARCHAR(150),
  purchase_date   DATE,
  purchase_value  DECIMAL(12,2) DEFAULT 0,
  warranty_till   DATE,
  serial_number   VARCHAR(100),
  manufacturer    VARCHAR(100),
  specs           TEXT,
  history         JSON,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id              VARCHAR(20) PRIMARY KEY,
  resource_type   VARCHAR(100),
  specific_asset  VARCHAR(150),
  booking_date    DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  purpose         VARCHAR(255),
  booked_by       VARCHAR(150),
  booked_by_avatar VARCHAR(255),
  status          ENUM('Active','Pending','Completed') NOT NULL DEFAULT 'Pending',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id            VARCHAR(20) PRIMARY KEY,
  type          VARCHAR(30),
  title         VARCHAR(150),
  description   VARCHAR(255),
  time_text     VARCHAR(50),
  notif_group   ENUM('TODAY','YESTERDAY','EARLIER') DEFAULT 'TODAY',
  unread        BOOLEAN DEFAULT TRUE,
  asset_tag     VARCHAR(20),
  actionable    BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data so the Dashboard has something real to show immediately
INSERT INTO assets (tag, name, category, department, status, assigned_to, asset_condition, location, purchase_date, purchase_value, serial_number, manufacturer)
VALUES
  ('AF-0001','Dell Latitude 5440','Computing Devices','Engineering','ALLOCATED','Priya Sharma','Good','HQ-2','2024-03-10',82000,'DL5440-991','Dell'),
  ('AF-0002','HP LaserJet Pro','Peripherals & Accessories','Operations','AVAILABLE',NULL,'Excellent','Warehouse B','2023-11-02',18500,'HPLJ-221','HP'),
  ('AF-0003','Toyota Innova (Fleet)','Fleet Vehicles','Logistics','MAINTENANCE',NULL,'Fair','Service Center','2022-06-15',1450000,'TI-4471','Toyota'),
  ('AF-0004','MacBook Pro 16"','Computing Devices','Marketing','ALLOCATED','Raj Mehta','Good','HQ-4','2024-01-20',210000,'MBP16-330','Apple')
ON DUPLICATE KEY UPDATE tag = tag;

INSERT INTO bookings (id, resource_type, specific_asset, booking_date, start_time, end_time, purpose, booked_by, booked_by_avatar, status)
VALUES
  ('BK-1001','Meeting Room','Room B2','2026-07-14','09:30:00','10:30:00','Client sync','Anita Rao','','Pending'),
  ('BK-1002','Fleet Vehicle','Toyota Innova','2026-07-15','14:00:00','17:00:00','Site visit','Karan Shah','','Active')
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO notifications (id, type, title, description, time_text, notif_group, unread, asset_tag, actionable)
VALUES
  ('NT-2001','maintenance','Maintenance Approved','Toyota Innova (AF-0003) maintenance request approved.','2h ago','TODAY',TRUE,'AF-0003',TRUE),
  ('NT-2002','booking','Booking Pending Approval','Room B2 requested by Anita Rao for Jul 14, 9:30 AM.','5h ago','TODAY',TRUE,NULL,TRUE)
ON DUPLICATE KEY UPDATE id = id;
