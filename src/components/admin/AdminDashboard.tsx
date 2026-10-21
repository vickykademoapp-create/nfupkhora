import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Shield,
  BookOpen,
  Calendar,
  BarChart3,
  Plus,
  Download,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Edit2,
  Trash2,
  Megaphone,
  Sparkles,
  Lock,
  Layers,
} from 'lucide-react';
import { User, Course, CourseCategory, Batch, UserRole } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    courses,
    batches,
    attendanceRecords,
    addUserByAdmin,
    toggleUserStatus,
    addCourse,
    addBatch,
    addAnnouncement,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'users' | 'courses' | 'batches' | 'reports'>('users');

  // Add User Form Modal
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [newUserBatch, setNewUserBatch] = useState('batch-2026-a1');
  const [userSuccessNotice, setUserSuccessNotice] = useState('');

  // Add Course Modal
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<CourseCategory>('MS Word, Excel, and PowerPoint');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDurationHrs, setCourseDurationHrs] = useState(40);
  const [courseDurationWeeks, setCourseDurationWeeks] = useState(6);
  const [courseLevel, setCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [courseNotice, setCourseNotice] = useState('');

  // Add Batch Modal
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchTiming, setBatchTiming] = useState('10:00 AM - 02:00 PM');
  const [batchRoom, setBatchRoom] = useState('Computer Lab 2');
  const [batchNotice, setBatchNotice] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-red-200 text-center space-y-4">
        <Lock className="w-12 h-12 text-red-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Administrator Access Restricted</h2>
        <p className="text-xs text-slate-600">
          You must be signed in with an authorized Administrator profile to manage accounts, courses, and center reports.
        </p>
      </div>
    );
  }

  // Calculate high level metrics
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalTeachers = users.filter(u => u.role === 'teacher').length;
  const activeUsersCount = users.filter(u => u.status === 'active').length;
  
  // Center average attendance
  const totalAttendanceEntries = attendanceRecords.length;
  const attendedCount = attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const centerAttendanceRate = totalAttendanceEntries > 0 ? Math.round((attendedCount / totalAttendanceEntries) * 100) : 92;

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUserByAdmin({
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone,
      role: newUserRole,
      avatar: newUserRole === 'student'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      studentId: newUserRole === 'student' ? `NF-2026-STU${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      teacherId: newUserRole === 'teacher' ? `NF-FAC-${Math.floor(100 + Math.random() * 900)}` : undefined,
      batchId: newUserRole === 'student' ? newUserBatch : undefined,
      batchName: newUserRole === 'student' ? batches.find(b => b.id === newUserBatch)?.name : undefined,
      centerLocation: 'Delhi NCR Hub, Sector 62',
      status: 'active',
    });

    setUserSuccessNotice(`Account created for ${newUserName} (${newUserRole.toUpperCase()}).`);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setTimeout(() => {
      setUserSuccessNotice('');
      setIsAddUserOpen(false);
    }, 1200);
  };

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCourse({
      title: courseTitle,
      category: courseCategory,
      description: courseDesc,
      durationHours: Number(courseDurationHrs),
      durationWeeks: Number(courseDurationWeeks),
      level: courseLevel,
      instructorId: 'user-tch-1',
      instructorName: 'Rajesh Kumar',
      thumbnail: '/src/assets/images/course_computer_lab_1792580770523.jpg',
      enrolledStudentIds: ['user-stu-1', 'user-stu-2'],
      certificateIssuedToStudentIds: [],
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          title: 'Module 1: Core Fundamentals & Practical Workflow',
          description: 'Hands-on practical training and workplace foundations.',
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: 'Getting Started: Core Overview',
              durationMinutes: 30,
              content: 'Foundational introduction to curriculum tools, concepts, and keyboard shortcuts.',
              keyTakeaways: ['Practice daily on center computer workstations.'],
              completedByStudentIds: [],
            },
          ],
        },
      ],
    });

    setCourseNotice(`Course "${courseTitle}" published to catalog.`);
    setCourseTitle('');
    setCourseDesc('');
    setTimeout(() => {
      setCourseNotice('');
      setIsAddCourseOpen(false);
    }, 1200);
  };

  const handleAddBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBatch({
      name: batchName,
      timing: batchTiming,
      room: batchRoom,
      studentCount: 0,
      teacherId: 'user-tch-1',
      teacherName: 'Rajesh Kumar',
    });
    setBatchNotice(`Batch "${batchName}" created.`);
    setBatchName('');
    setTimeout(() => {
      setBatchNotice('');
      setIsAddBatchOpen(false);
    }, 1200);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Student Name,Student ID,Email,Batch,Attendance %,Status']
        .concat(
          users
            .filter(u => u.role === 'student')
            .map(s => `${s.name},${s.studentId || 'N/A'},${s.email},"${s.batchName || ''}",88%,${s.status}`)
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'NIIT_Foundation_Enrollment_Report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Sample Data Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center justify-between text-xs text-indigo-950">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong className="font-semibold">Center Administration Console:</strong> Signed in as{' '}
            <strong className="font-semibold">{currentUser.name}</strong> (Center Director). You have full permissions to manage users, add courses, and export enrollment reports.
          </span>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase text-blue-700 tracking-wider">
            NIIT Foundation Administration
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Center Operations & Governance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Delhi NCR Vocational Skill Training Center · Hub 62
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSection('users')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeSection === 'users'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveSection('courses')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeSection === 'courses'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveSection('batches')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeSection === 'batches'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Batches ({batches.length})
          </button>
          <button
            onClick={() => setActiveSection('reports')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeSection === 'reports'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Reports & Export
          </button>
        </div>
      </div>

      {/* KPI Dashboard Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Enrolled Students</div>
          <div className="text-3xl font-black text-blue-950 tabular-nums">{totalStudents}</div>
          <div className="text-[11px] text-slate-400 mt-2">Active across 2 lab batches</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Faculty & Trainers</div>
          <div className="text-3xl font-black text-indigo-700 tabular-nums">{totalTeachers}</div>
          <div className="text-[11px] text-slate-400 mt-2">Certified vocational trainers</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Center Attendance Rate</div>
          <div className="text-3xl font-black text-emerald-700 tabular-nums">
            {centerAttendanceRate}%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-2">
            Target exceeded (&gt; 75%)
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Approved Curriculum</div>
          <div className="text-3xl font-black text-amber-600 tabular-nums">{courses.length}</div>
          <div className="text-[11px] text-slate-400 mt-2">Vocational skill programs</div>
        </div>
      </div>

      {/* SECTION 1: USERS MANAGEMENT */}
      {activeSection === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Manage Students & Staff Accounts</h3>
              <p className="text-xs text-slate-500">
                Grant or revoke center access and assign students to vocational batches.
              </p>
            </div>
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add New Student / Staff</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">ID Code</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Batch Assignment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <img
                        src={u.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-semibold text-slate-900">{u.name}</span>
                    </td>
                    <td className="py-3 px-4 uppercase font-bold text-[10px] text-blue-900">
                      {u.role}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {u.studentId || u.teacherId || 'ADMIN'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4 text-slate-500">{u.batchName || 'General Staff'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          u.status === 'active' ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {u.status === 'active' ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className="text-xs font-semibold text-blue-700 hover:underline"
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: COURSES MANAGEMENT */}
      {activeSection === 'courses' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Vocational Course Catalog</h3>
              <p className="text-xs text-slate-500">Add or modify curriculum modules and requirements.</p>
            </div>
            <button
              onClick={() => setIsAddCourseOpen(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {courses.map(course => (
              <div
                key={course.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="text-[10px] uppercase font-bold text-blue-700">
                  {course.category}
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{course.title}</h4>
                <p className="text-slate-500 line-clamp-2">{course.description}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-500">
                  <span>{course.durationHours} hrs ({course.durationWeeks} wks)</span>
                  <span className="font-semibold text-slate-700">{course.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: BATCHES */}
      {activeSection === 'batches' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Class Batches & Rooms</h3>
              <p className="text-xs text-slate-500">Manage laboratory schedules and seat allocations.</p>
            </div>
            <button
              onClick={() => setIsAddBatchOpen(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Batch</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {batches.map(b => (
              <div
                key={b.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
                  <span className="font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    {b.studentCount} Students
                  </span>
                </div>
                <div className="text-slate-600">Timing: <strong>{b.timing}</strong></div>
                <div className="text-slate-600">Assigned Room: <strong>{b.room}</strong></div>
                <div className="text-slate-600">Lead Trainer: <strong>{b.teacherName}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: REPORTS & CSV EXPORT */}
      {activeSection === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Center Analytics & Enrollment Summary</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate standardized compliance reports for NIIT Foundation regional leadership and CSR sponsors.
            </p>
          </div>

          <div className="p-5 bg-blue-50/60 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-blue-950">Student Roster & Attendance Export</h4>
              <p className="text-xs text-blue-900/80 mt-1">
                Download verified enrollment details, course completion percentages, and eligibility status in CSV format.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Report</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 text-xs space-y-1">
              <span className="font-bold text-slate-800">Placement Assessment Eligibility</span>
              <p className="text-slate-500">
                88% of enrolled students currently exceed the 75% attendance criterion and are eligible for the upcoming November corporate placement drive.
              </p>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 text-xs space-y-1">
              <span className="font-bold text-slate-800">Computer Lab Utilization</span>
              <p className="text-slate-500">
                Computer Lab 1 operates at 92% workstation capacity during morning lab slots (09:00 AM - 01:00 PM).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Add Student / Staff Account</h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-3.5 text-xs">
              {userSuccessNotice && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-semibold">
                  {userSuccessNotice}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  required
                  placeholder="e.g. Meera Joshi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  required
                  placeholder="meera@student.niit.org"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newUserPhone}
                  onChange={e => setNewUserPhone(e.target.value)}
                  required
                  placeholder="+91 98765 11223"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Role</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher / Faculty</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {newUserRole === 'student' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Batch</label>
                  <select
                    value={newUserBatch}
                    onChange={e => setNewUserBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-sm"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD COURSE MODAL */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Add New Vocational Course</h3>
              <button
                onClick={() => setIsAddCourseOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  required
                  placeholder="e.g. Advanced Financial Modeling in Excel"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={courseCategory}
                  onChange={e => setCourseCategory(e.target.value as CourseCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="MS Word, Excel, and PowerPoint">MS Word, Excel, and PowerPoint</option>
                  <option value="Digital Literacy">Digital Literacy</option>
                  <option value="Spoken English">Spoken English</option>
                  <option value="Basic Computer Training">Basic Computer Training</option>
                  <option value="Communication Skills">Communication Skills</option>
                  <option value="Career and Interview Preparation">Career and Interview Preparation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    value={courseDurationHrs}
                    onChange={e => setCourseDurationHrs(Number(e.target.value))}
                    required
                    min={10}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={courseDurationWeeks}
                    onChange={e => setCourseDurationWeeks(Number(e.target.value))}
                    required
                    min={1}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={courseDesc}
                  onChange={e => setCourseDesc(e.target.value)}
                  required
                  rows={3}
                  placeholder="Vocational competencies and practical learning objectives..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCourseOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-sm"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD BATCH MODAL */}
      {isAddBatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Create New Batch</h3>
              <button
                onClick={() => setIsAddBatchOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBatchSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Identifier</label>
                <input
                  type="text"
                  value={batchName}
                  onChange={e => setBatchName(e.target.value)}
                  required
                  placeholder="e.g. Batch 2026-C3 (Evening IT Skills)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Daily Schedule Timing</label>
                <input
                  type="text"
                  value={batchTiming}
                  onChange={e => setBatchTiming(e.target.value)}
                  required
                  placeholder="04:00 PM - 07:00 PM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Room or Computer Lab</label>
                <input
                  type="text"
                  value={batchRoom}
                  onChange={e => setBatchRoom(e.target.value)}
                  required
                  placeholder="Computer Lab 2"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddBatchOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-sm"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
