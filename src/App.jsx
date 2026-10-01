import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useSchool } from './context/SchoolContext';
import { Login } from './pages/Login';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { Modal } from './components/Modal';

// Modules
import { Dashboard } from './pages/Dashboard';
import { StudentList } from './pages/Students/StudentList';
import { AttendanceMark } from './pages/Attendance/AttendanceMark';
import { AttendanceHistory } from './pages/Attendance/AttendanceHistory';
import { StaffList } from './pages/Staff/StaffList';
import { SalaryManagement } from './pages/Salary/SalaryManagement';
import { IncomeList } from './pages/Finance/IncomeList';
import { ExpenseList } from './pages/Finance/ExpenseList';
import { FinancialSummary } from './pages/Finance/FinancialSummary';
import { ClassDivisionManager } from './pages/Classes/ClassDivisionManager';
import { ReportsView } from './pages/Reports/ReportsView';
import { SettingsPage } from './pages/Settings/SettingsPage';

import {
  UserPlus,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  Wallet,
  Layers,
  Sparkles,
} from 'lucide-react';

export function App() {
  const { isAuthenticated, loading } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendanceSubView, setAttendanceSubView] = useState('mark'); // 'mark' | 'history'

  // Filter cross-references
  const [selectedClassForStudentList, setSelectedClassForStudentList] = useState('');
  const [selectedDivForStudentList, setSelectedDivForStudentList] = useState('');
  const [selectedStaffForSalary, setSelectedStaffForSalary] = useState(null);

  // Quick Action Modal
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-light tracking-wide">Starting School CRM...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Login />
        <ToastContainer />
      </>
    );
  }

  const handleQuickNavigate = (tab) => {
    setActiveTab(tab);
    setQuickActionOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'attendance') setAttendanceSubView('mark');
        }}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeTab={activeTab}
          onQuickAction={() => setQuickActionOpen(true)}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard onNavigate={setActiveTab} />
          )}

          {activeTab === 'students' && (
            <StudentList
              initialClassId={selectedClassForStudentList}
              initialDivisionId={selectedDivForStudentList}
            />
          )}

          {activeTab === 'attendance' && (
            <>
              {attendanceSubView === 'mark' ? (
                <AttendanceMark onOpenHistory={() => setAttendanceSubView('history')} />
              ) : (
                <AttendanceHistory onBackToMark={() => setAttendanceSubView('mark')} />
              )}
            </>
          )}

          {activeTab === 'staff' && (
            <StaffList
              onPaySalary={(member) => {
                setSelectedStaffForSalary(member);
                setActiveTab('salary');
              }}
            />
          )}

          {activeTab === 'salary' && (
            <SalaryManagement preselectedStaff={selectedStaffForSalary} />
          )}

          {activeTab === 'income' && <IncomeList />}

          {activeTab === 'expenses' && <ExpenseList />}

          {activeTab === 'finance-summary' && (
            <FinancialSummary onNavigate={setActiveTab} />
          )}

          {activeTab === 'classes' && (
            <ClassDivisionManager
              onSelectClassDivision={(classId, divId) => {
                setSelectedClassForStudentList(classId);
                setSelectedDivForStudentList(divId);
                setActiveTab('students');
              }}
            />
          )}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Quick Action Modal */}
      <Modal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        title="Quick School Actions"
        subtitle="Jump directly into high-frequency administrative tasks."
        maxWidth="max-w-md"
      >
        <div className="grid grid-cols-1 gap-2.5">
          <button
            onClick={() => handleQuickNavigate('students')}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 transition-all flex items-center gap-3 text-left"
          >
            <div className="p-2.5 rounded-lg bg-sky-100 text-sky-700">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">New Student Admission</h4>
              <p className="text-[11px] text-slate-400">Enroll a new student to any standard</p>
            </div>
          </button>

          <button
            onClick={() => handleQuickNavigate('attendance')}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 transition-all flex items-center gap-3 text-left"
          >
            <div className="p-2.5 rounded-lg bg-cyan-100 text-cyan-700">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Take Daily Attendance</h4>
              <p className="text-[11px] text-slate-400">Mark present / absent for standard & section</p>
            </div>
          </button>

          <button
            onClick={() => handleQuickNavigate('income')}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center gap-3 text-left"
          >
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Record Fee Collection</h4>
              <p className="text-[11px] text-slate-400">Log tuition, transport or registration receipt</p>
            </div>
          </button>

          <button
            onClick={() => handleQuickNavigate('expenses')}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center gap-3 text-left"
          >
            <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Record School Expense</h4>
              <p className="text-[11px] text-slate-400">Add operational bills, stationery or maintenance</p>
            </div>
          </button>

          <button
            onClick={() => handleQuickNavigate('salary')}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 transition-all flex items-center gap-3 text-left"
          >
            <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Disburse Staff Salary</h4>
              <p className="text-[11px] text-slate-400">Auto-calculate and print payroll payslip</p>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  );
}
export default App;
