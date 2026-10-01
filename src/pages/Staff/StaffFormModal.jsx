import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../../components/Modal';
import { Users, Briefcase, Phone, DollarSign, Sparkles } from 'lucide-react';

export const StaffFormModal = ({ isOpen, onClose, staff, onSaved }) => {
  const { addToast } = useSchool();

  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    photo: '',
    gender: 'Female',
    dob: '1988-01-01',
    phone: '',
    email: '',
    address: '',
    joiningDate: new Date().toISOString().split('T')[0],
    designation: '',
    department: 'Teaching',
    qualification: '',
    employmentStatus: 'active',
    basicSalary: 45000,
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        staffId: staff.staffId || '',
        name: staff.name || '',
        photo: staff.photo || '',
        gender: staff.gender || 'Female',
        dob: staff.dob ? new Date(staff.dob).toISOString().split('T')[0] : '1988-01-01',
        phone: staff.phone || '',
        email: staff.email || '',
        address: staff.address || '',
        joiningDate: staff.joiningDate ? new Date(staff.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        designation: staff.designation || '',
        department: staff.department || 'Teaching',
        qualification: staff.qualification || '',
        employmentStatus: staff.employmentStatus || 'active',
        basicSalary: staff.basicSalary || 0,
        notes: staff.notes || '',
      });
    } else {
      setFormData({
        staffId: `STF-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        photo: '',
        gender: 'Female',
        dob: '1988-01-01',
        phone: '',
        email: '',
        address: '',
        joiningDate: new Date().toISOString().split('T')[0],
        designation: '',
        department: 'Teaching',
        qualification: '',
        employmentStatus: 'active',
        basicSalary: 45000,
        notes: '',
      });
    }
  }, [staff, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Staff name is required', 'error');
      return;
    }
    if (!formData.designation.trim()) {
      addToast('Designation is required (e.g. Mathematics Teacher)', 'error');
      return;
    }
    if (!formData.email.trim() || !formData.phone.trim()) {
      addToast('Email and phone number are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (staff) {
        await api.updateStaff(staff._id, formData);
        addToast('Staff member updated successfully', 'success');
      } else {
        await api.createStaff(formData);
        addToast('New staff member added successfully', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to save staff member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={staff ? `Edit Staff: ${staff.name}` : 'Add New Staff Member'}
      subtitle="Enter faculty / school employee profile and salary details."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-xs">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Anand Kulkarni"
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Staff ID Code *</label>
            <input
              type="text"
              value={formData.staffId}
              onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
              placeholder="e.g. STF-009"
              required
              className="form-input"
            />
          </div>
        </div>

        {/* Designation & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="form-label text-xs">Designation *</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="e.g. Senior Math Teacher"
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="form-select"
            >
              <option value="Teaching">Teaching / Academic</option>
              <option value="Administration">Administration</option>
              <option value="Finance">Finance & Accounts</option>
              <option value="Support">Support / Facilities</option>
            </select>
          </div>

          <div>
            <label className="form-label text-xs">Monthly Basic Salary (₹) *</label>
            <input
              type="number"
              value={formData.basicSalary}
              onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
              required
              min={0}
              className="form-input font-mono"
            />
          </div>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-xs">Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +91 98450 11223"
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="anand@greenwoodschool.edu"
              required
              className="form-input"
            />
          </div>
        </div>

        {/* Qualification & Joining */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="form-label text-xs">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="form-select"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="form-label text-xs">Joining Date</label>
            <input
              type="date"
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Employment Status</label>
            <select
              value={formData.employmentStatus}
              onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
              className="form-select"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-xs">Qualification / Degrees</label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="e.g. M.Sc, B.Ed, Ph.D"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Photo URL (Optional)</label>
            <input
              type="url"
              value={formData.photo}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              placeholder="https://..."
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="form-label text-xs">Residential Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Address with area and city"
            className="form-input"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline btn-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary btn-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{staff ? 'Update Staff Member' : 'Save Staff Member'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
