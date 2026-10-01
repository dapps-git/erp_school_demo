import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import {
  CalendarCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  CheckCheck,
  User,
  AlertCircle,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const AttendanceMark = ({ onOpenHistory }) => {
  const { classes, addToast, settings } = useSchool();

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [academicYear, setAcademicYear] = useState('2026-2027');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0, leave: 0, rate: 100 });

  // Default to 10th standard or first available class on load
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      const cls10 = classes.find((c) => c.name === '10th') || classes[0];
      setSelectedClass(cls10._id);
      if (cls10.divisions?.length > 0) {
        setSelectedDivision(cls10.divisions[0]._id);
      }
    }
  }, [classes, selectedClass]);

  const fetchAttendanceSheet = useCallback(async () => {
    if (!selectedClass || !selectedDivision || !selectedDate) return;
    setLoading(true);
    try {
      const res = await api.getAttendanceSheet({
        classId: selectedClass,
        divisionId: selectedDivision,
        date: selectedDate,
        academicYear,
      });

      if (res.success) {
        setIsRecorded(res.isRecorded);
        setRecords(res.records || []);
        setStats(res.stats || { total: 0, present: 0, absent: 0, late: 0, leave: 0, rate: 100 });
      }
    } catch (err) {
      console.error('Failed to load attendance sheet:', err);
      addToast(err.message || 'Failed to load attendance sheet', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedDivision, selectedDate, academicYear, addToast]);

  useEffect(() => {
    fetchAttendanceSheet();
  }, [fetchAttendanceSheet]);

  // Handle Class change
  const handleClassChange = (newClassId) => {
    setSelectedClass(newClassId);
    const cls = classes.find((c) => c._id === newClassId);
    setSelectedDivision(cls?.divisions?.[0]?._id || '');
  };

  // Update Status for single student
  const handleStatusChange = (studentId, newStatus) => {
    const updated = records.map((r) => {
      const sId = typeof r.studentId === 'object' ? r.studentId._id : r.studentId;
      if (sId.toString() === studentId.toString()) {
        return { ...r, status: newStatus, reason: newStatus === 'Present' ? '' : r.reason };
      }
      return r;
    });
    setRecords(updated);
    recomputeStats(updated);
  };

  // Update Reason for single student
  const handleReasonChange = (studentId, reason) => {
    const updated = records.map((r) => {
      const sId = typeof r.studentId === 'object' ? r.studentId._id : r.studentId;
      if (sId.toString() === studentId.toString()) {
        return { ...r, reason };
      }
      return r;
    });
    setRecords(updated);
  };

  // One-click: Mark All Present
  const handleMarkAllPresent = () => {
    const updated = records.map((r) => ({ ...r, status: 'Present', reason: '' }));
    setRecords(updated);
    recomputeStats(updated);
    addToast('Marked all students as Present', 'info');
  };

  const recomputeStats = (recs) => {
    const total = recs.length;
    const present = recs.filter((r) => r.status === 'Present').length;
    const absent = recs.filter((r) => r.status === 'Absent').length;
    const late = recs.filter((r) => r.status === 'Late').length;
    const leave = recs.filter((r) => r.status === 'Leave').length;
    const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;
    setStats({ total, present, absent, late, leave, rate });
  };

  // Save Attendance to Backend
  const handleSave = async () => {
    if (records.length === 0) {
      addToast('No students enrolled in this division', 'warning');
      return;
    }

    setSaving(true);
    try {
      await api.saveAttendance({
        classId: selectedClass,
        divisionId: selectedDivision,
        date: selectedDate,
        academicYear,
        records,
      });

      addToast(`Attendance for ${selectedDate} saved successfully!`, 'success');
      setIsRecorded(true);
    } catch (err) {
      addToast(err.message || 'Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  const activeClassObj = classes.find((c) => c._id === selectedClass);
  const activeDivisions = activeClassObj?.divisions || [];

  return (
    <div className="space-y-6">
      {/* Selector & Filter Card */}
      <div className="school-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-sky-600" />
              Daily Class Attendance
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select class standard, division and date to mark or edit student attendance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenHistory && (
              <button
                onClick={onOpenHistory}
                className="btn-outline btn-sm text-xs flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Attendance History</span>
              </button>
            )}

            <button
              onClick={handleMarkAllPresent}
              disabled={records.length === 0}
              className="btn-secondary btn-sm text-xs flex items-center gap-1.5 bg-sky-50 text-sky-700 border-sky-200"
            >
              <CheckCheck className="w-4 h-4 text-sky-600" />
              <span>Mark All Present</span>
            </button>
          </div>
        </div>

        {/* 4 Selection Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="form-label text-xs">Class Standard</label>
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              className="form-select"
            >
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  Standard {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label text-xs">Division / Section</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="form-select"
            >
              {activeDivisions.map((div) => (
                <option key={div._id} value={div._id}>
                  Division {div.name} ({div.studentCount || 0} students)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label text-xs">Attendance Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Academic Session</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="form-select"
            >
              <option value="2026-2027">AY 2026-2027</option>
              <option value="2025-2026">AY 2025-2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Statistics Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="school-card p-3.5 bg-sky-50/50 border-sky-100">
          <span className="text-[10px] uppercase font-bold text-sky-700">Total Enrolled</span>
          <p className="text-xl font-bold text-sky-900 mt-0.5">{stats.total}</p>
        </div>

        <div className="school-card p-3.5 bg-emerald-50/50 border-emerald-100">
          <span className="text-[10px] uppercase font-bold text-emerald-700">Present</span>
          <p className="text-xl font-bold text-emerald-800 mt-0.5">{stats.present}</p>
        </div>

        <div className="school-card p-3.5 bg-rose-50/50 border-rose-100">
          <span className="text-[10px] uppercase font-bold text-rose-700">Absent</span>
          <p className="text-xl font-bold text-rose-800 mt-0.5">{stats.absent}</p>
        </div>

        <div className="school-card p-3.5 bg-amber-50/50 border-amber-100">
          <span className="text-[10px] uppercase font-bold text-amber-700">On Leave</span>
          <p className="text-xl font-bold text-amber-800 mt-0.5">{stats.leave}</p>
        </div>

        <div className="school-card p-3.5 bg-indigo-50/50 border-indigo-100">
          <span className="text-[10px] uppercase font-bold text-indigo-700">Late</span>
          <p className="text-xl font-bold text-indigo-800 mt-0.5">{stats.late}</p>
        </div>

        <div className="school-card p-3.5 bg-cyan-50/60 border-cyan-100 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-cyan-700">Attendance Rate</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xl font-bold text-cyan-900">{stats.rate}%</span>
            <div className="w-12 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all"
                style={{ width: `${stats.rate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="school-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Student Attendance Register
            </h3>
            <span
              className={`badge text-[10px] ${
                isRecorded ? 'badge-present' : 'badge-warning'
              }`}
            >
              {isRecorded ? '● Already Recorded (Editing Mode)' : '● Not Marked Yet'}
            </span>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || records.length === 0}
            className="btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Submit Attendance'}</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading student roster...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No students found enrolled in Standard {activeClassObj?.name} Division{' '}
            {activeDivisions.find((d) => d._id === selectedDivision)?.name || ''}.
          </div>
        ) : (
          <div className="table-container border-0 rounded-none">
            <table className="school-table">
              <thead>
                <tr>
                  <th className="w-16">Roll No</th>
                  <th>Student Info</th>
                  <th className="w-72">Attendance Status</th>
                  <th>Reason / Remarks (if Absent or on Leave)</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item) => {
                  const student = item.studentId;
                  const studentId = student?._id || student;

                  return (
                    <tr key={studentId} className="hover:bg-sky-50/30">
                      <td className="font-mono font-bold text-xs text-slate-700">
                        {student?.rollNo || '-'}
                      </td>

                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-600">
                            {student?.photo ? (
                              <img src={student.photo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              student?.name?.charAt(0) || 'S'
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{student?.name || 'Student'}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{student?.admissionNo}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        {/* 4 Status Pills Toggle */}
                        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 gap-1 text-xs">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(studentId, 'Present')}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                              item.status === 'Present'
                                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                                : 'text-slate-600 hover:text-emerald-700'
                            }`}
                          >
                            Present
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(studentId, 'Absent')}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                              item.status === 'Absent'
                                ? 'bg-rose-600 text-white font-semibold shadow-xs'
                                : 'text-slate-600 hover:text-rose-700'
                            }`}
                          >
                            Absent
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(studentId, 'Leave')}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                              item.status === 'Leave'
                                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                                : 'text-slate-600 hover:text-amber-700'
                            }`}
                          >
                            Leave
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(studentId, 'Late')}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                              item.status === 'Late'
                                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                : 'text-slate-600 hover:text-blue-700'
                            }`}
                          >
                            Late
                          </button>
                        </div>
                      </td>

                      <td>
                        <input
                          type="text"
                          value={item.reason || ''}
                          onChange={(e) => handleReasonChange(studentId, e.target.value)}
                          placeholder={
                            item.status === 'Absent'
                              ? 'e.g. Fever, Medical reason'
                              : item.status === 'Leave'
                              ? 'e.g. Family function leave'
                              : item.status === 'Late'
                              ? 'e.g. Bus delay'
                              : '-'
                          }
                          className="form-input text-xs py-1.5"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Ensure all records are reviewed before finalizing daily attendance.
          </p>
          <button
            onClick={handleSave}
            disabled={saving || records.length === 0}
            className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Submitting...' : 'Save & Submit Attendance'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
