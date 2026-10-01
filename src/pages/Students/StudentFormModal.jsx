import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../../components/Modal';
import { User, BookOpen, Users, MapPin, Sparkles } from 'lucide-react';

export const StudentFormModal = ({ isOpen, onClose, student, onSaved }) => {
  const { classes, addToast, settings } = useSchool();

  const [formData, setFormData] = useState({
    admissionNo: '',
    name: '',
    photo: '',
    gender: 'Male',
    dob: '2015-01-01',
    bloodGroup: 'A+',
    admissionDate: new Date().toISOString().split('T')[0],
    academicYear: settings?.academicYear || '2026-2027',
    classId: '',
    divisionId: '',
    rollNo: '01',
    previousSchool: '',
    course: 'General',
    fatherName: '',
    motherName: '',
    guardianName: '',
    parentPhone: '',
    altPhone: '',
    email: '',
    address: '',
    status: 'active',
    notes: '',
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [submitting, setSubmitting] = useState(false);

  // When editing, populate form
  useEffect(() => {
    if (student) {
      setFormData({
        admissionNo: student.admissionNo || '',
        name: student.name || '',
        photo: student.photo || '',
        gender: student.gender || 'Male',
        dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '2015-01-01',
        bloodGroup: student.bloodGroup || 'A+',
        admissionDate: student.admissionDate ? new Date(student.admissionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        academicYear: student.academicYear || settings?.academicYear || '2026-2027',
        classId: student.classId?._id || student.classId || '',
        divisionId: student.divisionId?._id || student.divisionId || '',
        rollNo: student.rollNo || '01',
        previousSchool: student.previousSchool || '',
        course: student.course || 'General',
        fatherName: student.fatherName || '',
        motherName: student.motherName || '',
        guardianName: student.guardianName || '',
        parentPhone: student.parentPhone || '',
        altPhone: student.altPhone || '',
        email: student.email || '',
        address: student.address || '',
        status: student.status || 'active',
        notes: student.notes || '',
      });
    } else {
      // Default class
      const firstClass = classes[0];
      setFormData((prev) => ({
        ...prev,
        admissionNo: `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        photo: '',
        gender: 'Male',
        dob: '2015-01-01',
        bloodGroup: 'A+',
        admissionDate: new Date().toISOString().split('T')[0],
        academicYear: settings?.academicYear || '2026-2027',
        classId: firstClass?._id || '',
        divisionId: firstClass?.divisions?.[0]?._id || '',
        rollNo: '01',
        previousSchool: '',
        course: 'General',
        fatherName: '',
        motherName: '',
        guardianName: '',
        parentPhone: '',
        altPhone: '',
        email: '',
        address: '',
        status: 'active',
        notes: '',
      }));
    }
    setActiveTab('basic');
  }, [student, classes, settings, isOpen]);

  // Selected class's divisions
  const selectedClassObj = classes.find((c) => c._id === formData.classId);
  const availableDivisions = selectedClassObj?.divisions || [];

  const handleClassChange = (newClassId) => {
    const cls = classes.find((c) => c._id === newClassId);
    setFormData({
      ...formData,
      classId: newClassId,
      divisionId: cls?.divisions?.[0]?._id || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Student name is required', 'error');
      return;
    }
    if (!formData.parentPhone.trim()) {
      addToast('Parent phone number is required', 'error');
      return;
    }
    if (!formData.classId || !formData.divisionId) {
      addToast('Please select a Class and Division', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (student) {
        await api.updateStudent(student._id, formData);
        addToast('Student record updated successfully', 'success');
      } else {
        await api.createStudent(formData);
        addToast('New student enrolled successfully', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to save student', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? `Edit Student: ${student.name}` : 'New Student Admission'}
      subtitle="Complete student academic, personal and parent details."
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Navigation Tabs for Form Sections */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'basic' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Basic Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'academic' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>2. Academic Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('parent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'parent' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>3. Parent / Contact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('address')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'address' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>4. Address & Notes</span>
          </button>
        </div>

        {/* Tab 1: Basic Details */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Student Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label text-xs">Admission Number / Student ID *</label>
                <input
                  type="text"
                  value={formData.admissionNo}
                  onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                  placeholder="e.g. ADM-2026-0123"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="form-select"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label text-xs">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="form-select"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Admission Date</label>
                <input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
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
          </div>
        )}

        {/* Tab 2: Academic Details */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Academic Year</label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="form-select"
                >
                  <option value="2026-2027">2026-2027</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Standard / Class *</label>
                <select
                  value={formData.classId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      Class {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Division / Section *</label>
                <select
                  value={formData.divisionId}
                  onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
                  required
                  className="form-select"
                >
                  <option value="">Select Division</option>
                  {availableDivisions.map((div) => (
                    <option key={div._id} value={div._id}>
                      Division {div.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Roll Number *</label>
                <input
                  type="text"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="e.g. 01"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label text-xs">Previous School (if transferred)</label>
                <input
                  type="text"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  placeholder="e.g. St. Xavier Primary School"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label text-xs">Program / Curriculum</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="e.g. General, CBSE Standard"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Parent & Contact Details */}
        {activeTab === 'parent' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Father's Name</label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="e.g. Rajesh Sharma"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label text-xs">Mother's Name</label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  placeholder="e.g. Meera Sharma"
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label text-xs">Parent Phone Number *</label>
                <input
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label text-xs">Alternative Phone</label>
                <input
                  type="tel"
                  value={formData.altPhone}
                  onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                  placeholder="e.g. +91 98765 43211"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label text-xs">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="parent@example.com"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label text-xs">Guardian Name (Optional)</label>
              <input
                type="text"
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                placeholder="Leave blank if parents are primary"
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Address, Status & Notes */}
        {activeTab === 'address' && (
          <div className="space-y-4">
            <div>
              <label className="form-label text-xs">Residential Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete residential address with landmark and city"
                rows={2}
                className="form-textarea"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">Enrolment Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-select"
                >
                  <option value="active">Active (Enrolled)</option>
                  <option value="inactive">Inactive</option>
                  <option value="left">Left School / TC Issued</option>
                </select>
              </div>

              <div>
                <label className="form-label text-xs">Administrative Notes / Medical Remarks</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Allergy remarks, special talent, scholarships"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Step:</span>
            <span className="font-semibold text-slate-700 capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-2">
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
              <span>{student ? 'Update Student' : 'Enroll Student'}</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
