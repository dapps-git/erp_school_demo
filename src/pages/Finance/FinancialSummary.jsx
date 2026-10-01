import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Wallet,
  Coins,
  ArrowRight,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const FinancialSummary = ({ onNavigate }) => {
  const { formatCurrency } = useSchool();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      try {
        const res = await api.getFinancialSummary();
        if (res.success && res.data) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error('Failed to load financial summary:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  if (loading || !summary) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
        <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading financial summary & statements...</p>
      </div>
    );
  }

  const {
    totalIncome = 0,
    totalExpenses = 0,
    availableBalance = 0,
    monthIncome = 0,
    monthExpense = 0,
    monthSalary = 0,
    incomeByCategory = {},
    expenseByCategory = {},
    monthlyTrend = [],
  } = summary;

  // Max value for bar scaling
  const maxTrend = Math.max(
    ...monthlyTrend.map((t) => Math.max(t.income, t.expense)),
    1000
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Big Math Equation */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold flex items-center gap-1.5 border border-sky-400/20">
              <Coins className="w-3.5 h-3.5" /> Institutional Treasury Balance
            </span>
            <span className="text-xs text-slate-400">All-Time Institutional Summary</span>
          </div>

          {/* Equation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center pt-2">
            {/* Total Income */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold block">
                Total School Income (+)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                {formatCurrency(totalIncome)}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Fees, admissions & events</p>
            </div>

            <div className="hidden md:flex items-center justify-center text-slate-500 font-bold text-2xl">
              -
            </div>

            {/* Total Expenses */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[11px] uppercase tracking-wider text-rose-300 font-semibold block">
                Total Expenses (-)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-rose-400 mt-1">
                {formatCurrency(totalExpenses)}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Payroll, utilities & bills</p>
            </div>

            <div className="hidden md:flex items-center justify-center text-slate-500 font-bold text-2xl">
              =
            </div>

            {/* Available Balance */}
            <div className={`p-4 rounded-2xl border backdrop-blur-xs ${
              availableBalance >= 0 ? 'bg-sky-500/20 border-sky-400/30' : 'bg-rose-500/20 border-rose-400/30'
            }`}>
              <span className="text-[11px] uppercase tracking-wider text-sky-200 font-semibold block">
                Available Net Balance
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                {formatCurrency(availableBalance)}
              </h3>
              <p className="text-[10px] text-sky-200 mt-0.5">Total Institutional Surplus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Month 3-Card Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="school-card p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Current Month Income</p>
            <h4 className="text-xl font-bold text-emerald-600 font-mono mt-0.5">{formatCurrency(monthIncome)}</h4>
            <p className="text-[11px] text-slate-400">Collections this month</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="school-card p-4 flex items-center justify-between border-l-4 border-l-rose-500">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Current Month Expenses</p>
            <h4 className="text-xl font-bold text-rose-600 font-mono mt-0.5">{formatCurrency(monthExpense)}</h4>
            <p className="text-[11px] text-slate-400">Operational costs</p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="school-card p-4 flex items-center justify-between border-l-4 border-l-sky-500">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Current Month Salary</p>
            <h4 className="text-xl font-bold text-sky-600 font-mono mt-0.5">{formatCurrency(monthSalary)}</h4>
            <p className="text-[11px] text-slate-400">Disbursed to faculty</p>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 text-sky-600">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 6-Month Monthly Comparison Chart */}
      <div className="school-card p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              6-Month Income vs Expense Trend
            </h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">Historical comparison of school revenue and expenditures</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expense
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="mt-6 space-y-4">
          {monthlyTrend.map((m, idx) => {
            const incWidth = maxTrend > 0 ? (m.income / maxTrend) * 100 : 0;
            const expWidth = maxTrend > 0 ? (m.expense / maxTrend) * 100 : 0;

            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{m.month}</span>
                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span className="text-emerald-600 font-semibold">+{formatCurrency(m.income)}</span>
                    <span className="text-rose-600 font-semibold">-{formatCurrency(m.expense)}</span>
                    <span className={`font-bold ${m.net >= 0 ? 'text-sky-700' : 'text-rose-700'}`}>
                      Net: {formatCurrency(m.net)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 h-4 bg-slate-50 rounded-full p-0.5 border border-slate-100">
                  <div className="flex justify-end">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(incWidth, 4)}%` }}
                    />
                  </div>
                  <div>
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(expWidth, 4)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown (2 Cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income by Category */}
        <div className="school-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Income Sources Breakdown
            </h4>
            {onNavigate && (
              <button
                onClick={() => onNavigate('income')}
                className="text-xs text-sky-600 hover:text-sky-700 font-medium"
              >
                View Records
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {Object.keys(incomeByCategory).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No categorized income</p>
            ) : (
              Object.entries(incomeByCategory).map(([cat, amt]) => {
                const percent = totalIncome > 0 ? Math.round((amt / totalIncome) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="font-mono font-bold text-emerald-600">
                        {formatCurrency(amt)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Expense by Category */}
        <div className="school-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-600" /> Expense Categories Breakdown
            </h4>
            {onNavigate && (
              <button
                onClick={() => onNavigate('expenses')}
                className="text-xs text-sky-600 hover:text-sky-700 font-medium"
              >
                View Records
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {Object.keys(expenseByCategory).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No categorized expenses</p>
            ) : (
              Object.entries(expenseByCategory).map(([cat, amt]) => {
                const percent = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="font-mono font-bold text-rose-600">
                        {formatCurrency(amt)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
