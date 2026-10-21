import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  BookOpen,
  CalendarCheck,
  FileText,
  User,
  Users,
  CheckSquare,
  BarChart3,
  Calendar,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useApp();

  if (!currentUser) return null;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg"
      aria-label="Mobile Bottom Navigation"
      style={{ maxHeight: '64px' }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {currentUser.role === 'student' && (
          <>
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'home' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'courses' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Courses</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'attendance' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarCheck className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'assignments' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Tasks</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'profile' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Profile</span>
            </button>
          </>
        )}

        {currentUser.role === 'teacher' && (
          <>
            <button
              onClick={() => setActiveTab('teacher_dashboard')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'teacher_dashboard' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('teacher_attendance')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'teacher_attendance' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarCheck className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('teacher_assignments')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'teacher_assignments' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Grading</span>
            </button>

            <button
              onClick={() => setActiveTab('teacher_materials')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'teacher_materials' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Materials</span>
            </button>
          </>
        )}

        {currentUser.role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('admin_dashboard')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'admin_dashboard' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Center</span>
            </button>

            <button
              onClick={() => setActiveTab('admin_users')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'admin_users' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Users</span>
            </button>

            <button
              onClick={() => setActiveTab('admin_courses')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'admin_courses' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Courses</span>
            </button>

            <button
              onClick={() => setActiveTab('admin_reports')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-colors ${
                activeTab === 'admin_reports' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Reports</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
