import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, CourseCategory } from '../../types';
import {
  BookOpen,
  Search,
  Clock,
  Award,
  CheckCircle2,
  ChevronRight,
  PlayCircle,
  HelpCircle,
  X,
  FileCheck,
  Sparkles,
} from 'lucide-react';

const CATEGORIES: CourseCategory[] = [
  'MS Word, Excel, and PowerPoint',
  'Digital Literacy',
  'Spoken English',
  'Basic Computer Training',
  'Communication Skills',
  'Career and Interview Preparation',
];

export const CoursesView: React.FC = () => {
  const { courses, currentUser, markLessonCompleted, setActiveCertificateCourse } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected course for detailed lesson viewer
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<{ courseId: string; lesson: Lesson } | null>(null);

  // Quiz state inside active lesson
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStudentCourseStats = (course: Course) => {
    let totalLessons = 0;
    let completedLessons = 0;
    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (currentUser && l.completedByStudentIds.includes(currentUser.id)) {
          completedLessons++;
        }
      });
    });
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const isEnrolled = currentUser ? course.enrolledStudentIds.includes(currentUser.id) : false;
    const isCertified = currentUser ? course.certificateIssuedToStudentIds.includes(currentUser.id) : false;
    return { totalLessons, completedLessons, percentage, isEnrolled, isCertified };
  };

  const handleOpenLesson = (course: Course, lesson: Lesson) => {
    setActiveLesson({ courseId: course.id, lesson });
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleMarkComplete = () => {
    if (!activeLesson || !currentUser) return;
    markLessonCompleted(activeLesson.courseId, activeLesson.lesson.id);
  };

  const isCurrentLessonDone =
    currentUser && activeLesson ? activeLesson.lesson.completedByStudentIds.includes(currentUser.id) : false;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vocational Courses & Training</h1>
          <p className="text-xs text-slate-500 mt-1">
            Official curriculum designed by NIIT Foundation to prepare learners for employment and workplace productivity.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search modules or skills..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Categories ({courses.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = courses.filter(c => c.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Courses Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const stats = getStudentCourseStats(course);

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Course Image */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-blue-950 shadow-sm">
                    {course.level}
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-5">
                  <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
                    {course.category}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {course.durationHours} Hours ({course.durationWeeks} Weeks)
                    </span>
                    <span>·</span>
                    <span>{course.modules.length} Modules</span>
                  </div>

                  {/* Modules Accordion Preview */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Course Curriculum ({stats.totalLessons} Lessons)
                    </div>
                    {course.modules.map((module, mIdx) => (
                      <div key={module.id} className="text-xs text-slate-600">
                        <div className="font-medium text-slate-800 line-clamp-1">
                          {module.title}
                        </div>
                        <div className="pl-3 mt-1 space-y-1 border-l-2 border-slate-100">
                          {module.lessons.map(lesson => {
                            const isDone = currentUser && lesson.completedByStudentIds.includes(currentUser.id);
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => handleOpenLesson(course, lesson)}
                                className="w-full text-left py-1 px-2 rounded hover:bg-slate-50 flex items-center justify-between text-xs group"
                              >
                                <span className={`line-clamp-1 ${isDone ? 'text-slate-500 line-through' : 'text-slate-700 group-hover:text-blue-700 font-medium'}`}>
                                  {lesson.title}
                                </span>
                                {isDone ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                ) : (
                                  <PlayCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Card Footer with Progress & Certificate Action */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                    <span>Learning Progress</span>
                    <span className="font-bold tabular-nums text-slate-900">{stats.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-700 h-full rounded-full transition-all duration-300"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    {stats.isCertified ? (
                      <button
                        onClick={() => setActiveCertificateCourse(course)}
                        className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>View Certificate</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {stats.completedLessons}/{stats.totalLessons} completed
                      </span>
                    )}

                    <button
                      onClick={() => {
                        const firstLesson = course.modules[0]?.lessons[0];
                        if (firstLesson) handleOpenLesson(course, firstLesson);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-colors"
                    >
                      Open Course
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Interactive Lesson Modal Viewer */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-amber-300 tracking-wider">
                  Interactive Lesson & Practical Exercise
                </span>
                <h3 className="text-base sm:text-lg font-bold">{activeLesson.lesson.title}</h3>
                <span className="text-xs text-blue-200">Estimated Duration: {activeLesson.lesson.durationMinutes} minutes</span>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close lesson"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lesson Body Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Lesson Overview & Theory
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {activeLesson.lesson.content}
                </p>
              </div>

              {/* Key Takeaways */}
              {activeLesson.lesson.keyTakeaways && activeLesson.lesson.keyTakeaways.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Key Vocational Skills & Rules
                  </h4>
                  <ul className="space-y-2">
                    {activeLesson.lesson.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interactive Practice Quiz */}
              {activeLesson.lesson.quizQuestion && (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-700" />
                    <h5 className="text-xs font-bold text-blue-950">
                      Quick Comprehension Quiz:
                    </h5>
                  </div>
                  <p className="text-xs font-medium text-slate-800">
                    {activeLesson.lesson.quizQuestion.question}
                  </p>

                  <div className="space-y-2">
                    {activeLesson.lesson.quizQuestion.options.map((option, optIdx) => {
                      const isSelected = selectedQuizAnswer === optIdx;
                      const isCorrect = optIdx === activeLesson.lesson.quizQuestion?.correctIndex;
                      
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-semibold';
                        else if (isSelected) btnStyle = 'bg-red-100 border-red-400 text-red-900';
                      } else if (isSelected) {
                        btnStyle = 'bg-blue-100 border-blue-400 text-blue-900 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => setSelectedQuizAnswer(optIdx)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      type="button"
                      disabled={selectedQuizAnswer === null}
                      onClick={() => setQuizSubmitted(true)}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="pt-2 text-xs text-blue-900 leading-relaxed border-t border-blue-200">
                      <strong>Explanation:</strong> {activeLesson.lesson.quizQuestion.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div>
                {isCurrentLessonDone ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed & Recorded
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">Lesson in progress</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLesson(null)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={handleMarkComplete}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5 ${
                    isCurrentLessonDone
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{isCurrentLessonDone ? 'Mark as Incomplete' : 'Mark as Completed'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
