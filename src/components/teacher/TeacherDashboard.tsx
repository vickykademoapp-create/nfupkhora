import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CalendarCheck,
  CheckSquare,
  FileText,
  Upload,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Sparkles,
  BookOpen,
  Megaphone,
} from 'lucide-react';
import { AttendanceStatus, AssignmentSubmission } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    courses,
    batches,
    attendanceRecords,
    assignments,
    submissions,
    saveAttendanceRecord,
    createAssignment,
    gradeSubmission,
    addStudyMaterial,
    addAnnouncement,
    activeTab,
    setActiveTab,
  } = useApp();

  // Internal tab state if navigated from header or internal pills
  const [currentSection, setCurrentSection] = useState<
    'overview' | 'attendance' | 'grading' | 'create_assignment' | 'materials' | 'announcements'
  >('overview');

  // Attendance Marking State
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'course-1');
  const [selectedBatchId, setSelectedBatchId] = useState('batch-2026-a1');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  // Student roster for selected batch
  const studentsInBatch = users.filter(u => u.role === 'student' && u.batchId === selectedBatchId);

  // Attendance status mapping for the form
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [attendanceSavedNotice, setAttendanceSavedNotice] = useState('');

  // Assignment Creation Form State
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignCourseId, setNewAssignCourseId] = useState(courses[0]?.id || 'course-1');
  const [newAssignDueDate, setNewAssignDueDate] = useState('2026-11-05');
  const [newAssignMarks, setNewAssignMarks] = useState(20);
  const [newAssignInstructions, setNewAssignInstructions] = useState('');
  const [assignCreatedNotice, setAssignCreatedNotice] = useState('');

  // Grading Modal State
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [awardedMarks, setAwardedMarks] = useState<number>(18);
  const [gradingFeedback, setGradingFeedback] = useState('');

  // Study Material Form State
  const [matTitle, setMatTitle] = useState('');
  const [matCourseId, setMatCourseId] = useState(courses[0]?.id || 'course-1');
  const [matCategory, setMatCategory] = useState('Cheat Sheet');
  const [matDescription, setMatDescription] = useState('');
  const [matNotice, setMatNotice] = useState('');

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annIsImportant, setAnnIsImportant] = useState(false);
  const [annNotice, setAnnNotice] = useState('');

  if (!currentUser) return null;

  // Initialize or toggle attendance
  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        status,
        remarks: prev[studentId]?.remarks || '',
      },
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    studentsInBatch.forEach(stu => {
      updated[stu.id] = { status: 'present', remarks: 'Attended session' };
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const courseObj = courses.find(c => c.id === selectedCourseId);
    const courseName = courseObj ? courseObj.title : 'Vocational Training';

    const entries = studentsInBatch.map(stu => {
      const studentState = attendanceMap[stu.id] || { status: 'present' as AttendanceStatus, remarks: '' };
      return {
        studentId: stu.id,
        studentName: stu.name,
        date: attendanceDate,
        courseId: selectedCourseId,
        courseName,
        batchId: selectedBatchId,
        status: studentState.status,
        markedByTeacherId: currentUser.id,
        remarks: studentState.remarks,
      };
    });

    saveAttendanceRecord(entries);
    setAttendanceSavedNotice(`Attendance for ${entries.length} students on ${attendanceDate} saved successfully.`);
    setTimeout(() => setAttendanceSavedNotice(''), 3000);
  };

  const handleCreateAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseObj = courses.find(c => c.id === newAssignCourseId);
    createAssignment({
      courseId: newAssignCourseId,
      courseName: courseObj ? courseObj.title : 'Vocational Course',
      title: newAssignTitle,
      instructions: newAssignInstructions,
      dueDate: newAssignDueDate,
      maxMarks: Number(newAssignMarks),
      batchId: selectedBatchId,
    });
    setAssignCreatedNotice(`Assignment "${newAssignTitle}" created and notified to all enrolled students.`);
    setNewAssignTitle('');
    setNewAssignInstructions('');
    setTimeout(() => setAssignCreatedNotice(''), 3000);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    gradeSubmission(gradingSubmission.id, Number(awardedMarks), gradingFeedback);
    setGradingSubmission(null);
  };

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseObj = courses.find(c => c.id === matCourseId);
    addStudyMaterial({
      courseId: matCourseId,
      courseName: courseObj ? courseObj.title : 'Course',
      title: matTitle,
      description: matDescription,
      category: matCategory,
      fileSize: '1.8 MB',
      downloadUrl: '#',
    });
    setMatNotice(`Material "${matTitle}" added for student access.`);
    setMatTitle('');
    setMatDescription('');
    setTimeout(() => setMatNotice(''), 3000);
  };

  const handlePostAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      title: annTitle,
      content: annContent,
      targetRole: 'students',
      targetBatchId: selectedBatchId,
      isImportant: annIsImportant,
    });
    setAnnNotice('Announcement broadcasted to student portal.');
    setAnnTitle('');
    setAnnContent('');
    setTimeout(() => setAnnNotice(''), 3000);
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Sample Data Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong className="font-semibold">Faculty Portal (Demo Mode):</strong> Logged in as{' '}
            <strong className="font-semibold">{currentUser.name}</strong> ({currentUser.teacherId || 'Lead IT Trainer'}). You can record student attendance, create tasks, and grade submissions.
          </span>
        </div>
      </div>

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase text-blue-700 tracking-wider">
            NIIT Foundation Academic Faculty
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Trainer Dashboard & Class Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Assigned Batches: {batches.map(b => b.name).join(' · ')}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setCurrentSection('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentSection === 'overview'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentSection('attendance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentSection === 'attendance'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setCurrentSection('grading')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentSection === 'grading'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Submissions ({pendingSubmissions.length})
          </button>
          <button
            onClick={() => setCurrentSection('create_assignment')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentSection === 'create_assignment'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Create Assignment
          </button>
          <button
            onClick={() => setCurrentSection('materials')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentSection === 'materials'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Upload Notes
          </button>
          <button
            onClick={() => setCurrentSection('announcements')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentSection === 'announcements'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Post Notice
          </button>
        </div>
      </div>

      {/* SECTION 1: OVERVIEW */}
      {currentSection === 'overview' && (
        <div className="space-y-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">Assigned Students</div>
              <div className="text-3xl font-black text-slate-900 tabular-nums">
                {users.filter(u => u.role === 'student').length}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">Active in Morning & Afternoon Batches</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">Today's Class Sessions</div>
              <div className="text-3xl font-black text-blue-700 tabular-nums">2</div>
              <div className="text-[11px] text-slate-400 mt-2">Computer Lab 1 & Seminar Hall</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">Submissions to Grade</div>
              <div className="text-3xl font-black text-amber-600 tabular-nums">
                {pendingSubmissions.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">Awaiting rubric feedback</div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">Active Curriculum</div>
              <div className="text-3xl font-black text-emerald-700 tabular-nums">
                {courses.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">Vocational learning tracks</div>
            </div>
          </div>

          {/* Assigned Students Roster */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Assigned Students Roster</h3>
                <p className="text-xs text-slate-500">Students enrolled under your mentorship.</p>
              </div>
              <button
                onClick={() => setCurrentSection('attendance')}
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Take Attendance Now
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Batch</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {studentsInBatch.map(stu => (
                    <tr key={stu.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 flex items-center gap-2.5">
                        <img
                          src={stu.avatar}
                          alt={stu.name}
                          className="w-7 h-7 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-semibold text-slate-900">{stu.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{stu.studentId}</td>
                      <td className="py-3 px-4 text-slate-600">{stu.batchName}</td>
                      <td className="py-3 px-4 text-slate-500">{stu.phone}</td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-700 font-bold">Active Enrolled</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: ATTENDANCE MANAGEMENT */}
      {currentSection === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Record Daily Student Attendance</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select class date, course module, and batch. Mark Present, Absent, or Late for each student.
            </p>
          </div>

          {attendanceSavedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{attendanceSavedNotice}</span>
            </div>
          )}

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class Date
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={e => setAttendanceDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Session
              </label>
              <select
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Batch
              </label>
              <select
                value={selectedBatchId}
                onChange={e => setSelectedBatchId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Roster: {studentsInBatch.length} students enrolled in this batch
            </span>
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Mark All Present
            </button>
          </div>

          {/* Attendance Roster Form */}
          <form onSubmit={handleSaveAttendance}>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Attendance Status</th>
                    <th className="py-3 px-4">Remarks (Optional)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsInBatch.map(stu => {
                    const current = attendanceMap[stu.id] || { status: 'present', remarks: '' };
                    return (
                      <tr key={stu.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                          <img
                            src={stu.avatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span>{stu.name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{stu.studentId}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setStudentStatus(stu.id, 'present')}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                                current.status === 'present'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentStatus(stu.id, 'late')}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                                current.status === 'late'
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentStatus(stu.id, 'absent')}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                                current.status === 'absent'
                                  ? 'bg-red-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="e.g. Lab exercise complete"
                            value={current.remarks}
                            onChange={e => {
                              const val = e.target.value;
                              setAttendanceMap(prev => ({
                                ...prev,
                                [stu.id]: {
                                  status: prev[stu.id]?.status || 'present',
                                  remarks: val,
                                },
                              }));
                            }}
                            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Save Official Attendance</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 3: SUBMISSIONS & GRADING */}
      {currentSection === 'grading' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Student Assignment Submissions
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Evaluate submitted student files, assign marks, and provide constructive pedagogical feedback.
            </p>

            <div className="space-y-4">
              {submissions.map(sub => {
                const assign = assignments.find(a => a.id === sub.assignmentId);
                const isGraded = sub.status === 'graded';

                return (
                  <div
                    key={sub.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{sub.studentName}</span>
                        <span>·</span>
                        <span className="text-xs text-blue-700 font-semibold">{assign?.title || 'Assignment'}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Submitted: {sub.submittedAt} · File: <strong className="text-slate-700">{sub.attachmentName}</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 italic">
                        "{sub.answerText}"
                      </div>

                      {isGraded && (
                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                          <strong>Awarded: {sub.marksAwarded} / {assign?.maxMarks || 20}</strong> — Feedback: "{sub.feedback}"
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setGradingSubmission(sub);
                          setAwardedMarks(sub.marksAwarded || 18);
                          setGradingFeedback(sub.feedback || 'Good application of practical formulas. Ensure formatting is standard.');
                        }}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>{isGraded ? 'Edit Grade' : 'Grade Submission'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: CREATE ASSIGNMENT */}
      {currentSection === 'create_assignment' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl mx-auto space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create New Course Assignment</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Assign practical exercises to students. Notifications will be triggered automatically.
            </p>
          </div>

          {assignCreatedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{assignCreatedNotice}</span>
            </div>
          )}

          <form onSubmit={handleCreateAssignmentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Course
              </label>
              <select
                value={newAssignCourseId}
                onChange={e => setNewAssignCourseId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assignment Title
              </label>
              <input
                type="text"
                value={newAssignTitle}
                onChange={e => setNewAssignTitle(e.target.value)}
                required
                placeholder="e.g. Practical Project: Creating a Sales Summary Workbook"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newAssignDueDate}
                  onChange={e => setNewAssignDueDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maximum Marks
                </label>
                <input
                  type="number"
                  value={newAssignMarks}
                  onChange={e => setNewAssignMarks(Number(e.target.value))}
                  required
                  min={5}
                  max={100}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Instructions & Lab Requirements
              </label>
              <textarea
                value={newAssignInstructions}
                onChange={e => setNewAssignInstructions(e.target.value)}
                required
                rows={4}
                placeholder="Outline the steps students must execute, what formulas to utilize, and file format required..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Assignment</span>
            </button>
          </form>
        </div>
      )}

      {/* SECTION 5: UPLOAD NOTES */}
      {currentSection === 'materials' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl mx-auto space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upload Course Study Material & Notes</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Share PDF cheat sheets, lecture presentations, and reference guides with enrolled students.
            </p>
          </div>

          {matNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{matNotice}</span>
            </div>
          )}

          <form onSubmit={handleAddMaterialSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course
              </label>
              <select
                value={matCourseId}
                onChange={e => setMatCourseId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={matTitle}
                onChange={e => setMatTitle(e.target.value)}
                required
                placeholder="e.g. Master Guide: Excel Pivot Tables & Lookup Functions"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Category
              </label>
              <select
                value={matCategory}
                onChange={e => setMatCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Cheat Sheet">Cheat Sheet</option>
                <option value="Handbook">Handbook</option>
                <option value="Study Notes">Study Notes</option>
                <option value="Interview Guide">Interview Guide</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brief Description
              </label>
              <textarea
                value={matDescription}
                onChange={e => setMatDescription(e.target.value)}
                required
                rows={3}
                placeholder="Key concepts covered in this guide..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Study Note to Portal</span>
            </button>
          </form>
        </div>
      )}

      {/* SECTION 6: ANNOUNCEMENTS */}
      {currentSection === 'announcements' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl mx-auto space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Post Batch Notice or Update</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Send notifications and updates directly to student dashboards.
            </p>
          </div>

          {annNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{annNotice}</span>
            </div>
          )}

          <form onSubmit={handlePostAnnouncementSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Announcement Headline
              </label>
              <input
                type="text"
                value={annTitle}
                onChange={e => setAnnTitle(e.target.value)}
                required
                placeholder="e.g. Additional Computer Lab Practice Session this Thursday"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notice Content
              </label>
              <textarea
                value={annContent}
                onChange={e => setAnnContent(e.target.value)}
                required
                rows={4}
                placeholder="Provide details, timings, workstation lab room, and preparation notes..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isImportant"
                checked={annIsImportant}
                onChange={e => setAnnIsImportant(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="isImportant" className="text-xs text-slate-700 font-medium">
                Mark as High Priority Alert (Highlights in gold on student dashboard)
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Broadcast Announcement</span>
            </button>
          </form>
        </div>
      )}

      {/* Grading Modal Dialog */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-amber-300">
                  Student Evaluation
                </span>
                <h3 className="text-base font-bold">Grade: {gradingSubmission.studentName}</h3>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold block text-slate-900 mb-0.5">Submitted Work:</span>
                "{gradingSubmission.answerText}"
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Marks Awarded (out of 20)
                </label>
                <input
                  type="number"
                  value={awardedMarks}
                  onChange={e => setAwardedMarks(Number(e.target.value))}
                  required
                  min={0}
                  max={20}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trainer Pedagogical Feedback
                </label>
                <textarea
                  value={gradingFeedback}
                  onChange={e => setGradingFeedback(e.target.value)}
                  required
                  rows={3}
                  placeholder="Provide constructive feedback on what the student excelled at and areas to polish..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Submit Grade & Notify Student</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
