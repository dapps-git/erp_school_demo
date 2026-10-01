import React from 'react';
import { Menu, Calendar, Sparkles, User, Bell } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onToggleSidebar, activeTab, onQuickAction }) => {
  const { settings } = useSchool();
  const { user } = useAuth();

  const titleMap = {
    dashboard: 'School Overview Dashboard',
    students: 'Student Directory & Admissions',
    attendance: 'Daily Student Attendance',
    staff: 'Staff & Faculty Management',
    salary: 'Staff Salary Disbursements',
    income: 'School Income & Fees',
    expenses: 'Operational Expenses',
    'finance-summary': 'Financial Balance & Statement',
    classes: 'Classes & Divisions Management',
    reports: 'School Administrative Reports',
    settings: 'System & Institutional Settings',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {titleMap[activeTab] || 'School CRM'}
          </h2>
          <p className="hidden sm:block text-[11px] text-slate-400 font-light">
            {settings?.schoolName || 'Greenwood International School'}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic Year Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-sky-500" />
          <span>AY: {settings?.academicYear || '2026-2027'}</span>
        </div>

        {/* Quick Add Button */}
        {onQuickAction && (
          <button
            onClick={onQuickAction}
            className="btn-primary btn-sm flex items-center gap-1.5 text-xs shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>
        )}

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 p-[1.5px]">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-sky-600">
              <User className="w-4 h-4" />
            </div>
          </div>
          <span className="hidden lg:block text-xs font-semibold text-slate-700 truncate max-w-[120px]">
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};
