/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  HelpCircle,
  X,
  Car,
  Building,
  Wrench,
  Sparkles,
  Info
} from "lucide-react";
import { Reservation } from "../types";

interface ResourceBookingScreenProps {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
}

export default function ResourceBookingScreen({
  reservations,
  setReservations
}: ResourceBookingScreenProps) {
  
  // Local booking form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    resourceType: "Meeting Rooms",
    specificAsset: "Conference Room A",
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    purpose: "",
    bookedBy: "Marcus Chen"
  });

  // Resource assets options helper
  const resourceOptionsMap: Record<string, string[]> = {
    "Meeting Rooms": ["Conference Room A", "Creative Innovation Lounge", "Executive Boardroom", "Phone Booth 02B"],
    "Company Vehicles": ["Tesla Model 3 - Unit 42", "Ford Transit Utility Van", "Chevrolet Bolt EV - Unit 12"],
    "Field Equipment": ["High-Spec Drone Unit 4", "Thermal Imaging Camera Suite", "Field Oscilloscope Pro"],
  };

  const handleResourceTypeChange = (type: string) => {
    setNewBooking(prev => ({
      ...prev,
      resourceType: type,
      specificAsset: resourceOptionsMap[type]?.[0] || ""
    }));
  };

  // Submit Booking handler
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.purpose) {
      alert("Please state the purpose of reservation.");
      return;
    }

    const created: Reservation = {
      id: `RES-NEW-${Math.floor(100 + Math.random() * 900)}`,
      resourceType: newBooking.resourceType,
      specificAsset: newBooking.specificAsset,
      date: newBooking.date,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      purpose: newBooking.purpose,
      bookedBy: newBooking.bookedBy,
      bookedByAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuBQiDmQBAjCFHzREiYAU2iy2QmplS-VUAEkS-i5991Fa9AwWm63DJLM1_pd2-9hDy9CEkyof0W1MWTt-ESO9th5V6WpNRjloESfp5JP6l5HlT8wU-jqZ04ui1gtCoa-zYCF1QNO2-3bzDIRm2WZ6Dpf7kRwx9eMPYai4v8jTl_CilILyShdqrKrXoCjeB2GyeWxZwsuRxU1bG0xPCeWccU6NuanviwpyVgn1nKyM4bACTMpo8CMpeqQ",
      status: "Active"
    };

    setReservations(prev => [created, ...prev]);
    setIsFormOpen(false);
    setNewBooking({
      resourceType: "Meeting Rooms",
      specificAsset: "Conference Room A",
      date: new Date().toISOString().split('T')[0],
      startTime: "09:00 AM",
      endTime: "11:00 AM",
      purpose: "",
      bookedBy: "Marcus Chen"
    });
  };

  // Action: Cancel Booking
  const handleCancelBooking = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      setReservations(prev => prev.filter(res => res.id !== id));
    }
  };

  // Helper for resource visual badges
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "Company Vehicles":
        return <Car className="h-4 w-4 text-indigo-500" />;
      case "Meeting Rooms":
        return <Building className="h-4 w-4 text-emerald-500" />;
      default:
        return <Wrench className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div id="booking-view" className="space-y-6">
      
      {/* Header and trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Shared Resource Reservation</h2>
          <p className="text-sm text-slate-500">Book corporate vehicles, smart meeting rooms, and special scientific instrumentation.</p>
        </div>
        <button
          id="trigger-booking-modal"
          onClick={() => setIsFormOpen(true)}
          className="bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Reserve A Resource
        </button>
      </div>

      {/* Main Reservation Timeline Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Dynamic Calendar Grid info */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-fit space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            Scheduling Calendars
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            Reservations are processed in real-time. Priority routing is granted to critical project allocations.
          </p>

          {/* Micro stats */}
          <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-semibold">Active Bookings Today</span>
              <span className="font-mono text-slate-900 font-bold">
                {reservations.filter(r => r.status === "Active").length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-semibold">Pending Approvals</span>
              <span className="font-mono text-amber-600 font-bold">
                {reservations.filter(r => r.status === "Pending").length}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-teal-50/50 border border-teal-200/50 rounded-lg flex gap-3">
            <Sparkles className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-800">Auto-Conflicts Resolution</p>
              <p className="text-[10px] text-slate-500 leading-normal">Our system alerts you if consecutive bookings overlap by less than 15 minutes.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Reservation List (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">Active Reservation Schedule</h3>
            <span className="text-[10px] font-mono text-slate-400">Chronological ledger</span>
          </div>

          <div className="space-y-4">
            {reservations.map((res) => (
              <div 
                key={res.id} 
                id={`reservation-card-${res.id.toLowerCase()}`}
                className="p-4 border border-slate-150 rounded-xl bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                
                {/* Resource Info */}
                <div className="flex items-start gap-3.5">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-600 shadow-2xs shrink-0">
                    {getResourceIcon(res.resourceType)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{res.specificAsset}</h4>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium">{res.resourceType}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{res.purpose}</p>
                    
                    {/* Booked By row */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <img 
                        src={res.bookedByAvatar} 
                        alt={res.bookedBy} 
                        className="h-5 w-5 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[11px] font-semibold text-slate-600">{res.bookedBy} &bull; Supervisor</span>
                    </div>
                  </div>
                </div>

                {/* Reservation Timeline status & actions */}
                <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="text-left sm:text-right font-mono">
                    <p className="text-xs font-bold text-slate-800">{res.date}</p>
                    <p className="text-[10px] text-slate-500">{res.startTime} - {res.endTime}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      res.status === "Active" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {res.status}
                    </span>

                    <button
                      onClick={() => handleCancelBooking(res.id)}
                      className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Cancel Booking"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}

            {reservations.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <CalendarDays className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-slate-600">No reservations currently active.</p>
                <p className="text-xs text-slate-400 mt-1">Click "Reserve A Resource" to schedule a resource.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* MODAL 2: RESOURCE BOOKING FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Schedule Organizational Resource</h3>
                <p className="text-xs text-slate-400">Reserve rooms, electric fleet vehicles, or specialized gear.</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
              
              {/* Type selection */}
              <div className="space-y-1">
                <label htmlFor="booking-resource-type" className="text-xs font-bold text-slate-600">Resource Category</label>
                <select
                  id="booking-resource-type"
                  value={newBooking.resourceType}
                  onChange={(e) => handleResourceTypeChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                >
                  <option value="Meeting Rooms">Meeting Rooms & Workspaces</option>
                  <option value="Company Vehicles">Corporate Fleet Vehicles</option>
                  <option value="Field Equipment">Scientific & Field Equipment</option>
                </select>
              </div>

              {/* Specific resource item selection */}
              <div className="space-y-1">
                <label htmlFor="booking-specific-asset" className="text-xs font-bold text-slate-600">Select Specific Asset</label>
                <select
                  id="booking-specific-asset"
                  value={newBooking.specificAsset}
                  onChange={(e) => setNewBooking(prev => ({ ...prev, specificAsset: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-medium"
                >
                  {resourceOptionsMap[newBooking.resourceType]?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Date & times */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label htmlFor="booking-date" className="text-xs font-bold text-slate-600">Target Date</label>
                  <input
                    id="booking-date"
                    type="date"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="booking-start" className="text-xs font-bold text-slate-600">Start Time</label>
                  <select
                    id="booking-start"
                    value={newBooking.startTime}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="booking-end" className="text-xs font-bold text-slate-600">End Time</label>
                  <select
                    id="booking-end"
                    value={newBooking.endTime}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1">
                <label htmlFor="booking-purpose" className="text-xs font-bold text-slate-600">Operational Purpose *</label>
                <input
                  id="booking-purpose"
                  type="text"
                  required
                  value={newBooking.purpose}
                  onChange={(e) => setNewBooking(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="e.g. Onsite calibration of customer prototypes."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-booking-reservation"
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md"
                >
                  Confirm Reservation
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
