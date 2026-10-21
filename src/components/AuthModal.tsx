import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Shield,
  GraduationCap,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    register,
    batches,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [batchId, setBatchId] = useState('batch-2026-a1');
  const [forgotInput, setForgotInput] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleQuickFill = (role: UserRole) => {
    setSelectedRole(role);
    setMode('login');
    setErrorMessage('');
    setSuccessMessage('');
    if (role === 'student') {
      setEmail('priya.sharma@student.niit.org');
      setPassword('niit123');
    } else if (role === 'teacher') {
      setEmail('rajesh.kumar@teacher.niit.org');
      setPassword('niit123');
    } else {
      setEmail('admin.anita@niitfoundation.org');
      setPassword('niit123');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, selectedRole);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !email || !phone || !password) {
      setErrorMessage('All fields are required to register.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    const result = await register({
      name,
      email,
      phone,
      password,
      role: selectedRole,
      batchId: selectedRole === 'student' ? batchId : undefined,
    });
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput) {
      setErrorMessage('Please enter your registered email or phone number.');
      return;
    }
    setErrorMessage('');
    setSuccessMessage(
      `Password reset verification token sent to ${forgotInput}. For this demo session, your password remains unchanged ("niit123").`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-6 h-6 text-amber-300" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              NIIT Foundation Portal
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'login' && 'Sign In to Your Learning Account'}
            {mode === 'register' && 'Register New Student or Staff Account'}
            {mode === 'forgot' && 'Reset Account Credentials'}
          </h2>
          <p className="text-xs text-blue-100/80 mt-1">
            {mode === 'login' && 'Access courses, class schedules, assignments & attendance records.'}
            {mode === 'register' && 'Join the digital skilling program at NIIT Foundation.'}
            {mode === 'forgot' && 'Recover your login via registered email or SMS verification.'}
          </p>

          {/* Quick Demo Login Preset Bar */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="text-[11px] font-medium text-amber-200 mb-2 flex items-center justify-between">
              <span>Quick Demo Fill:</span>
              <span className="text-white/60 text-[10px]">Sample accounts</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg text-center transition-colors ${
                  selectedRole === 'student' && mode === 'login'
                    ? 'bg-amber-400 text-blue-950 font-bold shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Priya (Student)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('teacher')}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg text-center transition-colors ${
                  selectedRole === 'teacher' && mode === 'login'
                    ? 'bg-amber-400 text-blue-950 font-bold shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Rajesh (Teacher)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg text-center transition-colors ${
                  selectedRole === 'admin' && mode === 'login'
                    ? 'bg-amber-400 text-blue-950 font-bold shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Anita (Admin)
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* Role Selection Tabs for Login/Register */}
          {mode !== 'forgot' && (
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Signing in as:
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'student'
                      ? 'bg-white text-blue-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('teacher')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'teacher'
                      ? 'bg-white text-blue-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'admin'
                      ? 'bg-white text-blue-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </button>
              </div>
            </div>
          )}

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder={
                      selectedRole === 'student'
                        ? 'priya.sharma@student.niit.org'
                        : selectedRole === 'teacher'
                        ? 'rajesh.kumar@teacher.niit.org'
                        : 'admin.anita@niitfoundation.org'
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-xs text-blue-700 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Sample account password is <span className="font-mono font-bold text-slate-700">niit123</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating securely...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Need a new account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-blue-700 hover:underline font-semibold"
                >
                  Register here
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="rahul@example.com"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 00000"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {selectedRole === 'student' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Training Batch
                  </label>
                  <select
                    value={batchId}
                    onChange={e => setBatchId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.timing})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Password (minimum 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Create a secure password"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Registering account...</span>
                ) : (
                  <>
                    <span>Create {selectedRole.toUpperCase()} Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-blue-700 hover:underline font-semibold"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                <KeyRound className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  Enter your registered student or staff email address. We will verify your account and simulate sending an OTP reset code.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address or Mobile
                </label>
                <input
                  type="text"
                  value={forgotInput}
                  onChange={e => setForgotInput(e.target.value)}
                  required
                  placeholder="e.g. priya.sharma@student.niit.org"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
              >
                Send Password Reset Token
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
