import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  School,
  Lock,
  User,
  Save,
  CheckCircle2,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export const SettingsPage = () => {
  const { settings, setSettings, fetchSettings, addToast } = useSchool();
  const { user, updateProfile } = useAuth();

  const [schoolForm, setSchoolForm] = useState({
    schoolName: '',
    tagline: '',
    affiliationNumber: '',
    address: '',
    phone: '',
    altPhone: '',
    email: '',
    website: '',
    academicYear: '2026-2027',
    currencySymbol: '₹',
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingSchool, setSavingSchool] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (settings) {
      setSchoolForm({
        schoolName: settings.schoolName || '',
        tagline: settings.tagline || '',
        affiliationNumber: settings.affiliationNumber || '',
        address: settings.address || '',
        phone: settings.phone || '',
        altPhone: settings.altPhone || '',
        email: settings.email || '',
        website: settings.website || '',
        academicYear: settings.academicYear || '2026-2027',
        currencySymbol: settings.currencySymbol || '₹',
      });
    }
  }, [settings]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSaveSchoolSettings = async (e) => {
    e.preventDefault();
    setSavingSchool(true);
    try {
      const res = await api.updateSettings(schoolForm);
      if (res.success && res.data) {
        setSettings(res.data);
        addToast('School profile & institutional settings saved successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSavingSchool(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profileForm);
      addToast('Admin profile information updated', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast('New password and confirm password do not match', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      addToast('Password changed successfully!', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast(err.message || 'Failed to update password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* 1. School Information Settings Card */}
      <div className="school-card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Institutional & School Profile</h3>
            <p className="text-xs text-slate-400">School name, board affiliation, contact details and academic session.</p>
          </div>
        </div>

        <form onSubmit={handleSaveSchoolSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-xs">School / Institute Name *</label>
              <input
                type="text"
                value={schoolForm.schoolName}
                onChange={(e) => setSchoolForm({ ...schoolForm, schoolName: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label text-xs">School Tagline / Motto</label>
              <input
                type="text"
                value={schoolForm.tagline}
                onChange={(e) => setSchoolForm({ ...schoolForm, tagline: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="form-label text-xs">Affiliation / Board Code</label>
              <input
                type="text"
                value={schoolForm.affiliationNumber}
                onChange={(e) => setSchoolForm({ ...schoolForm, affiliationNumber: e.target.value })}
                placeholder="e.g. CBSE/AFF/2026/8941"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label text-xs">Active Academic Session</label>
              <select
                value={schoolForm.academicYear}
                onChange={(e) => setSchoolForm({ ...schoolForm, academicYear: e.target.value })}
                className="form-select"
              >
                <option value="2026-2027">2026-2027</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2027-2028">2027-2028</option>
              </select>
            </div>

            <div>
              <label className="form-label text-xs">Currency Symbol</label>
              <input
                type="text"
                value={schoolForm.currencySymbol}
                onChange={(e) => setSchoolForm({ ...schoolForm, currencySymbol: e.target.value })}
                className="form-input font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="form-label text-xs">Official Contact Phone</label>
              <input
                type="tel"
                value={schoolForm.phone}
                onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label text-xs">Official Email Address</label>
              <input
                type="email"
                value={schoolForm.email}
                onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label text-xs">Website URL</label>
              <input
                type="text"
                value={schoolForm.website}
                onChange={(e) => setSchoolForm({ ...schoolForm, website: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Campus Postal Address</label>
            <textarea
              value={schoolForm.address}
              onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
              rows={2}
              className="form-textarea"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSchool}
              className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{savingSchool ? 'Saving...' : 'Save School Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Admin Profile & Security Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Profile */}
        <div className="school-card p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Admin Account Info</h3>
              <p className="text-[11px] text-slate-400">Update your administrator profile.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div>
              <label className="form-label text-xs">Admin Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label text-xs">Login Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label text-xs">Phone</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="btn-primary btn-sm text-xs"
              >
                <span>{savingProfile ? 'Updating...' : 'Update Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="school-card p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Change Password</h3>
              <p className="text-[11px] text-slate-400">Secure your management account.</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div>
              <label className="form-label text-xs">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label text-xs">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label text-xs">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="btn-secondary btn-sm text-xs"
              >
                <span>{savingPassword ? 'Changing...' : 'Change Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
