import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import {
  TrendingDown,
  Plus,
  Search,
  Download,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const ExpenseList = () => {
  const { addToast, formatCurrency } = useSchool();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Office Expenses',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank',
    paidTo: '',
    description: '',
    voucherNo: `VOU-${Date.now().toString().slice(-6)}`,
    notes: '',
  });

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const categories = [
    'Staff Salary',
    'Electricity',
    'Water',
    'Internet',
    'Rent',
    'Maintenance',
    'Stationery',
    'Books',
    'Uniform',
    'Transport',
    'Cleaning',
    'Events',
    'Office Expenses',
    'Other Expenses',
  ];

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (paymentMethod) params.paymentMethod = paymentMethod;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.getExpenses(params);
      if (res.success && res.data) {
        setExpenses(res.data);
        setTotalAmount(res.totalAmount || 0);
      }
    } catch (err) {
      console.error('Failed to load expenses:', err);
      addToast('Failed to load expense records', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, category, paymentMethod, startDate, endDate, addToast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      category: 'Office Expenses',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank',
      paidTo: '',
      description: '',
      voucherNo: `VOU-${Date.now().toString().slice(-6)}`,
      notes: '',
    });
    setModalOpen(true);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      addToast('Please provide a title and amount', 'error');
      return;
    }

    try {
      await api.createExpense(formData);
      addToast('Expense recorded successfully', 'success');
      setModalOpen(false);
      fetchExpenses();
    } catch (err) {
      addToast(err.message || 'Failed to save expense', 'error');
    }
  };

  const handleDeleteExpense = async () => {
    try {
      await api.deleteExpense(deleteConfirm.id);
      addToast('Expense entry deleted', 'success');
      fetchExpenses();
    } catch (err) {
      addToast(err.message || 'Failed to delete expense', 'error');
    }
  };

  const exportCSV = () => {
    if (expenses.length === 0) return addToast('No records to export', 'warning');
    const headers = ['Voucher No', 'Title', 'Category', 'Amount', 'Date', 'Payment Method', 'Paid To'];
    const rows = expenses.map((e) => [
      e.voucherNo || '',
      `"${e.title}"`,
      e.category,
      e.amount,
      new Date(e.date).toLocaleDateString('en-GB'),
      e.paymentMethod,
      `"${e.paidTo || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `School_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Expense records exported', 'success');
  };

  return (
    <div className="space-y-5">
      {/* Header & Filter Card */}
      <div className="school-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-600" />
              School Operational Expenses
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Track utilities, maintenance, campus repairs, vendor invoices and event expenses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="btn-outline btn-sm text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 input-icon-left" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, payee or voucher..."
              className="form-input input-with-icon-left py-1.5 text-xs"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select py-1.5 text-xs"
          >
            <option value="">All Expense Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="form-select py-1.5 text-xs"
          >
            <option value="">All Payment Modes</option>
            <option value="Bank">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Online / UPI">Online / UPI</option>
            <option value="Cheque">Cheque</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input py-1.5 text-xs"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Expense Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading expenses...</p>
        </div>
      ) : expenses.length === 0 ? (
        <EmptyState
          icon={TrendingDown}
          title="No Expense Entries"
          description="Log school utility bills, supplies, repairs or event costs."
          actionLabel="Add First Expense"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container shadow-xs">
          <table className="school-table">
            <thead>
              <tr>
                <th>Voucher / Date</th>
                <th>Expense Title</th>
                <th>Category</th>
                <th>Paid To / Vendor</th>
                <th>Payment Mode</th>
                <th>Amount</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>
                    <span className="font-mono text-xs font-bold text-slate-700 block">
                      {exp.voucherNo || 'VOU'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(exp.date).toLocaleDateString('en-GB')}
                    </span>
                  </td>

                  <td>
                    <p className="text-xs font-semibold text-slate-800">{exp.title}</p>
                    {exp.description && <p className="text-[10px] text-slate-400 truncate max-w-xs">{exp.description}</p>}
                  </td>

                  <td>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-100">
                      {exp.category}
                    </span>
                  </td>

                  <td>
                    <span className="text-xs text-slate-700">{exp.paidTo || '-'}</span>
                  </td>

                  <td>
                    <span className="badge badge-info text-[11px]">{exp.paymentMethod}</span>
                  </td>

                  <td className="font-mono text-xs font-bold text-rose-600">
                    -{formatCurrency(exp.amount)}
                  </td>

                  <td className="text-right">
                    <button
                      onClick={() => setDeleteConfirm({ isOpen: true, id: exp._id })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Footer Total */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">Total Filtered Expenses ({expenses.length} records)</span>
            <span className="font-mono text-sm font-bold text-rose-600">
              -{formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record New School Expense"
        subtitle="Record vendor payments, maintenance, bills and school costs."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveExpense} className="space-y-4">
          <div>
            <label className="form-label text-xs">Expense Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Monthly Campus Electricity Bill"
              required
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label text-xs">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label text-xs">Amount (₹) *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
                min={1}
                placeholder="e.g. 15000"
                className="form-input font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label text-xs">Expense Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                <option value="Bank">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Online / UPI">Online / UPI</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Paid To (Vendor / Contractor / Company)</label>
            <input
              type="text"
              value={formData.paidTo}
              onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
              placeholder="e.g. State Electricity Board / TechEdu"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Voucher Reference Number</label>
            <input
              type="text"
              value={formData.voucherNo}
              onChange={(e) => setFormData({ ...formData, voucherNo: e.target.value })}
              placeholder="e.g. VOU-2026-10"
              className="form-input font-mono"
            />
          </div>

          <div>
            <label className="form-label text-xs">Description / Remarks</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="e.g. Approved by Principal"
              className="form-textarea"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-outline btn-sm"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary btn-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save Expense</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDeleteExpense}
        title="Delete Expense Record"
        message="Are you sure you want to delete this expense entry?"
        confirmText="Delete Expense"
      />
    </div>
  );
};
