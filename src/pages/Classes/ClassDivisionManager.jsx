import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Layers,
  Plus,
  Users,
  Edit2,
  Trash2,
  DoorOpen,
  CalendarCheck,
  UserPlus,
  Sparkles,
} from 'lucide-react';

export const ClassDivisionManager = ({ onSelectClassDivision }) => {
  const { classes, fetchClasses, loadingClasses, addToast } = useSchool();

  const [selectedClass, setSelectedClass] = useState(null);
  const [divisionModalOpen, setDivisionModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState(null);
  const [divisionForm, setDivisionForm] = useState({ name: '', roomNumber: '', capacity: 40 });
  const [classForm, setClassForm] = useState({ name: '', order: 1, description: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, divisionId: null, divisionName: '' });

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleOpenAddDivision = (cls) => {
    setSelectedClass(cls);
    setEditingDivision(null);
    setDivisionForm({ name: '', roomNumber: '', capacity: 40 });
    setDivisionModalOpen(true);
  };

  const handleOpenEditDivision = (cls, div) => {
    setSelectedClass(cls);
    setEditingDivision(div);
    setDivisionForm({
      name: div.name,
      roomNumber: div.roomNumber || '',
      capacity: div.capacity || 40,
    });
    setDivisionModalOpen(true);
  };

  const handleSaveDivision = async (e) => {
    e.preventDefault();
    try {
      if (editingDivision) {
        await api.updateDivision(editingDivision._id, divisionForm);
        addToast(`Division ${divisionForm.name} updated successfully`, 'success');
      } else {
        await api.addDivision(selectedClass._id, divisionForm);
        addToast(`Division ${divisionForm.name} added to Class ${selectedClass.name}`, 'success');
      }
      setDivisionModalOpen(false);
      fetchClasses();
    } catch (err) {
      addToast(err.message || 'Failed to save division', 'error');
    }
  };

  const handleSaveClass = async (e) => {
    e.preventDefault();
    try {
      await api.addClass(classForm);
      addToast(`Class ${classForm.name} created with Division A`, 'success');
      setClassModalOpen(false);
      setClassForm({ name: '', order: classes.length + 1, description: '' });
      fetchClasses();
    } catch (err) {
      addToast(err.message || 'Failed to create class', 'error');
    }
  };

  const handleDeleteDivision = async () => {
    try {
      await api.deleteDivision(deleteConfirm.divisionId);
      addToast(`Division deleted successfully`, 'success');
      fetchClasses();
    } catch (err) {
      addToast(err.message || 'Cannot delete division with active students', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-600" />
            Classes & Divisions Structure
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage academic batches from LKG, UKG to 10th standard with room allocations and capacity.
          </p>
        </div>

        <button
          onClick={() => {
            setClassForm({ name: '', order: classes.length + 1, description: '' });
            setClassModalOpen(true);
          }}
          className="btn-primary btn-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Classes Grid */}
      {loadingClasses ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading classes and divisions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((cls) => (
            <div key={cls._id} className="school-card p-5 flex flex-col justify-between border-t-4 border-t-sky-500">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                      {cls.name}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Standard {cls.name}</h3>
                      <p className="text-[10px] text-slate-400">Total Enrolled: {cls.totalStudents || 0} Students</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenAddDivision(cls)}
                    className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                    title="Add Division"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Div</span>
                  </button>
                </div>

                {/* Divisions List */}
                <div className="mt-4 space-y-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Active Divisions ({cls.divisions?.length || 0})
                  </p>

                  {(cls.divisions || []).map((div) => (
                    <div
                      key={div._id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-sky-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-sky-600 font-bold text-xs flex items-center justify-center shadow-2xs">
                          {div.name}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-700">Division {div.name}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-2">
                            <span>👥 {div.studentCount || 0}/{div.capacity || 40} Students</span>
                            {div.roomNumber && <span>• 🚪 {div.roomNumber}</span>}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditDivision(cls, div)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-white rounded-lg transition-colors"
                          title="Edit Division"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              divisionId: div._id,
                              divisionName: `${cls.name} - ${div.name}`,
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                          title="Delete Division"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Quick Link */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">{cls.divisions?.length || 0} Sections</span>
                {onSelectClassDivision && cls.divisions?.length > 0 && (
                  <button
                    onClick={() => onSelectClassDivision(cls._id, cls.divisions[0]._id)}
                    className="text-sky-600 hover:text-sky-700 font-semibold text-[11px] flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" /> View Class Students
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Division Modal */}
      <Modal
        isOpen={divisionModalOpen}
        onClose={() => setDivisionModalOpen(false)}
        title={editingDivision ? `Edit Division ${editingDivision.name}` : `Add Division to Class ${selectedClass?.name}`}
        subtitle="Manage room allocation and student seating capacity."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveDivision} className="space-y-4">
          <div>
            <label className="form-label text-xs">Division Name (e.g. A, B, C, D)</label>
            <input
              type="text"
              value={divisionForm.name}
              onChange={(e) => setDivisionForm({ ...divisionForm, name: e.target.value.toUpperCase() })}
              required
              placeholder="e.g. A"
              maxLength={2}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Room / Classroom Number</label>
            <input
              type="text"
              value={divisionForm.roomNumber}
              onChange={(e) => setDivisionForm({ ...divisionForm, roomNumber: e.target.value })}
              placeholder="e.g. Room-204"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Maximum Seating Capacity</label>
            <input
              type="number"
              value={divisionForm.capacity}
              onChange={(e) => setDivisionForm({ ...divisionForm, capacity: Number(e.target.value) })}
              min={1}
              max={100}
              className="form-input"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDivisionModalOpen(false)}
              className="btn-outline btn-sm"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary btn-sm">
              {editingDivision ? 'Update Division' : 'Create Division'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add New Class Modal */}
      <Modal
        isOpen={classModalOpen}
        onClose={() => setClassModalOpen(false)}
        title="Add New Standard / Class"
        subtitle="Create a new class standard for the school curriculum."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveClass} className="space-y-4">
          <div>
            <label className="form-label text-xs">Class Standard Name</label>
            <input
              type="text"
              value={classForm.name}
              onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
              required
              placeholder="e.g. 11th Science, Playgroup, LKG"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Display Order Number</label>
            <input
              type="number"
              value={classForm.order}
              onChange={(e) => setClassForm({ ...classForm, order: Number(e.target.value) })}
              min={1}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label text-xs">Description / Notes (Optional)</label>
            <textarea
              value={classForm.description}
              onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
              placeholder="e.g. Primary Section Curriculum batch"
              rows={2}
              className="form-textarea"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setClassModalOpen(false)}
              className="btn-outline btn-sm"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary btn-sm">
              Save Class
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Division Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, divisionId: null, divisionName: '' })}
        onConfirm={handleDeleteDivision}
        title="Delete Division"
        message={`Are you sure you want to delete Division ${deleteConfirm.divisionName}? This action cannot be undone.`}
        confirmText="Delete Division"
      />
    </div>
  );
};
