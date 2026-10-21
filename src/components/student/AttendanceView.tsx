import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  Filter,
  Info,
} from 'lucide-react';
import { AttendanceStatus } from '../../types';

export const AttendanceView: React.FC = () => {
  const { currentUser, attendanceRecords, courses, getStudentAttendanceStats } = useApp();
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('All');

  if (!currentUser) return null;

  const userRecords = attendanceRecords.filter(r => r.studentId === currentUser.id);
  const filteredRecords = userRecords.filter(r =>
    selectedCourseFilter === 'All' ? true : r.courseId === selectedCourseFilter
  );

  const stats = getStudentAttendanceStats(currentUser.id);

  const presentCount = userRecords.filter(r => r.status === 'present').length;
  const lateCount = userRecords.filter(r => r.status === 'late').length;
  const absentCount = userRecords.filter(r => r.status === 'absent').length;

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Present
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Late
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center gap-1 text-red-700 font-semibold text-xs">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Absent
          </span>
        );
      case 'excused':
        return (
          <span className="inline-flex items-center gap-1 text-blue-700 font-semibold text-xs">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            Excused Leave
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Title & Role Policy Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Attendance Records</h1>
          <p className="text-xs text-slate-500 mt-1">
            Official daily attendance logs submitted by your NIIT Foundation instructors.
          </p>
        </div>

        {/* Read-Only Student Policy Notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
          <span>Read-Only View · Verified by Center Faculty</span>
        </div>
      </div>

      {/* Stats KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Attendance Percentage */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Cumulative Attendance</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tabular-nums text-slate-900">
              {stats.percentage}%
            </span>
            <span className={`text-xs font-bold ${stats.isEligible ? 'text-emerald-600' : 'text-amber-600'}`}>
              {stats.isEligible ? 'Eligible' : 'Action Required'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                stats.percentage >= 75 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Required benchmark: 75%</div>
        </div>

        {/* Present Days */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Sessions Present</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black tabular-nums text-emerald-700">{presentCount}</span>
            <span className="text-xs text-slate-400">/ {userRecords.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Full laboratory attendance recorded.</p>
        </div>

        {/* Late Days */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Late Arrivals</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black tabular-nums text-amber-700">{lateCount}</span>
            <span className="text-xs text-slate-400">sessions</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Recorded with trainer remark.</p>
        </div>

        {/* Absent Days */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Absences</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black tabular-nums text-red-700">{absentCount}</span>
            <span className="text-xs text-slate-400">days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Unattended class sessions.</p>
        </div>

      </div>

      {/* Filter and Historical Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        
        {/* Table Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">Session Attendance Log</h2>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCourseFilter}
              onChange={e => setSelectedCourseFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Trainer Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No attendance records found for this selection.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {record.date}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {record.courseName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {currentUser.batchName}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {record.remarks || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredRecords.length} recorded class sessions</span>
          <span className="text-[11px] text-slate-400">
            For attendance corrections, please consult Trainer Rajesh Kumar in Lab 1.
          </span>
        </div>

      </div>

    </div>
  );
};
