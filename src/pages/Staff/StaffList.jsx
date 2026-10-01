import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { StaffFormModal } from './StaffFormModal';
import { StaffProfileModal } from './StaffProfileModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Wallet,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

export const StaffList = ({ onPaySalary }) => {
  const { addToast, formatCurrency } = useSchool();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileStaffId, setProfileStaffId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, staffId: null, staffName: '' });

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedDepartment) params.department = selectedDepartment;
      if (selectedStatus) params.employmentStatus = selectedStatus;

      const res = await api.getStaff(params);
      if (res.success && res.data) {
        setStaffList(res.data);
      }
    } catch (err) {
      console.error('Failed to load staff list:', err);
      addToast('Failed to load staff records', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, selectedDepartment, selectedStatus, addToast]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleDeleteStaff = async () => {
    try {
      await api.deleteStaff(deleteConfirm.staffId);
      addToast(`Staff member ${deleteConfirm.staffName} deleted`, 'success');
      fetchStaff();
    } catch (err) {
      addToast(err.message || 'Failed to delete staff member', 'error');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Filter Card */}
      <div className="school-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 input-icon-left" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff by Name, Staff ID, Phone or Designation..."
              className="form-input input-with-icon-left text-xs"
            />
          </div>

          <button
            onClick={() => {
              setEditingStaff(null);
              setFormModalOpen(true);
            }}
            className="btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Staff Member</span>
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="form-select py-1.5 text-xs"
          >
            <option value="">All Departments</option>
            <option value="Teaching">Teaching / Faculty</option>
            <option value="Administration">Administration</option>
            <option value="Finance">Finance & Accounts</option>
            <option value="Support">Support Staff</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-select py-1.5 text-xs"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading staff records...</p>
        </div>
      ) : staffList.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Staff Members Found"
          description="Try modifying search query or add a new faculty member."
          actionLabel="Add Staff Member"
          onAction={() => {
            setEditingStaff(null);
            setFormModalOpen(true);
          }}
        />
      ) : (
        <div className="table-container shadow-xs">
          <table className="school-table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Faculty / Staff Details</th>
                <th>Designation & Dept</th>
                <th>Contact</th>
                <th>Basic Salary</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((member) => (
                <tr key={member._id}>
                  <td className="font-mono text-xs font-semibold text-sky-700">
                    {member.staffId}
                  </td>

                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">
                        {member.photo ? (
                          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-xs">{member.name}</p>
                        <p className="text-[10px] text-slate-400">{member.qualification || 'Educator'}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <p className="text-xs font-medium text-slate-800">{member.designation}</p>
                    <span className="text-[10px] text-sky-600 font-semibold uppercase tracking-wider">
                      {member.department}
                    </span>
                  </td>

                  <td>
                    <div className="space-y-0.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[140px]">{member.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="font-mono text-xs font-bold text-slate-800">
                    {formatCurrency(member.basicSalary)}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        member.employmentStatus === 'active' ? 'badge-active' : 'badge-danger'
                      }`}
                    >
                      {member.employmentStatus === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="text-right">
                    <div className="inline-flex items-center gap-1">
                      {onPaySalary && (
                        <button
                          onClick={() => onPaySalary(member)}
                          className="px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-medium flex items-center gap-1"
                          title="Disburse Salary"
                        >
                          <Wallet className="w-3.5 h-3.5 text-sky-600" />
                          <span>Pay</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setProfileStaffId(member._id);
                          setProfileModalOpen(true);
                        }}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingStaff(member);
                          setFormModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Staff"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            staffId: member._id,
                            staffName: member.name,
                          })
                        }
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Staff"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <StaffFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        staff={editingStaff}
        onSaved={fetchStaff}
      />

      <StaffProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        staffId={profileStaffId}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, staffId: null, staffName: '' })}
        onConfirm={handleDeleteStaff}
        title="Delete Staff Member"
        message={`Are you sure you want to remove ${deleteConfirm.staffName} from staff records?`}
        confirmText="Delete Staff"
      />
    </div>
  );
};
