export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  passwordHash?: string;
  studentId?: string;
  teacherId?: string;
  batchId?: string;
  batchName?: string;
  centerLocation?: string;
  enrollmentDate?: string;
  bio?: string;
  emergencyContact?: string;
  status: 'active' | 'inactive';
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  content: string;
  keyTakeaways: string[];
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  completedByStudentIds: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export type CourseCategory =
  | 'Spoken English'
  | 'Basic Computer Training'
  | 'MS Word, Excel, and PowerPoint'
  | 'Digital Literacy'
  | 'Communication Skills'
  | 'Career and Interview Preparation';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  description: string;
  durationHours: number;
  durationWeeks: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructorId: string;
  instructorName: string;
  thumbnail: string;
  modules: CourseModule[];
  enrolledStudentIds: string[];
  certificateIssuedToStudentIds: string[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceEntry {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  courseId: string;
  courseName: string;
  batchId: string;
  status: AttendanceStatus;
  markedByTeacherId: string;
  remarks?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  instructions: string;
  dueDate: string; // ISO string or YYYY-MM-DD
  maxMarks: number;
  createdByTeacherId: string;
  createdByName: string;
  batchId: string;
  attachments?: {
    name: string;
    size: string;
    fileUrl: string;
  }[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  answerText: string;
  attachmentName?: string;
  status: 'submitted' | 'graded';
  marksAwarded?: number;
  feedback?: string;
  gradedByTeacherId?: string;
  gradedAt?: string;
}

export interface StudyMaterial {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  category: string;
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  downloadUrl: string;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. "09:30 AM"
  endTime: string;   // e.g. "11:00 AM"
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  batchId: string;
  batchName: string;
  location: string; // e.g. "Computer Lab 1 (Workstation 1-25)", "Seminar Room B"
  isToday?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  postedDate: string;
  targetRole: 'all' | 'students' | 'teachers';
  targetBatchId?: string;
  isImportant?: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'class' | 'attendance' | 'assignment' | 'announcement' | 'certificate';
  isRead: boolean;
  linkTab?: string;
}

export interface Batch {
  id: string;
  name: string;
  timing: string;
  room: string;
  studentCount: number;
  teacherId: string;
  teacherName: string;
}
