import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Download,
  Printer,
  CheckCircle,
  GraduationCap,
  ShieldCheck,
  Share2,
} from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const { activeCertificateCourse, setActiveCertificateCourse, currentUser } = useApp();

  if (!activeCertificateCourse || !currentUser) return null;

  const handleDownload = () => {
    alert(`Certificate for "${activeCertificateCourse.title}" generated for ${currentUser.name}. You can also use the Print button to save as PDF directly!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold">Official NIIT Foundation Credential</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={() => setActiveCertificateCourse(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Frame */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border-8 border-double border-blue-900 p-8 sm:p-12 relative overflow-hidden text-center text-slate-800">
            
            {/* Background watermark effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

            {/* Header Lockup */}
            <div className="mb-6">
              <div className="flex justify-center items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white">
                  <GraduationCap className="w-6 h-6 text-amber-300" />
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xl font-black tracking-tight text-blue-950">
                    NIIT <span className="text-blue-700">FOUNDATION</span>
                  </div>
                  <div className="text-[10px] tracking-widest uppercase text-slate-500 font-semibold">
                    Center for Youth Empowerment & Skill Development
                  </div>
                </div>
              </div>
              <div className="h-0.5 w-32 bg-amber-400 mx-auto mt-3" />
            </div>

            {/* Title */}
            <div className="mb-4">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                Certificate of Vocational Competence
              </span>
              <p className="text-xs text-slate-400 mt-0.5">This credential proudly certifies that</p>
            </div>

            {/* Recipient Name */}
            <div className="my-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-serif tracking-tight border-b-2 border-slate-200 pb-2 inline-block px-8">
                {currentUser.name}
              </h1>
              <p className="text-xs text-slate-500 mt-2">
                Student Enrollment ID: <span className="font-mono font-bold text-slate-700">{currentUser.studentId || 'NF-2026-STU8492'}</span>
              </p>
            </div>

            {/* Course Information */}
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed my-4">
              has satisfactorily completed the curriculum requirements, comprehensive practical computer lab assessments, and achieved required attendance benchmark in
            </p>

            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 inline-block my-2 max-w-md">
              <h2 className="text-base sm:text-lg font-bold text-blue-950">
                {activeCertificateCourse.title}
              </h2>
              <div className="text-[11px] text-blue-800 font-medium mt-0.5">
                Duration: {activeCertificateCourse.durationHours} Hours ({activeCertificateCourse.durationWeeks} Weeks) · Grade: Distinction (A+)
              </div>
            </div>

            {/* Bottom verification badge and signatures */}
            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-3 items-center gap-4 text-left">
              <div>
                <div className="font-serif italic text-sm text-slate-700 font-bold">Rajesh Kumar</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Lead IT Faculty
                </div>
                <div className="text-[9px] text-slate-400">NIIT Foundation</div>
              </div>

              {/* Seal Image */}
              <div className="flex flex-col items-center justify-center">
                <img
                  src="/src/assets/images/niit_certificate_badge_1792580769689.jpg"
                  alt="Official Seal"
                  className="w-16 h-16 rounded-full shadow-md object-contain border-2 border-amber-300"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[9px] text-amber-700 font-bold mt-1 tracking-wider uppercase">
                  Verified Seal
                </span>
              </div>

              <div className="text-right">
                <div className="font-serif italic text-sm text-slate-700 font-bold">Anita Verma</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Center Director
                </div>
                <div className="text-[9px] text-slate-400">Delhi NCR Regional Center</div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Issued: October 2026</span>
              <span className="font-mono">Credential ID: NF-CERT-2026-849201</span>
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3 h-3" />
                Digitally Authenticated
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
