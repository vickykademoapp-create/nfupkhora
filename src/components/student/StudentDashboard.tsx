import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  BookOpen,
  Award,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  FileText,
  Megaphone,
  Download,
  Users,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    timetable,
    assignments,
    submissions,
    announcements,
    setActiveTab,
    setActiveCertificateCourse,
    getStudentAttendanceStats,
  } = useApp();

  if (!currentUser) return null;

  const enrolledCourses = courses.filter(c => c.enrolledStudentIds.includes(currentUser.id));
  const attendanceStats = getStudentAttendanceStats(currentUser.id);
  const todayClasses = timetable.filter(t => t.isToday);

  // Active assignments not yet submitted
  const pendingAssignments = assignments.filter(
    a => !submissions.some(s => s.assignmentId === a.id && s.studentId === currentUser.id)
  );

  // Calculate course completion
  const getCourseCompletion = (course: (typeof courses)[0]) => {
    let totalLessons = 0;
    let completedLessons = 0;
    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (l.completedByStudentIds.includes(currentUser.id)) completedLessons++;
      });
    });
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  // Check if any certificate is earned
  const earnedCertificateCourses = courses.filter(c =>
    c.certificateIssuedToStudentIds.includes(currentUser.id)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Sample Data Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong className="font-semibold">Interactive Demo Mode:</strong> You are viewing sample data for{' '}
            <strong className="font-semibold">{currentUser.name}</strong> ({currentUser.studentId}). Real changes persist in your local browser session.
          </span>
        </div>
        <span className="hidden sm:inline-block text-amber-800 text-[11px] font-medium bg-amber-100/80 px-2 py-0.5 rounded">
          {currentUser.batchName}
        </span>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 overflow-hidden shadow-lg">
        {/* Abstract decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Welcome to NIIT Foundation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl">
              You are enrolled in <span className="font-semibold text-white">{enrolledCourses.length} skill development courses</span>. Continue your digital literacy modules or review today’s practical lab schedule below.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-blue-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                {currentUser.centerLocation}
              </span>
              <span>·</span>
              <span className="font-mono text-white/90">ID: {currentUser.studentId}</span>
              <span>·</span>
              <span>Enrolled: {currentUser.enrollmentDate}</span>
            </div>
          </div>

          {/* Quick Attendance & Readiness Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
              <span>Overall Attendance</span>
              <span className={attendanceStats.isEligible ? 'text-emerald-300 font-bold' : 'text-amber-300 font-bold'}>
                {attendanceStats.isEligible ? 'Eligible for Exam' : 'Needs Attention'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tabular-nums tracking-tight">
                {attendanceStats.percentage}%
              </span>
              <span className="text-xs text-blue-200">
                ({attendanceStats.attended}/{attendanceStats.total} sessions)
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  attendanceStats.percentage >= 75 ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${attendanceStats.percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-blue-200/80 mt-2">
              Minimum 75% attendance required for vocational certification and placement drive eligibility.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Schedule & Important Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Today's Schedule & Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Schedule Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-700" />
                <h2 className="text-base font-bold text-slate-900">Today's Class Schedule</h2>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayClasses.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No classes scheduled for today.</p>
            ) : (
              <div className="space-y-3">
                {todayClasses.map(slot => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-900">{slot.courseName}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {slot.location}
                        </span>
                        <span>·</span>
                        <span>Trainer: {slot.teacherName}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('courses')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shrink-0"
                    >
                      Open Lesson
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enrolled Courses with Progress */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-700" />
                <h2 className="text-base font-bold text-slate-900">My Enrolled Courses</h2>
              </div>
              <button
                onClick={() => setActiveTab('courses')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <span>View All Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolledCourses.map(course => {
                const completion = getCourseCompletion(course);
                const isCertified = course.certificateIssuedToStudentIds.includes(currentUser.id);

                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
                        {course.category}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                        <span>Progress</span>
                        <span className="font-bold tabular-nums text-slate-900">{completion}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-700 h-full rounded-full transition-all duration-300"
                          style={{ width: `${completion}%` }}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {isCertified ? (
                          <button
                            onClick={() => setActiveCertificateCourse(course)}
                            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                          >
                            <Award className="w-3.5 h-3.5" />
                            View Certificate
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            {course.durationHours} hrs · {course.durationWeeks} weeks
                          </span>
                        )}

                        <button
                          onClick={() => setActiveTab('courses')}
                          className="px-3 py-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                        >
                          Learn
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Pending Tasks, Certificate, Announcements */}
        <div className="space-y-6">
          
          {/* Certificate Highlight Card */}
          {earnedCertificateCourses.length > 0 && (
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-950">Certificate Earned!</h3>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Congratulations! You completed the vocational coursework for{' '}
                <strong className="font-semibold">{earnedCertificateCourses[0].title}</strong>.
              </p>
              <button
                onClick={() => setActiveCertificateCourse(earnedCertificateCourses[0])}
                className="mt-3 w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>View & Download Credential</span>
              </button>
            </div>
          )}

          {/* Pending Tasks & Assignments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">Assignments & Tasks</h3>
              </div>
              <span className="text-xs text-slate-500">
                {pendingAssignments.length} pending
              </span>
            </div>

            {pendingAssignments.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                <p className="text-xs font-semibold text-slate-700">All caught up!</p>
                <p className="text-[11px] text-slate-400">No overdue assignments pending.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAssignments.slice(0, 3).map(assign => (
                  <div
                    key={assign.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="text-[10px] font-semibold text-blue-700 uppercase">
                      {assign.courseName}
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
                      {assign.title}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-amber-700 font-medium">Due: {assign.dueDate}</span>
                      <button
                        onClick={() => setActiveTab('assignments')}
                        className="text-blue-700 font-semibold hover:underline"
                      >
                        Submit →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Center Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Megaphone className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Center Announcements</h3>
            </div>

            <div className="space-y-3">
              {announcements.map(ann => (
                <div
                  key={ann.id}
                  className={`p-3 rounded-xl border ${
                    ann.isImportant
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-blue-900">{ann.authorName} ({ann.authorRole})</span>
                    <span>{ann.postedDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
