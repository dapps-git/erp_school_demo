import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSchool } from '../context/SchoolContext';
import { StatCard } from '../components/StatCard';
import {
  GraduationCap,
  CalendarCheck,
  Users,
  TrendingUp,
  TrendingDown,
  Wallet,
  Coins,
  ArrowRight,
  UserPlus,
  PlusCircle,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const Dashboard = ({ onNavigate }) => {
  const { formatCurrency } = useSchool();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await api.getDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-light">Loading School Dashboard...</p>
        </div>
      </div>
    );
  }

  const cards = data?.cards || {};

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Shortcuts */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-sky-100 text-[11px] font-medium mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Academic Session 2026-2027
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              School Administration Portal
            </h2>
            <p className="text-sky-100 text-xs font-light max-w-xl mt-1">
              Real-time administrative control of classes LKG to 10th standard, student profiles, daily attendance, payroll and school finance.
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('attendance')}
              className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-xs font-medium text-white flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <CalendarCheck className="w-4 h-4 text-cyan-200" />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => onNavigate('students')}
              className="px-3 py-2 rounded-xl bg-white text-sky-700 hover:bg-sky-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-sky-600" />
              <span>New Admission</span>
            </button>
          </div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 7 KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={cards.totalStudents || 0}
          subtitle={`Across ${cards.totalClasses || 12} Standards`}
          icon={GraduationCap}
          color="sky"
          trend="Active Enrolment"
          onClick={() => onNavigate('students')}
        />

        <StatCard
          title="Today's Attendance"
          value={`${cards.todayAttendanceRate || 0}%`}
          subtitle={`${cards.todayPresent || 0} Present • ${cards.todayAbsent || 0} Absent`}
          icon={CalendarCheck}
          color="cyan"
          trend={`${cards.todayLeave || 0} on Leave`}
          onClick={() => onNavigate('attendance')}
        />

        <StatCard
          title="Total Staff"
          value={cards.totalStaff || 0}
          subtitle="Teachers & Support Staff"
          icon={Users}
          color="indigo"
          trend="Active Payroll"
          onClick={() => onNavigate('staff')}
        />

        <StatCard
          title="Available Balance"
          value={formatCurrency(cards.availableBalance || 0)}
          subtitle="Total Income - Expenses"
          icon={Coins}
          color={cards.availableBalance >= 0 ? 'emerald' : 'rose'}
          trend="Net Balance"
          onClick={() => onNavigate('finance-summary')}
        />
      </div>

      {/* Financial Month Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="school-card p-4 border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Current Month Income</p>
            <h4 className="text-xl font-bold text-emerald-600 mt-0.5">{formatCurrency(cards.monthIncome || 0)}</h4>
            <p className="text-[11px] text-slate-400 mt-1">Fee & institutional collections</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="school-card p-4 border-l-4 border-l-rose-500 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Current Month Expenses</p>
            <h4 className="text-xl font-bold text-rose-600 mt-0.5">{formatCurrency(cards.monthExpense || 0)}</h4>
            <p className="text-[11px] text-slate-400 mt-1">Operations, bills & maintenance</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="school-card p-4 border-l-4 border-l-sky-500 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Current Month Salary</p>
            <h4 className="text-xl font-bold text-sky-600 mt-0.5">{formatCurrency(cards.monthSalary || 0)}</h4>
            <p className="text-[11px] text-slate-400 mt-1">Staff payroll disbursements</p>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Middle Grid: Class-wise Student Distribution & Today's Attendance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class-wise Student Count (2 cols) */}
        <div className="lg:col-span-2 school-card p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                Class-wise Student Distribution
              </h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">Enrolled student counts from LKG to 10th Standard</p>
            </div>
            <button
              onClick={() => onNavigate('classes')}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
            >
              <span>Manage Classes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(data?.classWiseStudents || []).map((cls) => (
              <div
                key={cls.classId || cls.name}
                onClick={() => onNavigate('students')}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-sky-50/60 hover:border-sky-200 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{cls.name} Std</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-sky-600">
                    {cls.studentCount}
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>👦 {cls.maleCount} Boys</span>
                  <span>👧 {cls.femaleCount} Girls</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Attendance Snapshot (1 col) */}
        <div className="school-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-cyan-600" />
                Today's Attendance
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {new Date().toISOString().split('T')[0]}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Present Students</span>
                </div>
                <span className="text-sm font-bold text-emerald-700">{cards.todayPresent || 0}</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Absent Students</span>
                </div>
                <span className="text-sm font-bold text-rose-700">{cards.todayAbsent || 0}</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-amber-800">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>On Leave / Late</span>
                </div>
                <span className="text-sm font-bold text-amber-700">
                  {(cards.todayLeave || 0) + (cards.todayLate || 0)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('attendance')}
            className="w-full btn-primary btn-sm mt-4 text-xs"
          >
            Mark or View Class Attendance
          </button>
        </div>
      </div>

      {/* Bottom Grid: Recent Incomes, Expenses & Salaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Income */}
        <div className="school-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Recent Incomes
            </h4>
            <button
              onClick={() => onNavigate('income')}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {(data?.recentIncomes || []).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent income records</p>
            ) : (
              data.recentIncomes.map((inc) => (
                <div key={inc._id} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800 truncate max-w-[140px]">{inc.title}</p>
                    <p className="text-[10px] text-slate-400">{inc.category} • {new Date(inc.date).toLocaleDateString()}</p>
                  </div>
                  <span className="font-bold text-emerald-600 font-mono">
                    +{formatCurrency(inc.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="school-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-600" /> Recent Expenses
            </h4>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {(data?.recentExpenses || []).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent expenses</p>
            ) : (
              data.recentExpenses.map((exp) => (
                <div key={exp._id} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800 truncate max-w-[140px]">{exp.title}</p>
                    <p className="text-[10px] text-slate-400">{exp.category} • {new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                  <span className="font-bold text-rose-600 font-mono">
                    -{formatCurrency(exp.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Salary Payments */}
        <div className="school-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-sky-600" /> Recent Salaries
            </h4>
            <button
              onClick={() => onNavigate('salary')}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {(data?.recentSalaries || []).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent salary payments</p>
            ) : (
              data.recentSalaries.map((sal) => (
                <div key={sal._id} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800 truncate max-w-[140px]">
                      {sal.staffId?.name || 'Staff Member'}
                    </p>
                    <p className="text-[10px] text-slate-400">Month: {sal.salaryMonth} • {sal.paymentMethod}</p>
                  </div>
                  <span className="font-bold text-sky-600 font-mono">
                    {formatCurrency(sal.netSalary)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
