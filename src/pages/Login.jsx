import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';
import { School, Lock, Mail, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { addToast } = useSchool();

  const [email, setEmail] = useState('admin@school.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      addToast('Welcome back! Successfully logged into School CRM.', 'success');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@school.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Brand & Visual */}
        <div className="bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-500 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative ambient circles */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-cyan-300/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6 border border-white/30 shadow-lg">
              <School className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              School CRM <br /> Management System
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm mt-3 font-light leading-relaxed">
              Complete, fast and easy-to-use institutional administration for LKG, UKG and 1st to 10th Standard.
            </p>
          </div>

          <div className="space-y-3 my-8 sm:my-0">
            <div className="flex items-center gap-3 text-xs text-sky-100 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-cyan-200 flex-shrink-0" />
              <span>Students, Attendance & Class Divisions</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-sky-100 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-cyan-200 flex-shrink-0" />
              <span>Staff Management & Auto Salary Calculations</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-sky-100 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-cyan-200 flex-shrink-0" />
              <span>Incomes, Expenses & Financial Statements</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-sky-200 pt-4 border-t border-white/20">
            <span>Official School Portal</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Access
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Admin Sign In</h2>
            <p className="text-xs text-slate-400 font-light mt-1">
              Enter your authorized school credentials to access the management portal.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label text-xs">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 input-icon-left" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@school.com"
                  required
                  className="form-input input-with-icon-left"
                />
              </div>
            </div>

            <div>
              <label className="form-label text-xs">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 input-icon-left" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input input-with-icon-left"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 mt-2 flex items-center justify-center gap-2 text-sm shadow-md"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login Helper */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-sky-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Default Demo Account
                </p>
                <p className="text-[10px] text-sky-700 font-mono mt-0.5">admin@school.com • admin123</p>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="btn-secondary btn-sm text-[11px] py-1 px-2.5 bg-white shadow-2xs"
              >
                Auto Fill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
