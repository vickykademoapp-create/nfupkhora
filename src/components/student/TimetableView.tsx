import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Filter,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';

const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const TimetableView: React.FC = () => {
  const { timetable, currentUser } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('All');

  const filteredSlots = timetable.filter(
    slot => selectedDay === 'All' || slot.dayOfWeek === selectedDay
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Weekly Class Schedule</h1>
          <p className="text-xs text-slate-500 mt-1">
            Official timetable for {currentUser?.batchName || 'Batch 2026-A1'} at the Delhi NCR Center.
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSlots.map(slot => (
          <div
            key={slot.id}
            className={`rounded-2xl border p-5 transition-all shadow-sm flex flex-col justify-between ${
              slot.isToday
                ? 'bg-gradient-to-br from-blue-50/80 to-white border-blue-300 ring-2 ring-blue-500/10'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              {/* Day & Time header */}
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className={`px-2.5 py-0.5 rounded-md ${slot.isToday ? 'bg-blue-700 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}>
                  {slot.dayOfWeek} {slot.isToday && '· Today'}
                </span>
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>

              {/* Course Title */}
              <h3 className="text-base font-bold text-slate-900 mt-2">
                {slot.courseName}
              </h3>

              {/* Location & Teacher */}
              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium text-slate-800">{slot.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Trainer: <strong className="text-slate-800">{slot.teacherName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Batch: {slot.batchName}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Lab attendance mandatory</span>
              <span className={`font-semibold ${slot.isToday ? 'text-blue-700' : 'text-slate-500'}`}>
                {slot.isToday ? 'Class in Progress' : 'Upcoming Session'}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
