import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import {
  TrendingUp,
  Plus,
  Search,
  Download,
  Trash2,
  Calendar,
  CreditCard,
  User,
  Sparkles,
} from 'lucide-react';

export const IncomeList = () => {
  const { addToast, formatCurrency } = useSchool();

  const [incomes, setIncomes] = useState([]);
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
    category: 'Tuition Fee',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    receivedFrom: '',
    description: '',
    receiptNo: `REC-${Date.now().toString().slice(-6)}`,
    notes: '',
  });

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const categories = [
    'Admission Fee',
    'Tuition Fee',
    'Exam Fee',
    'Transport Fee',
    'Uniform Fee',
    'Books',
    'Event Fee',
    'Donation',
    'Other Income',
  ];

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (paymentMethod) params.paymentMethod = paymentMethod;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.getIncomes(params);
      if (res.success && res.data) {
        setIncomes(res.data);
        setTotalAmount(res.totalAmount || 0);
      }
    } catch (err) {
      console.error('Failed to load incomes:', err);
      addToast('Failed to load income records', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, category, paymentMethod, startDate, endDate, addToast]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      category: 'Tuition Fee',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Online / UPI',
      receivedFrom: '',
      description: '',
      receiptNo: `REC-${Date.now().toString().slice(-6)}`,
      notes: '',
    });
    setModalOpen(true);
  };

  const handleSaveIncome = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      addToast('Please provide a title and amount', 'error');
      return;
    }

    try {
      await api.createIncome(formData);
      addToast('Income collection recorded successfully', 'success');
      setModalOpen(false);
      fetchIncomes();
    } catch (err) {
      addToast(err.message || 'Failed to save income record', 'error');
    }
  };

  const handleDeleteIncome = async () => {
    try {
      await api.deleteIncome(deleteConfirm.id);
      addToast('Income record deleted', 'success');
      fetchIncomes();
    } catch (err) {
      addToast(err.message || 'Failed to delete income', 'error');
    }
  };

  const exportCSV = () => {
    if (incomes.length === 0) return addToast('No records to export', 'warning');
    const headers = ['Receipt No', 'Title', 'Category', 'Amount', 'Date', 'Payment Method', 'Received From'];
    const rows = incomes.map((i) => [
      i.receiptNo || '',
      `"${i.title}"`,
      i.category,
      i.amount,
      new Date(i.date).toLocaleDateString('en-GB'),
      i.paymentMethod,
      `"${i.receivedFrom || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `School_Incomes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Income records exported', 'success');
  };

  return (
    <div className="space-y-5">
      {/* Header & Filter Card */}
      <div className="school-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              School Income & Fee Collections
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Record tuition fees, admission fees, bus transport, book supplies and donations.
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
              <span>Record Income</span>
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
              placeholder="Search title, payer or receipt..."
              className="form-input input-with-icon-left py-1.5 text-xs"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select py-1.5 text-xs"
          >
            <option value="">All Categories</option>
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
            <option value="Cash">Cash</option>
            <option value="Bank">Bank Transfer</option>
            <option value="Online / UPI">Online / UPI</option>
            <option value="Cheque">Cheque</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input py-1.5 text-xs"
            placeholder="From Date"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input py-1.5 text-xs"
            placeholder="To Date"
          />
        </div>
      </div>

      {/* Income Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading income logs...</p>
        </div>
      ) : incomes.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No Income Records"
          description="Record student fees, donations or institutional incomes."
          actionLabel="Record Income"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container shadow-xs">
          <table className="school-table">
            <thead>
              <tr>
                <th>Receipt / Date</th>
                <th>Income Title</th>
                <th>Category</th>
                <th>Received From</th>
                <th>Payment Mode</th>
                <th>Amount</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((inc) => (
                <tr key={inc._id}>
                  <td>
                    <span className="font-mono text-xs font-bold text-sky-700 block">
                      {inc.receiptNo || 'REC'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(inc.date).toLocaleDateString('en-GB')}
                    </span>
                  </td>

                  <td>
                    <p className="text-xs font-semibold text-slate-800">{inc.title}</p>
                    {inc.description && <p className="text-[10px] text-slate-400 truncate max-w-xs">{inc.description}</p>}
                  </td>

                  <td>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-100">
                      {inc.category}
                    </span>
                  </td>

                  <td>
                    <span className="text-xs text-slate-700">{inc.receivedFrom || '-'}</span>
                  </td>

                  <td>
                    <span className="badge badge-info text-[11px]">{inc.paymentMethod}</span>
                  </td>

                  <td className="font-mono text-xs font-bold text-emerald-600">
                    +{formatCurrency(inc.amount)}
                  </td>

                  <td className="text-right">
                    <button
                      onClick={() => setDeleteConfirm({ isOpen: true, id: inc._id })}
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
            <span className="text-slate-600">Total Filtered Income ({incomes.length} records)</span>
            <span className="font-mono text-sm font-bold text-emerald-600">
              +{formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record New School Income"
        subtitle="Log student tuition fee, registration, transport or donation receipts."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveIncome} className="space-y-4">
          <div>
            <label className="form-label text-xs">Income Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Grade 10 Term 1 Tuition Fee"
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
                placeholder="e.g. 25000"
                className="form-input font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label text-xs">Collection Date</label>
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
                <option value="Online / UPI">Online / UPI</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Received From (Student / Parent / Donor Name)</label>
            <input
              type="text"
              value={formData.receivedFrom}
              onChange={(e) => setFormData({ ...formData, receivedFrom: e.target.value })}
              placeholder="e.g. Aarav Sharma (Father: Rajesh Sharma)"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Receipt / Voucher Reference</label>
            <input
              type="text"
              value={formData.receiptNo}
              onChange={(e) => setFormData({ ...formData, receiptNo: e.target.value })}
              placeholder="e.g. REC-2026-99"
              className="form-input font-mono"
            />
          </div>

          <div>
            <label className="form-label text-xs">Notes / Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="e.g. Paid in full for Quarter 1"
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
              <span>Save Income</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDeleteIncome}
        title="Delete Income Record"
        message="Are you sure you want to delete this income entry from records?"
        confirmText="Delete Income"
      />
    </div>
  );
};
