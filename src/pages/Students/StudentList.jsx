import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { StudentFormModal } from './StudentFormModal';
import { StudentProfileModal } from './StudentProfileModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Pagination } from '../../components/Pagination';
import { EmptyState } from '../../components/EmptyState';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  Download,
  GraduationCap,
  Phone,
  Layers,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';

export const StudentList = ({ initialClassId, initialDivisionId }) => {
  const { classes, addToast, settings } = useSchool();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState(initialClassId || '');
  const [selectedDivision, setSelectedDivision] = useState(initialDivisionId || '');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedStudentIdForProfile, setSelectedStudentIdForProfile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, studentId: null, studentName: '' });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 20,
        academicYear,
      };
      if (search) params.search = search;
      if (selectedClass) params.classId = selectedClass;
      if (selectedDivision) params.divisionId = selectedDivision;
      if (selectedStatus) params.status = selectedStatus;

      const res = await api.getStudents(params);
      if (res.success && res.data) {
        setStudents(res.data);
        setTotalPages(res.pagination?.pages || 1);
        setTotalStudents(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      addToast('Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, selectedClass, selectedDivision, selectedStatus, academicYear, addToast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle class selection & reset division if mismatched
  const handleClassFilterChange = (clsId) => {
    setSelectedClass(clsId);
    setSelectedDivision('');
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedClass('');
    setSelectedDivision('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  const handleDeleteStudent = async () => {
    try {
      await api.deleteStudent(deleteConfirm.studentId);
      addToast(`Student ${deleteConfirm.studentName} deleted successfully`, 'success');
      fetchStudents();
    } catch (err) {
      addToast(err.message || 'Failed to delete student', 'error');
    }
  };

  const exportCSV = () => {
    if (students.length === 0) {
      addToast('No student records to export', 'warning');
      return;
    }
    const headers = ['Admission No', 'Name', 'Class', 'Division', 'Roll No', 'Gender', 'Phone', 'Father Name', 'Status'];
    const rows = students.map((s) => [
      s.admissionNo,
      `"${s.name}"`,
      s.classId?.name || '',
      s.divisionId?.name || '',
      s.rollNo,
      s.gender,
      s.parentPhone,
      `"${s.fatherName || ''}"`,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Student records exported to CSV', 'success');
  };

  const activeClassDivisions = classes.find((c) => c._id === selectedClass)?.divisions || [];

  return (
    <div className="space-y-5">
      {/* Top Filter & Action Bar */}
      <div className="school-card p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 input-icon-left" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Student Name, ID, Roll No or Parent Phone..."
              className="form-input input-with-icon-left text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="btn-outline btn-sm text-xs flex items-center gap-1.5"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={() => {
                setSelectedStudentForEdit(null);
                setFormModalOpen(true);
              }}
              className="btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => handleClassFilterChange(e.target.value)}
            className="form-select py-1.5 text-xs"
          >
            <option value="">All Classes (LKG - 10th)</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                Class {cls.name}
              </option>
            ))}
          </select>

          {/* Division Filter */}
          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setCurrentPage(1);
            }}
            disabled={!selectedClass}
            className="form-select py-1.5 text-xs disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">All Divisions</option>
            {activeClassDivisions.map((div) => (
              <option key={div._id} value={div._id}>
                Division {div.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="form-select py-1.5 text-xs"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="left">Left School</option>
          </select>

          {/* Academic Year */}
          <select
            value={academicYear}
            onChange={(e) => {
              setAcademicYear(e.target.value);
              setCurrentPage(1);
            }}
            className="form-select py-1.5 text-xs"
          >
            <option value="2026-2027">AY 2026-2027</option>
            <option value="2025-2026">AY 2025-2026</option>
          </select>

          {/* Reset button */}
          {(search || selectedClass || selectedDivision || selectedStatus) && (
            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-1 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading student directory...</p>
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No Students Found"
          description="No student records match the active search and filter criteria."
          actionLabel="Enroll First Student"
          onAction={() => {
            setSelectedStudentForEdit(null);
            setFormModalOpen(true);
          }}
        />
      ) : (
        <div className="table-container shadow-xs">
          <table className="school-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Details</th>
                <th>Standard & Div</th>
                <th>Roll No</th>
                <th>Parent Phone</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="font-mono text-xs font-semibold text-sky-700">
                    {student.admissionNo}
                  </td>

                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {student.photo ? (
                          <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          student.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-xs">{student.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {student.gender} • {student.fatherName ? `F: ${student.fatherName}` : 'Parent registered'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-medium text-xs border border-sky-100">
                      Class {student.classId?.name || '-'} ({student.divisionId?.name || '-'})
                    </span>
                  </td>

                  <td className="font-mono text-xs font-semibold text-slate-700">
                    {student.rollNo}
                  </td>

                  <td>
                    <div className="flex items-center gap-1 text-xs text-slate-600 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{student.parentPhone}</span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        student.status === 'active'
                          ? 'badge-active'
                          : student.status === 'inactive'
                          ? 'badge-warning'
                          : 'badge-absent'
                      }`}
                    >
                      {student.status === 'active' ? 'Active' : student.status === 'inactive' ? 'Inactive' : 'Left'}
                    </span>
                  </td>

                  <td className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedStudentIdForProfile(student._id);
                          setProfileModalOpen(true);
                        }}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="View Profile & ID Card"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedStudentForEdit(student);
                          setFormModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Student"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            studentId: student._id,
                            studentName: student.name,
                          })
                        }
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalStudents}
            itemsPerPage={20}
          />
        </div>
      )}

      {/* Add / Edit Student Modal */}
      <StudentFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        student={selectedStudentForEdit}
        onSaved={fetchStudents}
      />

      {/* Student Profile & ID Card Modal */}
      <StudentProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        studentId={selectedStudentIdForProfile}
      />

      {/* Delete Student Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, studentId: null, studentName: '' })}
        onConfirm={handleDeleteStudent}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete student ${deleteConfirm.studentName}? This will also delete their attendance logs.`}
        confirmText="Delete Student"
      />
    </div>
  );
};
