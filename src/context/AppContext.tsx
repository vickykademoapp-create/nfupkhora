import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Course,
  AttendanceEntry,
  Assignment,
  AssignmentSubmission,
  StudyMaterial,
  TimetableSlot,
  Announcement,
  AppNotification,
  Batch,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_BATCHES,
  INITIAL_COURSES,
  INITIAL_TIMETABLE,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  generateInitialAttendance,
} from '../data/mockData';

// Helper function to safely hash password client-side using Web Crypto API
async function hashPassword(plainText: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`niit_salt_2026_${plainText}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Basic fallback for non-crypto environments
    let hash = 0;
    for (let i = 0; i < plainText.length; i++) {
      hash = (hash << 5) - hash + plainText.charCodeAt(i);
      hash |= 0;
    }
    return `hash_${Math.abs(hash)}`;
  }
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  batches: Batch[];
  attendanceRecords: AttendanceEntry[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  studyMaterials: StudyMaterial[];
  timetable: TimetableSlot[];
  announcements: Announcement[];
  notifications: AppNotification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isDeploymentGuideOpen: boolean;
  setIsDeploymentGuideOpen: (open: boolean) => void;
  activeCertificateCourse: Course | null;
  setActiveCertificateCourse: (course: Course | null) => void;

  // Actions
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message: string }>;
  register: (userData: { name: string; email: string; phone: string; password: string; role: UserRole; batchId?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  switchDemoUser: (role: UserRole) => void;
  updateProfile: (updates: Partial<User>) => void;
  markLessonCompleted: (courseId: string, lessonId: string) => void;
  saveAttendanceRecord: (entries: Omit<AttendanceEntry, 'id'>[]) => void;
  submitAssignment: (assignmentId: string, answerText: string, attachmentName?: string) => void;
  createAssignment: (assignment: Omit<Assignment, 'id' | 'createdByTeacherId' | 'createdByName'>) => void;
  gradeSubmission: (submissionId: string, marks: number, feedback: string) => void;
  addStudyMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadedBy' | 'uploadedDate'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'authorName' | 'authorRole' | 'postedDate'>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  addBatch: (batch: Omit<Batch, 'id'>) => void;
  addUserByAdmin: (user: Omit<User, 'id'>) => void;
  toggleUserStatus: (userId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
  getStudentAttendanceStats: (studentId: string) => { total: number; attended: number; percentage: number; isEligible: boolean };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'niit_app_';

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => getStoredItem('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = getStoredItem<User | null>('currentUser', null);
    return stored || INITIAL_USERS[0]; // Default to student Priya Sharma
  });
  const [courses, setCourses] = useState<Course[]>(() => getStoredItem('courses', INITIAL_COURSES));
  const [batches, setBatches] = useState<Batch[]>(() => getStoredItem('batches', INITIAL_BATCHES));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceEntry[]>(() =>
    getStoredItem('attendance', generateInitialAttendance())
  );
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    getStoredItem('assignments', INITIAL_ASSIGNMENTS)
  );
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() =>
    getStoredItem('submissions', INITIAL_SUBMISSIONS)
  );
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() =>
    getStoredItem('studyMaterials', INITIAL_STUDY_MATERIALS)
  );
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() =>
    getStoredItem('timetable', INITIAL_TIMETABLE)
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    getStoredItem('announcements', INITIAL_ANNOUNCEMENTS)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getStoredItem('notifications', INITIAL_NOTIFICATIONS)
  );

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isDeploymentGuideOpen, setIsDeploymentGuideOpen] = useState<boolean>(false);
  const [activeCertificateCourse, setActiveCertificateCourse] = useState<Course | null>(null);

  // Sync state to LocalStorage
  useEffect(() => setStoredItem('users', users), [users]);
  useEffect(() => setStoredItem('currentUser', currentUser), [currentUser]);
  useEffect(() => setStoredItem('courses', courses), [courses]);
  useEffect(() => setStoredItem('batches', batches), [batches]);
  useEffect(() => setStoredItem('attendance', attendanceRecords), [attendanceRecords]);
  useEffect(() => setStoredItem('assignments', assignments), [assignments]);
  useEffect(() => setStoredItem('submissions', submissions), [submissions]);
  useEffect(() => setStoredItem('studyMaterials', studyMaterials), [studyMaterials]);
  useEffect(() => setStoredItem('timetable', timetable), [timetable]);
  useEffect(() => setStoredItem('announcements', announcements), [announcements]);
  useEffect(() => setStoredItem('notifications', notifications), [notifications]);

  // Handle Role switch on active tab adjustment
  useEffect(() => {
    if (currentUser?.role === 'student' && (activeTab.startsWith('teacher_') || activeTab.startsWith('admin_'))) {
      setActiveTab('home');
    } else if (currentUser?.role === 'teacher' && activeTab === 'home') {
      setActiveTab('teacher_dashboard');
    } else if (currentUser?.role === 'admin' && activeTab === 'home') {
      setActiveTab('admin_dashboard');
    }
  }, [currentUser?.role]);

  // Auth Functions
  const login = async (email: string, password: string, requestedRole?: UserRole) => {
    const trimmedEmail = email.trim().toLowerCase();
    const foundUser = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!foundUser) {
      return { success: false, message: 'No registered account found with this email. Please check your spelling or register.' };
    }

    if (foundUser.status === 'inactive') {
      return { success: false, message: 'This account has been deactivated by center administration.' };
    }

    if (requestedRole && foundUser.role !== requestedRole) {
      return { success: false, message: `This account is registered as a ${foundUser.role}, not as a ${requestedRole}.` };
    }

    // Hash check or demo password bypass
    const computedHash = await hashPassword(password);
    if (foundUser.passwordHash && foundUser.passwordHash !== computedHash && password !== 'niit123' && password !== 'password') {
      return { success: false, message: 'Incorrect password entered. For demo testing, use "niit123" or click Quick Demo Login.' };
    }

    setCurrentUser(foundUser);
    setIsAuthModalOpen(false);

    // Set appropriate initial tab
    if (foundUser.role === 'teacher') setActiveTab('teacher_dashboard');
    else if (foundUser.role === 'admin') setActiveTab('admin_dashboard');
    else setActiveTab('home');

    return { success: true, message: `Welcome back, ${foundUser.name}!` };
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    batchId?: string;
  }) => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const passwordHash = await hashPassword(userData.password);
    const newId = `user-${userData.role.substring(0, 3)}-${Date.now()}`;
    const studentIdCode = userData.role === 'student' ? `NF-2026-STU${Math.floor(1000 + Math.random() * 9000)}` : undefined;
    const teacherIdCode = userData.role === 'teacher' ? `NF-FAC-${Math.floor(100 + Math.random() * 900)}` : undefined;

    const newUser: User = {
      id: newId,
      name: userData.name.trim(),
      email: trimmedEmail,
      phone: userData.phone.trim(),
      role: userData.role,
      avatar: userData.role === 'student'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      passwordHash,
      studentId: studentIdCode,
      teacherId: teacherIdCode,
      batchId: userData.batchId || 'batch-2026-a1',
      batchName: 'Batch 2026-A1 (Morning Lab)',
      centerLocation: 'Delhi NCR Hub, Sector 62',
      enrollmentDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'active',
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);

    // Auto enroll student into primary course
    if (newUser.role === 'student') {
      setCourses(prev =>
        prev.map(c => (c.id === 'course-1' || c.id === 'course-2' ? { ...c, enrolledStudentIds: [...c.enrolledStudentIds, newUser.id] } : c))
      );
      setActiveTab('home');
    } else if (newUser.role === 'teacher') {
      setActiveTab('teacher_dashboard');
    } else {
      setActiveTab('admin_dashboard');
    }

    return { success: true, message: `Registration successful! Welcome to NIIT Foundation, ${newUser.name}.` };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    setIsAuthModalOpen(true);
  };

  const switchDemoUser = (role: UserRole) => {
    const demoUser = users.find(u => u.role === role);
    if (demoUser) {
      setCurrentUser(demoUser);
      if (role === 'teacher') setActiveTab('teacher_dashboard');
      else if (role === 'admin') setActiveTab('admin_dashboard');
      else setActiveTab('home');
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  };

  // Student Course & Lesson Progression
  const markLessonCompleted = (courseId: string, lessonId: string) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const studentId = currentUser.id;

    setCourses(prevCourses =>
      prevCourses.map(course => {
        if (course.id !== courseId) return course;

        let allLessonsCompleted = true;
        const updatedModules = course.modules.map(module => {
          const updatedLessons = module.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              const alreadyDone = lesson.completedByStudentIds.includes(studentId);
              const newCompleted = alreadyDone ? lesson.completedByStudentIds : [...lesson.completedByStudentIds, studentId];
              return { ...lesson, completedByStudentIds: newCompleted };
            }
            if (!lesson.completedByStudentIds.includes(studentId)) {
              allLessonsCompleted = false;
            }
            return lesson;
          });
          return { ...module, lessons: updatedLessons };
        });

        // Check if now all completed
        const certIssued = allLessonsCompleted
          ? Array.from(new Set([...course.certificateIssuedToStudentIds, studentId]))
          : course.certificateIssuedToStudentIds;

        return {
          ...course,
          modules: updatedModules,
          certificateIssuedToStudentIds: certIssued,
        };
      })
    );

    // Notify student
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: studentId,
      title: 'Lesson Completed',
      message: 'Great progress! Your course completion percentage has increased.',
      timestamp: 'Just now',
      type: 'certificate',
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Attendance recording
  const saveAttendanceRecord = (newEntries: Omit<AttendanceEntry, 'id'>[]) => {
    const stampedEntries: AttendanceEntry[] = newEntries.map((entry, index) => ({
      ...entry,
      id: `att-rec-${Date.now()}-${index}`,
    }));

    // Replace any entries for same student, course, date
    setAttendanceRecords(prev => {
      const filtered = prev.filter(
        p => !stampedEntries.some(s => s.studentId === p.studentId && s.courseId === p.courseId && s.date === p.date)
      );
      return [...stampedEntries, ...filtered];
    });

    // Notify affected students
    stampedEntries.forEach(entry => {
      const notif: AppNotification = {
        id: `notif-att-${Date.now()}-${entry.studentId}`,
        userId: entry.studentId,
        title: 'Attendance Updated',
        message: `Your attendance for ${entry.courseName} on ${entry.date} was marked as ${entry.status.toUpperCase()}.`,
        timestamp: 'Just now',
        type: 'attendance',
        isRead: false,
        linkTab: 'attendance',
      };
      setNotifications(prev => [notif, ...prev]);
    });
  };

  // Assignment submissions
  const submitAssignment = (assignmentId: string, answerText: string, attachmentName?: string) => {
    if (!currentUser) return;
    const existingIndex = submissions.findIndex(s => s.assignmentId === assignmentId && s.studentId === currentUser.id);

    const submissionData: AssignmentSubmission = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : `sub-${Date.now()}`,
      assignmentId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      answerText,
      attachmentName: attachmentName || 'Project_Submission.pdf',
      status: 'submitted',
    };

    if (existingIndex >= 0) {
      setSubmissions(prev => prev.map((s, idx) => (idx === existingIndex ? submissionData : s)));
    } else {
      setSubmissions(prev => [submissionData, ...prev]);
    }

    // Add notification
    const notif: AppNotification = {
      id: `notif-sub-${Date.now()}`,
      userId: currentUser.id,
      title: 'Assignment Submitted',
      message: 'Your assignment submission was received and is pending trainer evaluation.',
      timestamp: 'Just now',
      type: 'assignment',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const createAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdByTeacherId' | 'createdByName'>) => {
    if (!currentUser) return;
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assign-${Date.now()}`,
      createdByTeacherId: currentUser.id,
      createdByName: currentUser.name,
    };
    setAssignments(prev => [newAssignment, ...prev]);

    // Broadcast notification to all enrolled students
    const targetCourse = courses.find(c => c.id === assignmentData.courseId);
    if (targetCourse) {
      const studentNotifs = targetCourse.enrolledStudentIds.map(stuId => ({
        id: `notif-new-assign-${Date.now()}-${stuId}`,
        userId: stuId,
        title: 'New Assignment Assigned',
        message: `New task in ${assignmentData.courseName}: "${assignmentData.title}" due on ${assignmentData.dueDate}.`,
        timestamp: 'Just now',
        type: 'assignment' as const,
        isRead: false,
        linkTab: 'assignments',
      }));
      setNotifications(prev => [...studentNotifs, ...prev]);
    }
  };

  const gradeSubmission = (submissionId: string, marks: number, feedback: string) => {
    if (!currentUser) return;
    let studentId = '';
    let assignTitle = '';

    setSubmissions(prev =>
      prev.map(sub => {
        if (sub.id === submissionId) {
          studentId = sub.studentId;
          const assign = assignments.find(a => a.id === sub.assignmentId);
          assignTitle = assign?.title || 'Assignment';
          return {
            ...sub,
            status: 'graded',
            marksAwarded: marks,
            feedback,
            gradedByTeacherId: currentUser.id,
            gradedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          };
        }
        return sub;
      })
    );

    if (studentId) {
      const notif: AppNotification = {
        id: `notif-graded-${Date.now()}`,
        userId: studentId,
        title: 'Assignment Evaluated',
        message: `Your submission for "${assignTitle}" received ${marks} marks. Trainer Feedback: "${feedback}".`,
        timestamp: 'Just now',
        type: 'assignment',
        isRead: false,
        linkTab: 'assignments',
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const addStudyMaterial = (matData: Omit<StudyMaterial, 'id' | 'uploadedBy' | 'uploadedDate'>) => {
    if (!currentUser) return;
    const newMat: StudyMaterial = {
      ...matData,
      id: `mat-${Date.now()}`,
      uploadedBy: currentUser.name,
      uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setStudyMaterials(prev => [newMat, ...prev]);
  };

  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'authorName' | 'authorRole' | 'postedDate'>) => {
    if (!currentUser) return;
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role === 'admin' ? 'Center Director' : 'Lead Trainer',
      postedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
    setAnnouncements(prev => [newAnn, ...prev]);

    // Send notification to all users
    const allNotifs = users.map(u => ({
      id: `notif-ann-${Date.now()}-${u.id}`,
      userId: u.id,
      title: 'Announcement: ' + annData.title,
      message: annData.content.substring(0, 80) + '...',
      timestamp: 'Just now',
      type: 'announcement' as const,
      isRead: false,
      linkTab: 'home',
    }));
    setNotifications(prev => [...allNotifs, ...prev]);
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
    };
    setCourses(prev => [newCourse, ...prev]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addBatch = (batchData: Omit<Batch, 'id'>) => {
    const newBatch: Batch = {
      ...batchData,
      id: `batch-${Date.now()}`,
    };
    setBatches(prev => [...prev, newBatch]);
  };

  const addUserByAdmin = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${userData.role.substring(0, 3)}-${Date.now()}`,
      enrollmentDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => (n.userId === currentUser.id ? { ...n, isRead: true } : n)));
  };

  const resetDemoData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCourses(INITIAL_COURSES);
    setBatches(INITIAL_BATCHES);
    setAttendanceRecords(generateInitialAttendance());
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setStudyMaterials(INITIAL_STUDY_MATERIALS);
    setTimetable(INITIAL_TIMETABLE);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTab('home');
  };

  const getStudentAttendanceStats = (studentId: string) => {
    const records = attendanceRecords.filter(r => r.studentId === studentId);
    if (records.length === 0) {
      return { total: 0, attended: 0, percentage: 100, isEligible: true };
    }
    const attended = records.filter(r => r.status === 'present' || r.status === 'late').length;
    const percentage = Math.round((attended / records.length) * 100);
    return {
      total: records.length,
      attended,
      percentage,
      isEligible: percentage >= 75,
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        courses,
        batches,
        attendanceRecords,
        assignments,
        submissions,
        studyMaterials,
        timetable,
        announcements,
        notifications,
        activeTab,
        setActiveTab,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isDeploymentGuideOpen,
        setIsDeploymentGuideOpen,
        activeCertificateCourse,
        setActiveCertificateCourse,

        login,
        register,
        logout,
        switchDemoUser,
        updateProfile,
        markLessonCompleted,
        saveAttendanceRecord,
        submitAssignment,
        createAssignment,
        gradeSubmission,
        addStudyMaterial,
        addAnnouncement,
        addCourse,
        updateCourse,
        addBatch,
        addUserByAdmin,
        toggleUserStatus,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        getStudentAttendanceStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
