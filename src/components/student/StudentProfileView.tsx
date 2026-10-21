import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  Edit3,
  ShieldCheck,
  BookOpen,
  CalendarCheck,
  X,
  Save,
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const {
    currentUser,
    courses,
    updateProfile,
    getStudentAttendanceStats,
    setActiveCertificateCourse,
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [emergencyContact, setEmergencyContact] = useState(currentUser?.emergencyContact || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  if (!currentUser) return null;

  const attendanceStats = getStudentAttendanceStats(currentUser.id);
  const enrolledCourses = courses.filter(c => c.enrolledStudentIds.includes(currentUser.id));
  const earnedCertificates = courses.filter(c =>
    c.certificateIssuedToStudentIds.includes(currentUser.id)
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      phone,
      emergencyContact,
      bio,
      avatar,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md ring-2 ring-slate-200"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{currentUser.name}</h1>
                <span className="text-[11px] font-mono font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                  {currentUser.studentId || 'NF-2026-STU8492'}
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">{currentUser.batchName}</p>
              <p className="text-xs text-slate-600 max-w-lg pt-1 leading-relaxed">
                {currentUser.bio || 'Vocational student enrolled at NIIT Foundation Center.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.email}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.phone}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.centerLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Action */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Grid: Academic Summary & Earned Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Academic Details & Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Enrollment and Verification Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Student Center Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Enrollment Date</span>
                <strong className="text-slate-900 font-semibold text-sm">{currentUser.enrollmentDate}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Assigned Center Hub</span>
                <strong className="text-slate-900 font-semibold text-sm">{currentUser.centerLocation}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Academic Batch</span>
                <strong className="text-slate-900 font-semibold text-sm">{currentUser.batchName}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Emergency Contact</span>
                <strong className="text-slate-900 font-semibold text-sm">{currentUser.emergencyContact || 'Not recorded'}</strong>
              </div>
            </div>
          </div>

          {/* Enrolled Courses Curriculum */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Enrolled Curriculum & Progress
            </h2>

            <div className="space-y-3">
              {enrolledCourses.map(course => {
                let total = 0;
                let done = 0;
                course.modules.forEach(m => {
                  m.lessons.forEach(l => {
                    total++;
                    if (l.completedByStudentIds.includes(currentUser.id)) done++;
                  });
                });
                const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-blue-700 uppercase">
                        {course.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{course.title}</h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {done} of {total} lessons completed
                      </div>
                    </div>

                    <div className="sm:w-48">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>Progress</span>
                        <span className="font-bold tabular-nums text-slate-900">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-700 h-full rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Attendance & Certificates */}
        <div className="space-y-6">
          
          {/* Attendance KPI Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Attendance Standing</h3>
              <CalendarCheck className="w-4 h-4 text-blue-700" />
            </div>
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-center">
              <span className="text-3xl font-black text-blue-950 tabular-nums">
                {attendanceStats.percentage}%
              </span>
              <div className="text-xs text-blue-800 font-semibold mt-1">
                {attendanceStats.attended} of {attendanceStats.total} Sessions Attended
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Meets official 75% placement examination threshold.</span>
            </div>
          </div>

          {/* Earned Certificate Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">NIIT Certificates</h3>
              <Award className="w-4 h-4 text-amber-500" />
            </div>

            {earnedCertificates.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                Complete all course lessons and maintain 75% attendance to unlock your verified credential.
              </p>
            ) : (
              earnedCertificates.map(course => (
                <div
                  key={course.id}
                  className="p-3.5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border border-amber-300 rounded-xl"
                >
                  <div className="text-[10px] uppercase font-bold text-amber-800">Verified Certificate</div>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{course.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Credential ID: <span className="font-mono text-slate-700">NF-CERT-2026-849201</span>
                  </p>
                  <button
                    onClick={() => setActiveCertificateCourse(course)}
                    className="mt-3 w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Official Certificate</span>
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Edit Student Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emergency Contact (Parent / Guardian)
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  placeholder="+91 98111 22334 (Father)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Learning Bio & Career Goals
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
