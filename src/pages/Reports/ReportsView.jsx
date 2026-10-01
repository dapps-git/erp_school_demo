import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import {
  FileText,
  GraduationCap,
  CalendarCheck,
  Users,
  Wallet,
  Coins,
  Download,
  Printer,
  Sparkles,
} from 'lucide-react';

export const ReportsView = () => {
  const { formatCurrency, addToast, settings } = useSchool();

  const [activeReport, setActiveReport] = useState('students');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [academicYear, setAcademicYear] = useState('2026-2027');

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getReport(activeReport, { academicYear });
      if (res.success && res.data) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error('Failed to load report:', err);
      addToast('Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeReport, academicYear, addToast]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData) return addToast('No data to export', 'warning');

    let csvContent = '';
    const dateStr = new Date().toISOString().split('T')[0];

    if (activeReport === 'students') {
      const list = reportData.studentsList || [];
      const headers = ['Admission No', 'Student Name', 'Class', 'Division', 'Roll No', 'Gender', 'Phone', 'Status'];
      const rows = list.map((s) => [
        s.admissionNo,
        `"${s.name}"`,
        s.classId?.name || '',
        s.divisionId?.name || '',
        s.rollNo,
        s.gender,
        s.parentPhone,
        s.status,
      ]);
      csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (activeReport === 'staff') {
      const list = reportData.staffList || [];
      const headers = ['Staff ID', 'Name', 'Designation', 'Department', 'Phone', 'Basic Salary', 'Status'];
      const rows = list.map((s) => [
        s.staffId,
        `"${s.name}"`,
        `"${s.designation}"`,
        s.department,
        s.phone,
        s.basicSalary,
        s.employmentStatus,
      ]);
      csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (activeReport === 'salary') {
      const list = reportData.salaries || [];
      const headers = ['Month', 'Staff Name', 'Staff ID', 'Basic', 'Bonus', 'Deduction', 'Net Salary', 'Payment Date'];
      const rows = list.map((s) => [
        s.salaryMonth,
        `"${s.staffId?.name || ''}"`,
        s.staffId?.staffId || '',
        s.basicSalary,
        s.bonus,
        s.deduction,
        s.netSalary,
        new Date(s.paymentDate).toLocaleDateString(),
      ]);
      csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else {
      addToast('CSV export ready for students, staff and salary reports', 'info');
      return;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeReport}_report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Report downloaded as CSV', 'success');
  };

  const reportTabs = [
    { id: 'students', label: 'Students Report', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance Report', icon: CalendarCheck },
    { id: 'staff', label: 'Staff Report', icon: Users },
    { id: 'salary', label: 'Salary Report', icon: Wallet },
    { id: 'finance', label: 'Financial Statement', icon: Coins },
  ];

  return (
    <div className="space-y-5">
      {/* Tab Selectors & Action Bar */}
      <div className="school-card p-4 space-y-4 no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-600" />
              Institutional Administrative Reports
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive analytics, student registers, attendance rates and financial records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="btn-outline btn-sm text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Report Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {reportTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeReport === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content Container */}
      <div className="school-card p-6 bg-white space-y-6">
        {/* Printable Header */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{settings?.schoolName || 'Greenwood International School'}</h3>
            <p className="text-xs text-slate-400 font-light">Official Administrative Audit Report • AY {academicYear}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-500">
              Generated: {new Date().toLocaleDateString('en-GB')}
            </span>
            <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">
              {activeReport.toUpperCase()} REPORT
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Generating report data...</p>
          </div>
        ) : (
          <>
            {/* 1. Students Report */}
            {activeReport === 'students' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-100">
                    <span className="text-xs text-sky-700 font-semibold uppercase">Total Students</span>
                    <h4 className="text-2xl font-bold text-sky-900 mt-1">{reportData?.totalStudents || 0}</h4>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-xs text-emerald-700 font-semibold uppercase">Active Students</span>
                    <h4 className="text-2xl font-bold text-emerald-900 mt-1">{reportData?.activeStudents || 0}</h4>
                  </div>
                  <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100">
                    <span className="text-xs text-cyan-700 font-semibold uppercase">Standards Covered</span>
                    <h4 className="text-2xl font-bold text-cyan-900 mt-1">LKG to 10th</h4>
                  </div>
                </div>

                {/* Class Wise Breakdown Table */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Standard-wise Breakdown
                </h4>
                <div className="table-container">
                  <table className="school-table text-xs">
                    <thead>
                      <tr>
                        <th>Class Standard</th>
                        <th>Total Students</th>
                        <th>Male</th>
                        <th>Female</th>
                        <th>Active Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(reportData?.classSummary || []).map((c) => (
                        <tr key={c.classId}>
                          <td className="font-bold text-slate-800">Standard {c.className}</td>
                          <td className="font-mono">{c.total}</td>
                          <td className="text-sky-700">{c.male} Boys</td>
                          <td className="text-rose-700">{c.female} Girls</td>
                          <td>
                            <span className="badge badge-active">{c.active} Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. Attendance Report */}
            {activeReport === 'attendance' && (
              <div className="space-y-4">
                <div className="table-container">
                  <table className="school-table text-xs">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Class & Division</th>
                        <th>Total Students</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Leave/Late</th>
                        <th>Attendance Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(reportData) ? reportData : []).map((att, idx) => (
                        <tr key={idx}>
                          <td className="font-mono font-bold text-slate-700">{att.date}</td>
                          <td className="font-medium text-sky-700">Class {att.className} - Div {att.divisionName}</td>
                          <td className="font-mono">{att.total}</td>
                          <td><span className="badge badge-present">{att.present} Present</span></td>
                          <td><span className="badge badge-absent">{att.absent} Absent</span></td>
                          <td><span className="badge badge-warning">{att.leave + att.late}</span></td>
                          <td className="font-mono font-bold text-slate-800">{att.rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Staff Report */}
            {activeReport === 'staff' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <span className="text-xs text-indigo-700 font-semibold uppercase">Total Faculty & Staff</span>
                    <h4 className="text-2xl font-bold text-indigo-900 mt-1">{reportData?.totalStaff || 0}</h4>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-xs text-emerald-700 font-semibold uppercase">Active on Payroll</span>
                    <h4 className="text-2xl font-bold text-emerald-900 mt-1">{reportData?.activeStaff || 0}</h4>
                  </div>
                </div>

                <div className="table-container">
                  <table className="school-table text-xs">
                    <thead>
                      <tr>
                        <th>Staff ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Phone</th>
                        <th>Monthly Basic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(reportData?.staffList || []).map((s) => (
                        <tr key={s._id}>
                          <td className="font-mono font-bold text-sky-700">{s.staffId}</td>
                          <td className="font-semibold text-slate-800">{s.name}</td>
                          <td>{s.department}</td>
                          <td>{s.designation}</td>
                          <td className="font-mono">{s.phone}</td>
                          <td className="font-mono font-bold text-slate-800">{formatCurrency(s.basicSalary)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Salary Report */}
            {activeReport === 'salary' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-100">
                    <span className="text-xs text-sky-700 font-semibold uppercase">Total Disbursed</span>
                    <h4 className="text-2xl font-bold text-sky-900 font-mono mt-1">
                      {formatCurrency(reportData?.totalPaid || 0)}
                    </h4>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-xs text-emerald-700 font-semibold uppercase">Total Payouts Logged</span>
                    <h4 className="text-2xl font-bold text-emerald-900 mt-1">{reportData?.totalRecords || 0} Slips</h4>
                  </div>
                </div>

                <div className="table-container">
                  <table className="school-table text-xs">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Staff Member</th>
                        <th>Basic</th>
                        <th>Bonus</th>
                        <th>Deduction</th>
                        <th>Net Salary</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(reportData?.salaries || []).map((sal) => (
                        <tr key={sal._id}>
                          <td className="font-mono font-bold text-slate-800">{sal.salaryMonth}</td>
                          <td>{sal.staffId?.name || 'Staff'} ({sal.staffId?.designation})</td>
                          <td className="font-mono">{formatCurrency(sal.basicSalary)}</td>
                          <td className="font-mono text-emerald-600">+{formatCurrency(sal.bonus)}</td>
                          <td className="font-mono text-rose-600">-{formatCurrency(sal.deduction)}</td>
                          <td className="font-mono font-bold text-sky-700">{formatCurrency(sal.netSalary)}</td>
                          <td><span className="badge badge-paid">{sal.paymentStatus}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. Financial Statement Report */}
            {activeReport === 'finance' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-xs text-emerald-700 font-semibold uppercase">Total Income (+)</span>
                    <h4 className="text-2xl font-bold text-emerald-900 font-mono mt-1">
                      {formatCurrency(reportData?.totalIncome || 0)}
                    </h4>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                    <span className="text-xs text-rose-700 font-semibold uppercase">Total Expenses (-)</span>
                    <h4 className="text-2xl font-bold text-rose-900 font-mono mt-1">
                      {formatCurrency(reportData?.totalExpense || 0)}
                    </h4>
                  </div>
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-100">
                    <span className="text-xs text-sky-700 font-semibold uppercase">Net Institutional Surplus (=)</span>
                    <h4 className="text-2xl font-bold text-sky-900 font-mono mt-1">
                      {formatCurrency(reportData?.netProfit || 0)}
                    </h4>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                  This financial statement summarizes verified tuition collections, admissions, payroll disbursements, utility overheads, and facility maintenance for Academic Year {academicYear}.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
