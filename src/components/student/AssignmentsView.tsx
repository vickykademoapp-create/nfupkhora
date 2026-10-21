import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Send,
  BookOpen,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Assignment } from '../../types';

export const AssignmentsView: React.FC = () => {
  const {
    currentUser,
    assignments,
    submissions,
    studyMaterials,
    submitAssignment,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'assignments' | 'materials'>('assignments');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNote, setSuccessNote] = useState('');

  if (!currentUser) return null;

  const handleOpenSubmitModal = (assign: Assignment) => {
    setSelectedAssignment(assign);
    const existing = submissions.find(s => s.assignmentId === assign.id && s.studentId === currentUser.id);
    setAnswerText(existing ? existing.answerText : '');
    setAttachedFileName(existing ? existing.attachmentName || '' : '');
    setSuccessNote('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !answerText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(
        selectedAssignment.id,
        answerText,
        attachedFileName || `${currentUser.name.replace(/\s+/g, '_')}_Assignment.docx`
      );
      setIsSubmitting(false);
      setSuccessNote('Your assignment has been submitted successfully to Trainer Rajesh Kumar.');
      setTimeout(() => {
        setSelectedAssignment(null);
        setSuccessNote('');
      }, 1500);
    }, 400);
  };

  const handleSimulatedDownload = (fileName: string) => {
    alert(`Downloading study note: ${fileName} from NIIT Foundation Course Cloud.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header & Section Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assignments & Learning Materials</h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit coursework projects, review faculty grading and feedback, and download practical revision notes.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'assignments' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Assignments ({assignments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'materials' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study Notes & Handbooks ({studyMaterials.length})</span>
          </button>
        </div>
      </div>

      {/* ASSIGNMENTS VIEW */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Assigned Course Tasks
            </h2>

            {assignments.map(assign => {
              const submission = submissions.find(
                s => s.assignmentId === assign.id && s.studentId === currentUser.id
              );
              const isGraded = submission?.status === 'graded';
              const isSubmitted = !!submission;

              return (
                <div
                  key={assign.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-200 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                        {assign.courseName}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{assign.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1 text-amber-700 font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Due: {assign.dueDate}
                        </span>
                        <span>·</span>
                        <span>Max Marks: {assign.maxMarks}</span>
                        <span>·</span>
                        <span>Instructor: {assign.createdByName}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {isGraded ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Graded: {submission.marksAwarded} / {assign.maxMarks}
                          </span>
                        </div>
                      ) : isSubmitted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-semibold border border-blue-200">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          Submitted (Under Review)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Pending Submission
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Task Instructions */}
                  <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="font-semibold text-slate-900 block mb-1">
                      Instructions & Deliverables:
                    </strong>
                    {assign.instructions}
                  </div>

                  {/* Reference Attachment */}
                  {assign.attachments && assign.attachments.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-500">Assignment Reference File:</span>
                      {assign.attachments.map((att, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSimulatedDownload(att.name)}
                          className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
                        >
                          <Download className="w-3 h-3" />
                          {att.name} ({att.size})
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Teacher Feedback Block if Graded */}
                  {isGraded && submission.feedback && (
                    <div className="mt-4 p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        Trainer Feedback & Remarks:
                      </div>
                      <p className="text-emerald-900 italic leading-relaxed">
                        "{submission.feedback}"
                      </p>
                      <div className="text-[10px] text-emerald-700 mt-1">
                        Evaluated by Trainer Rajesh Kumar on {submission.gradedAt}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {isSubmitted
                        ? `Last submitted on: ${submission.submittedAt}`
                        : 'Upload files or write answers directly'}
                    </span>

                    <button
                      onClick={() => handleOpenSubmitModal(assign)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 ${
                        isSubmitted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          : 'bg-blue-700 hover:bg-blue-800 text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isSubmitted ? 'Update / Resubmit' : 'Submit Assignment'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission Guidelines & Tips Column */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Grading Rubric & Standards
            </h2>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs text-slate-600">
              <h3 className="font-bold text-slate-900 text-sm">NIIT Academic Standards</h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Timely Submission:</strong> Work submitted on or before the due date receives priority grading.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Formula Integrity:</strong> In Excel tasks, ensure formulas are dynamic without hardcoding calculated values.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Feedback Revision:</strong> Trainers provide remarks to guide you before final placement assessment.
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* STUDY MATERIALS VIEW */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyMaterials.map(mat => (
            <div
              key={mat.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-blue-700 font-semibold mb-2">
                  <span className="uppercase tracking-wider">{mat.category}</span>
                  <span className="text-slate-400 font-normal">{mat.fileSize}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{mat.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{mat.description}</p>
                <div className="mt-3 text-[11px] text-slate-400">
                  Course: <span className="font-semibold text-slate-700">{mat.courseName}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Added: {mat.uploadedDate}</span>
                <button
                  onClick={() => handleSimulatedDownload(mat.title)}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Notes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal Dialog */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-amber-300">
                  {selectedAssignment.courseName}
                </span>
                <h3 className="text-base font-bold">{selectedAssignment.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {successNote && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successNote}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Answer Explanation or Project Summary
                </label>
                <textarea
                  value={answerText}
                  onChange={e => setAnswerText(e.target.value)}
                  required
                  rows={4}
                  placeholder="Explain how you completed this project, describe the formulas/methods used, or paste your text submission..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Project File / Workbook (.xlsx, .docx, .pdf)
                </label>
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70 text-center hover:bg-slate-100 transition-colors">
                  <Upload className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                  <div className="text-xs text-slate-600">
                    {attachedFileName ? (
                      <span className="font-semibold text-blue-800">
                        Selected File: {attachedFileName}
                      </span>
                    ) : (
                      <span>Click to select file or use sample upload</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachedFileName(
                        `${currentUser.name.replace(/\s+/g, '_')}_Practical_Project.xlsx`
                      )
                    }
                    className="mt-2 text-[11px] font-semibold text-blue-700 hover:underline"
                  >
                    Attach Sample Project File (.xlsx)
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !answerText.trim()}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Uploading...' : 'Submit to Trainer'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
