import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'sky', trend, onClick }) => {
  const colorMap = {
    sky: {
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      border: 'border-sky-100',
      gradient: 'from-sky-500 to-cyan-500',
      glow: 'shadow-sky-100',
    },
    cyan: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-600',
      border: 'border-cyan-100',
      gradient: 'from-cyan-500 to-teal-500',
      glow: 'shadow-cyan-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      gradient: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      gradient: 'from-rose-500 to-pink-500',
      glow: 'shadow-rose-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      gradient: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-100',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      gradient: 'from-indigo-500 to-purple-500',
      glow: 'shadow-indigo-100',
    },
  };

  const currentTheme = colorMap[color] || colorMap.sky;

  return (
    <div
      onClick={onClick}
      className={`school-card p-5 relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-sky-300 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-2xl ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400">Status</span>
          <span className="font-medium text-emerald-600">{trend}</span>
        </div>
      )}
    </div>
  );
};
