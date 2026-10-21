import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  User as UserIcon,
  LogOut,
  HelpCircle,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  Users,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    setIsAuthModalOpen,
    setIsNotificationDrawerOpen,
    setIsDeploymentGuideOpen,
    notifications,
    switchDemoUser,
    logout,
    resetDemoData,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const unreadCount = currentUser
    ? notifications.filter(n => n.userId === currentUser.id && !n.isRead).length
    : 0;

  const handleRoleSwitch = (role: UserRole) => {
    switchDemoUser(role);
    setRoleMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark with NIIT Foundation Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (currentUser?.role === 'teacher') setActiveTab('teacher_dashboard');
                else if (currentUser?.role === 'admin') setActiveTab('admin_dashboard');
                else setActiveTab('home');
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
            >
              {/* NIIT Foundation Stylized Logo Emblem */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center text-white shadow-sm shadow-blue-900/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-amber-300" />
              </div>
              <div className="leading-tight">
                <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  NIIT <span className="text-blue-700 font-extrabold">Foundation</span>
                </span>
                <span className="hidden sm:block text-[11px] font-medium text-slate-500 tracking-wide">
                  Skill Development & Digital Learning
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links for Desktop */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-600">
            {currentUser?.role === 'student' && (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'home'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'courses'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Courses
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'attendance'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Attendance
                </button>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'assignments'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Assignments & Notes
                </button>
                <button
                  onClick={() => setActiveTab('timetable')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'timetable'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Class Timetable
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Profile & Certificate
                </button>
              </>
            )}

            {currentUser?.role === 'teacher' && (
              <>
                <button
                  onClick={() => setActiveTab('teacher_dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'teacher_dashboard'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Trainer Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('teacher_attendance')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'teacher_attendance'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Mark Attendance
                </button>
                <button
                  onClick={() => setActiveTab('teacher_assignments')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'teacher_assignments'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Review & Grade Tasks
                </button>
                <button
                  onClick={() => setActiveTab('teacher_materials')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'teacher_materials'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Upload Study Notes
                </button>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('admin_dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'admin_dashboard'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Admin Overview
                </button>
                <button
                  onClick={() => setActiveTab('admin_users')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'admin_users'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Manage Users & Batches
                </button>
                <button
                  onClick={() => setActiveTab('admin_courses')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'admin_courses'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Course Curriculum
                </button>
                <button
                  onClick={() => setActiveTab('admin_reports')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'admin_reports'
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Reports & Export
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Actions (Demo Switcher, Notifications, Guides, Profile) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                title="Switch demo account role"
              >
                <span className="capitalize">{currentUser ? currentUser.role : 'Guest'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Demo Role
                    </p>
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('student')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                      currentUser?.role === 'student' ? 'text-blue-700 font-bold bg-blue-50/60' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Student View</div>
                      <div className="text-[10px] text-slate-500">Priya Sharma (NF-STU8492)</div>
                    </div>
                    {currentUser?.role === 'student' && <span className="text-blue-600 font-bold text-xs">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('teacher')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                      currentUser?.role === 'teacher' ? 'text-blue-700 font-bold bg-blue-50/60' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Teacher / Faculty View</div>
                      <div className="text-[10px] text-slate-500">Rajesh Kumar (Lead Trainer)</div>
                    </div>
                    {currentUser?.role === 'teacher' && <span className="text-blue-600 font-bold text-xs">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                      currentUser?.role === 'admin' ? 'text-blue-700 font-bold bg-blue-50/60' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Administrator View</div>
                      <div className="text-[10px] text-slate-500">Anita Verma (Center Director)</div>
                    </div>
                    {currentUser?.role === 'admin' && <span className="text-blue-600 font-bold text-xs">Active</span>}
                  </button>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        resetDemoData();
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      Reset Demo Sample Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* In-App Notifications Button with badge */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Deployment & Android Guide Button */}
            <button
              onClick={() => setIsDeploymentGuideOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Firebase Configuration & Android Packaging Instructions"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Firebase & Android Guide</span>
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden md:inline-block text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-xs font-semibold text-slate-900">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (currentUser.role === 'student') setActiveTab('profile');
                        else if (currentUser.role === 'teacher') setActiveTab('teacher_dashboard');
                        else setActiveTab('admin_dashboard');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsDeploymentGuideOpen(true);
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 sm:hidden"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      Firebase & Android Guide
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
