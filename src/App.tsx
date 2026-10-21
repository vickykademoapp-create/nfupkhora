import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CertificateModal } from './components/CertificateModal';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';

import { StudentDashboard } from './components/student/StudentDashboard';
import { CoursesView } from './components/student/CoursesView';
import { AttendanceView } from './components/student/AttendanceView';
import { AssignmentsView } from './components/student/AssignmentsView';
import { TimetableView } from './components/student/TimetableView';
import { StudentProfileView } from './components/student/StudentProfileView';

import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { GraduationCap, Heart, HelpCircle, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, activeTab, setIsDeploymentGuideOpen } = useApp();

  const renderCurrentView = () => {
    // If not signed in
    if (!currentUser) {
      return <StudentDashboard />;
    }

    // Role-based views
    if (currentUser.role === 'teacher' || activeTab.startsWith('teacher_')) {
      return <TeacherDashboard />;
    }

    if (currentUser.role === 'admin' || activeTab.startsWith('admin_')) {
      return <AdminDashboard />;
    }

    // Student Views
    switch (activeTab) {
      case 'home':
        return <StudentDashboard />;
      case 'courses':
        return <CoursesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'timetable':
        return <TimetableView />;
      case 'profile':
        return <StudentProfileView />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 lg:pb-12">
        {renderCurrentView()}
      </main>

      {/* Global Modals & Drawers */}
      <BottomNav />
      <AuthModal />
      <NotificationDrawer />
      <CertificateModal />
      <DeploymentGuideModal />

      {/* Clean, unboxed Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            <span className="font-semibold text-slate-800">NIIT Foundation App</span>
            <span aria-hidden="true">·</span>
            <span>Empowering Youth Through Digital Literacy & Vocational Skills</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDeploymentGuideOpen(true)}
              className="text-blue-700 hover:text-blue-900 font-semibold transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Firebase & Android Guide</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Delhi NCR Regional Center</span>
            <span aria-hidden="true">·</span>
            <span>© 2026 NIIT Foundation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
