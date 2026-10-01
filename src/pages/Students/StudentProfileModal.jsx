import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../../components/Modal';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  ShieldCheck,
  CreditCard,
  User,
} from 'lucide-react';

export const StudentProfileModal = ({ isOpen, onClose, studentId }) => {
  const { formatCurrency, settings } = useSchool();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!studentId || !isOpen) return;
      setLoading(true);
      try {
        const res = await api.getStudent(studentId);
        if (res.success && res.data) {
          setProfileData(res.data);
        }
      } catch (err) {
        console.error('Failed to load student profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [studentId, isOpen]);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const student = profileData?.student;
  const stats = profileData?.attendanceStats || { totalDays: 0, present: 0, absent: 0, late: 0, leave: 0, attendanceRate: 100 };
  const recentAttendance = profileData?.recentAttendance || [];
  const feeRecords = profileData?.feeRecords || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Profile & ID Card"
      subtitle={student ? `${student.name} • ${student.admissionNo}` : 'Loading...'}
      maxWidth="max-w-4xl"
    >
      {loading || !student ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading student profile details...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Profile Badge Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-500 text-white shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
            <div className="w-24 h-24 rounded-2xl bg-white/20 border-2 border-white/40 overflow-hidden flex-shrink-0 flex items-center justify-center text-white shadow-md">
              {student.photo ? (
                <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-white/80" />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold tracking-wide uppercase">
                  {student.admissionNo}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                  student.status === 'active' ? 'bg-emerald-400/30 text-emerald-100 border border-emerald-300/40' : 'bg-rose-400/30 text-rose-100'
                }`}>
                  {student.status}
                </span>
              </div>

              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-xs text-sky-100 font-light">
                Standard {student.classId?.name || '-'} • Division {student.divisionId?.name || '-'} • Roll No: {student.rollNo}
              </p>
              <p className="text-[11px] text-sky-200">
                Academic Session: {student.academicYear} • Blood Group: {student.bloodGroup || 'A+'}
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="btn-secondary btn-sm bg-white text-sky-700 text-xs flex items-center gap-1.5 self-center sm:self-start shadow-xs"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>Print Profile</span>
            </button>
          </div>

          {/* 3-Column Info Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1: Academic & Personal */}
            <div className="school-card p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <GraduationCap className="w-4 h-4 text-sky-600" /> Personal & Academic
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Date of Birth</span>
                  <span className="font-medium text-slate-700">
                    {student.dob ? new Date(student.dob).toLocaleDateString('en-GB') : '-'} ({student.gender})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Admission Date</span>
                  <span className="font-medium text-slate-700">
                    {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString('en-GB') : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Previous School</span>
                  <span className="font-medium text-slate-700">{student.previousSchool || 'Direct Entry'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Curriculum Program</span>
                  <span className="font-medium text-slate-700">{student.course || 'Standard CBSE'}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Parent & Guardian Details */}
            <div className="school-card p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Phone className="w-4 h-4 text-cyan-600" /> Parent Information
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Father's Name</span>
                  <span className="font-medium text-slate-700">{student.fatherName || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Mother's Name</span>
                  <span className="font-medium text-slate-700">{student.motherName || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Primary Phone</span>
                  <span className="font-medium text-sky-600 font-mono">{student.parentPhone}</span>
                </div>
                {student.altPhone && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Alternative Phone</span>
                    <span className="font-medium text-slate-700 font-mono">{student.altPhone}</span>
                  </div>
                )}
                {student.email && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email</span>
                    <span className="font-medium text-slate-700 truncate block">{student.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Attendance Meter & Summary */}
            <div className="school-card p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Calendar className="w-4 h-4 text-emerald-600" /> Attendance Overview
              </h4>

              <div className="text-center py-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 font-bold text-lg">
                  {stats.attendanceRate}%
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Overall Attendance Rate</p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <span className="block font-bold">{stats.present}</span>
                  <span className="text-[9px]">Present</span>
                </div>
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
                  <span className="block font-bold">{stats.absent}</span>
                  <span className="text-[9px]">Absent</span>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <span className="block font-bold">{stats.leave + stats.late}</span>
                  <span className="text-[9px]">Leave/Late</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address & Notes */}
          {(student.address || student.notes) && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              {student.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-600">{student.address}</p>
                </div>
              )}
              {student.notes && (
                <p className="text-slate-500 italic pl-6">
                  Note: {student.notes}
                </p>
              )}
            </div>
          )}

          {/* Recent Attendance Logs Table */}
          {recentAttendance.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Recent Attendance History (Last {recentAttendance.length} Days)
              </h4>
              <div className="table-container max-h-48 overflow-y-auto">
                <table className="school-table text-xs">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Reason / Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttendance.map((rec, i) => (
                      <tr key={i}>
                        <td className="font-mono text-slate-600">{rec.date}</td>
                        <td>
                          <span
                            className={`badge ${
                              rec.status === 'Present'
                                ? 'badge-present'
                                : rec.status === 'Absent'
                                ? 'badge-absent'
                                : rec.status === 'Late'
                                ? 'badge-late'
                                : 'badge-leave'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="text-slate-500">{rec.reason || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
