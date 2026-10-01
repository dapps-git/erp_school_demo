import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../../components/Modal';
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  GraduationCap,
  Wallet,
} from 'lucide-react';

export const StaffProfileModal = ({ isOpen, onClose, staffId }) => {
  const { formatCurrency } = useSchool();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      if (!staffId || !isOpen) return;
      setLoading(true);
      try {
        const res = await api.getStaffById(staffId);
        if (res.success && res.data) {
          setProfileData(res.data);
        }
      } catch (err) {
        console.error('Failed to load staff details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, [staffId, isOpen]);

  if (!isOpen) return null;

  const staff = profileData?.staff;
  const salaries = profileData?.salaries || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Staff Member Profile"
      subtitle={staff ? `${staff.name} • ${staff.staffId}` : 'Loading...'}
      maxWidth="max-w-3xl"
    >
      {loading || !staff ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading staff records...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 overflow-hidden flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {staff.photo ? (
                <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
              ) : (
                staff.name.charAt(0)
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold">
                  {staff.staffId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-100 text-[11px] font-semibold">
                  {staff.department}
                </span>
              </div>
              <h2 className="text-xl font-bold">{staff.name}</h2>
              <p className="text-xs text-sky-100">{staff.designation}</p>
              <p className="text-[11px] text-sky-200">
                Joined on {new Date(staff.joiningDate).toLocaleDateString('en-GB')} • Basic Salary: {formatCurrency(staff.basicSalary)}/mo
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="school-card p-4 space-y-2.5">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
                Contact & Personal
              </h4>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-600" />
                <span className="font-mono">{staff.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-600" />
                <span className="truncate">{staff.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{staff.address || 'Address not listed'}</span>
              </div>
            </div>

            <div className="school-card p-4 space-y-2.5">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
                Academic & Qualifications
              </h4>
              <div>
                <span className="text-slate-400 block text-[10px]">Degrees / Certifications</span>
                <span className="font-medium text-slate-700">{staff.qualification || 'Standard Qualification'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Employment Status</span>
                <span className="badge badge-active capitalize">{staff.employmentStatus}</span>
              </div>
            </div>
          </div>

          {/* Salary History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-sky-600" /> Recent Salary Disbursed ({salaries.length})
            </h4>

            {salaries.length === 0 ? (
              <p className="p-4 rounded-xl bg-slate-50 text-slate-400 text-xs text-center">
                No salary disbursement history recorded yet.
              </p>
            ) : (
              <div className="table-container max-h-48 overflow-y-auto">
                <table className="school-table text-xs">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Basic</th>
                      <th>Bonus/Allow.</th>
                      <th>Deduction</th>
                      <th>Net Paid</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaries.map((s) => (
                      <tr key={s._id}>
                        <td className="font-bold text-slate-700">{s.salaryMonth}</td>
                        <td className="font-mono">{formatCurrency(s.basicSalary)}</td>
                        <td className="font-mono text-emerald-600">+{formatCurrency(s.bonus + s.otherAmount)}</td>
                        <td className="font-mono text-rose-600">-{formatCurrency(s.deduction)}</td>
                        <td className="font-mono font-bold text-sky-700">{formatCurrency(s.netSalary)}</td>
                        <td className="text-slate-400">{new Date(s.paymentDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
