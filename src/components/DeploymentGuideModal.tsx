import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Server,
  Smartphone,
  ShieldCheck,
  Terminal,
  Database,
  ExternalLink,
  Copy,
  Check,
  FileCode,
  Layers,
  Sparkles,
} from 'lucide-react';

export const DeploymentGuideModal: React.FC = () => {
  const { isDeploymentGuideOpen, setIsDeploymentGuideOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'firebase' | 'android' | 'deploy'>('firebase');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isDeploymentGuideOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 text-white relative shrink-0">
          <button
            onClick={() => setIsDeploymentGuideOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-5 h-5 text-amber-400" />
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">
              NIIT Foundation App Architecture
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Backend (Firebase) & Android Mobile Packaging Guide
          </h2>
          <p className="text-xs text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
            The application currently runs in high-fidelity Demo Mode with instant client state persistence in localStorage. Here is the step-by-step roadmap to connect live Firebase Auth/Firestore and package this responsive PWA into an Android APK.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('firebase')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'firebase'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              1. Firebase Firestore & Auth
            </button>
            <button
              onClick={() => setActiveTab('android')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'android'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              2. Android APK (Capacitor)
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'deploy'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              3. Testing & Production Build
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-700 space-y-6 text-sm">
          
          {/* TAB 1: FIREBASE */}
          {activeTab === 'firebase' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-700" />
                  Connecting Production Firebase Backend
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  To transition from local demo storage to Cloud Firestore and Firebase Authentication, follow these steps:
                </p>
              </div>

              {/* Step 1 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Step 1: Install Firebase Web SDK</h4>
                  <button
                    onClick={() => copyToClipboard('npm install firebase', 'step1')}
                    className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-medium"
                  >
                    {copiedKey === 'step1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'step1' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs">
                  npm install firebase
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Step 2: Add Environment Variables in .env</h4>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `VITE_FIREBASE_API_KEY=your_api_key\nVITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com\nVITE_FIREBASE_PROJECT_ID=your_project_id\nVITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com\nVITE_FIREBASE_MESSAGING_SENDER_ID=your_id\nVITE_FIREBASE_APP_ID=your_app_id`,
                        'step2'
                      )
                    }
                    className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-medium"
                  >
                    {copiedKey === 'step2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'step2' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs whitespace-pre">
{`VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="niit-foundation-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="niit-foundation-app"
VITE_FIREBASE_STORAGE_BUCKET="niit-foundation-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"`}
                </div>
              </div>

              {/* Step 3: Security Rules */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Step 3: Recommended Firestore Security Rules (RBAC)
                  </h4>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    function isSignedIn() { return request.auth != null; }\n    function isTeacher() { return isSignedIn() && request.auth.token.role == 'teacher'; }\n    function isAdmin() { return isSignedIn() && request.auth.token.role == 'admin'; }\n    \n    match /users/{userId} {\n      allow read: if isSignedIn();\n      allow write: if isAdmin() || request.auth.uid == userId;\n    }\n    match /courses/{courseId} {\n      allow read: if true;\n      allow write: if isAdmin() || isTeacher();\n    }\n    match /attendance/{docId} {\n      allow read: if isSignedIn();\n      allow write: if isTeacher() || isAdmin();\n    }\n    match /assignments/{assignId} {\n      allow read: if isSignedIn();\n      allow write: if isTeacher() || isAdmin();\n    }\n    match /submissions/{subId} {\n      allow read: if isSignedIn();\n      allow create, update: if isSignedIn();\n    }\n  }\n}`,
                        'rules'
                      )
                    }
                    className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-medium"
                  >
                    {copiedKey === 'rules' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'rules' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs whitespace-pre overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isTeacher() { return isSignedIn() && request.auth.token.role == 'teacher'; }
    function isAdmin() { return isSignedIn() && request.auth.token.role == 'admin'; }

    // Students can read their own records; Teachers/Admins record attendance
    match /attendance/{docId} {
      allow read: if isSignedIn();
      allow write: if isTeacher() || isAdmin();
    }
    match /submissions/{subId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn();
    }
  }
}`}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANDROID PACKAGING */}
          {activeTab === 'android' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  Packaging into an Android APK via Capacitor
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Because this app is written with mobile-first viewport design and bottom navigation, it wraps smoothly into a native Android APK using Capacitor.
                </p>
              </div>

              {/* Step 1 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Step 1: Install Capacitor CLI & Core</h4>
                <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs whitespace-pre">
npm install @capacitor/core
npm install -D @capacitor/cli @capacitor/android
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Step 2: Initialize Capacitor Config</h4>
                <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs whitespace-pre">
npx cap init "NIIT Foundation" "org.niitfoundation.learning" --web-dir dist
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Step 3: Build Web Assets & Add Android Platform</h4>
                <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs whitespace-pre">
npm run build
npx cap add android
npx cap sync android
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Step 4: Open in Android Studio & Compile Release APK</h4>
                <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs whitespace-pre">
{`npx cap open android
# In Android Studio: Select Build -> Build Bundle(s) / APK(s) -> Build APK(s)`}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Your generated release APK will be saved at <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-800">android/app/build/outputs/apk/release/app-release.apk</code>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DEPLOY */}
          {activeTab === 'deploy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Testing & Cloud Production Deployment
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Compile and test the web app before deploying to Google Cloud Run, Vercel, or custom servers.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Build Production Bundle</h4>
                <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs">
                  npm run build
                </div>
                <p className="text-xs text-slate-500">
                  Produces optimized static assets in the <span className="font-mono text-slate-700">dist/</span> directory ready for CDN deployment.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="text-xs font-bold text-blue-900 mb-1">Demo Mode Guarantees</h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  In this current environment, all features (lesson completions, attendance marking, assignment creation, student submissions, teacher grading, user registrations, and certificate downloads) are fully interactive and persist in your browser session.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsDeploymentGuideOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
