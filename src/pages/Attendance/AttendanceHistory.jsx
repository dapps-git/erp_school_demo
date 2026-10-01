import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { Calendar, Layers, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';

export const AttendanceHistory = ({ onBackToMark }) => {
  const { classes, addToast } = useSchool();

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = { month, year };
      if (selectedClass) params.classId = selectedClass;
      if (selectedDivision) params.divisionId = selectedDivision;

      const res = await api.getAttendanceHistory(params);
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('Failed to load attendance history:', err);
      addToast('Failed to load attendance history', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedDivision, month, year, addToast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const activeDivisions = classes.find((c) => c._id === selectedClass)?.divisions || [];

  return (
    <div className="space-y-5">
      {/* Header & Filter Card */}
      <div className="school-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {onBackToMark && (
              <button
                onClick={onBackToMark}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Back to Mark Attendance"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                Attendance Log Archive & History
              </h2>
              <p className="text-xs text-slate-400">Review monthly attendance registers across classes.</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedDivision('');
            }}
            className="form-select py-1.5 text-xs"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                Class {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            disabled={!selectedClass}
            className="form-select py-1.5 text-xs disabled:bg-slate-50"
          >
            <option value="">All Divisions</option>
            {activeDivisions.map((d) => (
              <option key={d._id} value={d._id}>
                Division {d.name}
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="form-select py-1.5 text-xs"
          >
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ].map((m, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="form-select py-1.5 text-xs"
          >
            <option value={2026}>Year 2026</option>
            <option value={2025}>Year 2025</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading attendance history...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 text-xs text-slate-400">
          No attendance records found for the selected period.
        </div>
      ) : (
        <div className="table-container shadow-xs">
          <table className="school-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Standard & Section</th>
                <th>Total Marked</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Leave / Late</th>
                <th>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="font-mono text-xs font-semibold text-slate-700">{log.date}</td>
                  <td>
                    <span className="font-medium text-sky-700">
                      Standard {log.class} - Div {log.division}
                    </span>
                  </td>
                  <td className="font-mono text-xs">{log.total}</td>
                  <td>
                    <span className="badge badge-present">{log.present} Present</span>
                  </td>
                  <td>
                    <span className="badge badge-absent">{log.absent} Absent</span>
                  </td>
                  <td>
                    <span className="badge badge-warning">{log.leave + log.late}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-xs">{log.rate}%</span>
                      <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${log.rate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
