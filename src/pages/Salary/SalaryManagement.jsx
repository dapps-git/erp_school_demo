import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { PayslipModal } from './PayslipModal';
import { EmptyState } from '../../components/EmptyState';
import {
  Wallet,
  Plus,
  Printer,
  Edit2,
  Trash2,
  Calculator,
  Calendar,
  CheckCircle2,
  Filter,
  Users,
  Sparkles,
} from 'lucide-react';

export const SalaryManagement = ({ preselectedStaff }) => {
  const { addToast, formatCurrency } = useSchool();

  const [staffList, setStaffList] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStaff, setFilterStaff] = useState('');

  // Payment Form Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [formData, setFormData] = useState({
    staffId: '',
    salaryMonth: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    basicSalary: 0,
    bonus: 0,
    deduction: 0,
    otherAmount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank',
    paymentStatus: 'Paid',
    transactionRef: '',
    notes: '',
  });

  // Payslip Modal
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [selectedSalaryForSlip, setSelectedSalaryForSlip] = useState(null);

  // Delete Confirm
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  // Load staff options
  const loadStaffList = async () => {
    try {
      const res = await api.getStaff({ employmentStatus: 'active' });
      if (res.success && res.data) {
        setStaffList(res.data);
      }
    } catch (e) {}
  };

  const fetchSalaries = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterMonth) params.month = filterMonth;
      if (filterStaff) params.staffId = filterStaff;

      const res = await api.getSalaries(params);
      if (res.success && res.data) {
        setSalaries(res.data);
      }
    } catch (err) {
      console.error('Failed to load salaries:', err);
      addToast('Failed to load salary disbursements', 'error');
    } finally {
      setLoading(false);
    }
  }, [filterMonth, filterStaff, addToast]);

  useEffect(() => {
    loadStaffList();
    fetchSalaries();
  }, [fetchSalaries]);

  // If preselected staff passed from Staff page
  useEffect(() => {
    if (preselectedStaff) {
      handleOpenPayModal(preselectedStaff);
    }
  }, [preselectedStaff]);

  const handleOpenPayModal = (staff) => {
    const sId = staff ? staff._id : (staffList[0]?._id || '');
    const found = staffList.find((s) => s._id === sId) || staff;
    const bSalary = found ? found.basicSalary : 0;

    setEditingSalary(null);
    setFormData({
      staffId: sId,
      salaryMonth: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      basicSalary: bSalary,
      bonus: 0,
      deduction: 0,
      otherAmount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank',
      paymentStatus: 'Paid',
      transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: 'Monthly salary disbursement',
    });
    setPayModalOpen(true);
  };

  const handleStaffSelect = (staffId) => {
    const found = staffList.find((s) => s._id === staffId);
    setFormData((prev) => ({
      ...prev,
      staffId,
      basicSalary: found ? found.basicSalary : prev.basicSalary,
    }));
  };

  // Live calculation: Net Salary = Basic + Bonus + Other - Deduction
  const calculatedNet = Math.max(
    0,
    Number(formData.basicSalary || 0) +
      Number(formData.bonus || 0) +
      Number(formData.otherAmount || 0) -
      Number(formData.deduction || 0)
  );

  const handleSaveSalary = async (e) => {
    e.preventDefault();
    if (!formData.staffId) {
      addToast('Please select a staff member', 'error');
      return;
    }

    try {
      if (editingSalary) {
        await api.updateSalary(editingSalary._id, formData);
        addToast('Salary record updated successfully', 'success');
      } else {
        await api.createSalary(formData);
        addToast('Salary disbursed and recorded successfully!', 'success');
      }
      setPayModalOpen(false);
      fetchSalaries();
    } catch (err) {
      addToast(err.message || 'Failed to record salary', 'error');
    }
  };

  const handleDeleteSalary = async () => {
    try {
      await api.deleteSalary(deleteConfirm.id);
      addToast('Salary record deleted', 'success');
      fetchSalaries();
    } catch (err) {
      addToast(err.message || 'Failed to delete salary', 'error');
    }
  };

  // Month totals
  const totalDisbursed = salaries.reduce((sum, s) => sum + s.netSalary, 0);

  return (
    <div className="space-y-5">
      {/* Top Filter & Summary Header */}
      <div className="school-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-sky-600" />
              Staff Salary Management & Payroll
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Auto-calculate net salary (Basic + Bonus + Other - Deduction) and print slips.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right pr-3 border-r border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Filtered Payout</span>
              <p className="text-sm font-bold text-sky-700 font-mono">{formatCurrency(totalDisbursed)}</p>
            </div>

            <button
              onClick={() => handleOpenPayModal(null)}
              className="btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Salary Payment</span>
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="form-input py-1.5 text-xs"
              placeholder="Filter by Salary Month"
            />
          </div>

          <div>
            <select
              value={filterStaff}
              onChange={(e) => setFilterStaff(e.target.value)}
              className="form-select py-1.5 text-xs"
            >
              <option value="">All Faculty & Staff Members</option>
              {staffList.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.staffId})
                </option>
              ))}
            </select>
          </div>

          {(filterMonth || filterStaff) && (
            <button
              onClick={() => {
                setFilterMonth('');
                setFilterStaff('');
              }}
              className="btn-outline btn-sm text-xs py-1.5"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Salary Records Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading payroll history...</p>
        </div>
      ) : salaries.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No Salary Records Found"
          description="Record monthly salary payments for teachers and school staff."
          actionLabel="Record New Salary"
          onAction={() => handleOpenPayModal(null)}
        />
      ) : (
        <div className="table-container shadow-xs">
          <table className="school-table">
            <thead>
              <tr>
                <th>Salary Month</th>
                <th>Staff Member</th>
                <th>Basic Salary</th>
                <th>Bonus & Additions</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Payment Details</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((sal) => {
                const staff = sal.staffId;
                return (
                  <tr key={sal._id}>
                    <td className="font-mono font-bold text-xs text-slate-800">
                      {sal.salaryMonth}
                    </td>

                    <td>
                      <div>
                        <p className="font-semibold text-slate-800 text-xs">{staff?.name || 'Staff'}</p>
                        <p className="text-[10px] text-slate-400">
                          {staff?.staffId} • {staff?.designation || 'Faculty'}
                        </p>
                      </div>
                    </td>

                    <td className="font-mono text-xs">{formatCurrency(sal.basicSalary)}</td>

                    <td className="font-mono text-xs text-emerald-600">
                      +{formatCurrency(sal.bonus + sal.otherAmount)}
                    </td>

                    <td className="font-mono text-xs text-rose-600">
                      -{formatCurrency(sal.deduction)}
                    </td>

                    <td className="font-mono text-xs font-bold text-sky-700">
                      {formatCurrency(sal.netSalary)}
                    </td>

                    <td>
                      <div className="text-[11px] text-slate-600">
                        <span className="font-medium">{sal.paymentMethod}</span>
                        <span className="text-slate-400 block text-[10px]">
                          {new Date(sal.paymentDate).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          sal.paymentStatus === 'Paid' ? 'badge-paid' : 'badge-pending'
                        }`}
                      >
                        {sal.paymentStatus}
                      </span>
                    </td>

                    <td className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedSalaryForSlip(sal);
                            setPayslipModalOpen(true);
                          }}
                          className="px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-medium flex items-center gap-1"
                          title="Print Payslip"
                        >
                          <Printer className="w-3.5 h-3.5 text-sky-600" />
                          <span>Slip</span>
                        </button>

                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              id: sal._id,
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Disburse Salary Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title={editingSalary ? 'Edit Salary Record' : 'Record Staff Salary Payment'}
        subtitle="Automatic net calculation: Net = Basic + Bonus + Other - Deduction"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveSalary} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-xs">Select Faculty / Staff Member *</label>
              <select
                value={formData.staffId}
                onChange={(e) => handleStaffSelect(e.target.value)}
                required
                className="form-select"
              >
                <option value="">Choose Staff Member</option>
                {staffList.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.staffId} - {s.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label text-xs">Salary Month (YYYY-MM) *</label>
              <input
                type="month"
                value={formData.salaryMonth}
                onChange={(e) => setFormData({ ...formData, salaryMonth: e.target.value })}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Salary Breakdown Fields */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-sky-600" /> Salary Computation Breakdown
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="form-label text-[11px]">Basic Salary (₹)</label>
                <input
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                  min={0}
                  className="form-input font-mono text-xs"
                />
              </div>

              <div>
                <label className="form-label text-[11px] text-emerald-700">Bonus (₹)</label>
                <input
                  type="number"
                  value={formData.bonus}
                  onChange={(e) => setFormData({ ...formData, bonus: Number(e.target.value) })}
                  min={0}
                  className="form-input font-mono text-xs border-emerald-200"
                />
              </div>

              <div>
                <label className="form-label text-[11px] text-sky-700">Other Allow. (₹)</label>
                <input
                  type="number"
                  value={formData.otherAmount}
                  onChange={(e) => setFormData({ ...formData, otherAmount: Number(e.target.value) })}
                  min={0}
                  className="form-input font-mono text-xs border-sky-200"
                />
              </div>

              <div>
                <label className="form-label text-[11px] text-rose-700">Deduction (₹)</label>
                <input
                  type="number"
                  value={formData.deduction}
                  onChange={(e) => setFormData({ ...formData, deduction: Number(e.target.value) })}
                  min={0}
                  className="form-input font-mono text-xs border-rose-200"
                />
              </div>
            </div>

            {/* Live Net Result Card */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white flex items-center justify-between mt-2">
              <div>
                <span className="text-[10px] text-sky-100 uppercase tracking-wider font-semibold">Calculated Net Payout</span>
                <p className="text-xs text-sky-200">Formula: {formData.basicSalary} + {formData.bonus} + {formData.otherAmount} - {formData.deduction}</p>
              </div>
              <h3 className="text-xl font-bold font-mono">{formatCurrency(calculatedNet)}</h3>
            </div>
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="form-label text-xs">Payment Date</label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label text-xs">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="form-select"
              >
                <option value="Bank">Bank Transfer / NEFT</option>
                <option value="Cash">Cash</option>
                <option value="Other">Other Mode</option>
              </select>
            </div>

            <div>
              <label className="form-label text-xs">Transaction Reference / UTR</label>
              <input
                type="text"
                value={formData.transactionRef}
                onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                placeholder="e.g. TXN-998811"
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Payment Notes / Description</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Monthly salary disbursed on time"
              className="form-input"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setPayModalOpen(false)}
              className="btn-outline btn-sm"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary btn-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save & Disburse Salary</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Payslip Modal */}
      <PayslipModal
        isOpen={payslipModalOpen}
        onClose={() => setPayslipModalOpen(false)}
        salary={selectedSalaryForSlip}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDeleteSalary}
        title="Delete Salary Record"
        message="Are you sure you want to delete this salary disbursement record?"
        confirmText="Delete Record"
      />
    </div>
  );
};
