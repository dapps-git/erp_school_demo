import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../../components/Modal';
import { Printer, School, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PayslipModal = ({ isOpen, onClose, salary }) => {
  const { settings, formatCurrency } = useSchool();

  if (!isOpen || !salary) return null;

  const staff = salary.staffId;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Salary Payment Receipt / Payslip"
      subtitle={`Month: ${salary.salaryMonth} • Staff: ${staff?.name || 'Staff'}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Printable Payslip Card */}
        <div className="p-6 border-2 border-slate-200 rounded-2xl bg-white space-y-5" id="payslip-print-area">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">{settings?.schoolName || 'Greenwood International School'}</h3>
                <p className="text-[11px] text-slate-400 font-light">{settings?.address || 'Knowledge Park, Bangalore'}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="badge badge-paid">PAID SLIP</span>
              <p className="text-xs font-mono font-bold text-slate-700 mt-1">MONTH: {salary.salaryMonth}</p>
            </div>
          </div>

          {/* Employee & Payment Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div>
              <p className="text-slate-400 text-[10px]">EMPLOYEE NAME</p>
              <p className="font-bold text-slate-800 text-sm">{staff?.name}</p>
              <p className="text-slate-500 font-mono text-[11px]">ID: {staff?.staffId} • {staff?.designation}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px]">PAYMENT DATE & METHOD</p>
              <p className="font-bold text-slate-800">{new Date(salary.paymentDate).toLocaleDateString('en-GB')}</p>
              <p className="text-slate-500 text-[11px]">Via {salary.paymentMethod} {salary.transactionRef ? `(${salary.transactionRef})` : ''}</p>
            </div>
          </div>

          {/* Salary Breakdown Table */}
          <div className="table-container border">
            <table className="school-table text-xs">
              <thead>
                <tr className="bg-slate-100">
                  <th>Earnings & Additions</th>
                  <th className="text-right">Amount</th>
                  <th>Deductions</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Salary</td>
                  <td className="text-right font-mono">{formatCurrency(salary.basicSalary)}</td>
                  <td>Tax / Leave Deduction</td>
                  <td className="text-right font-mono text-rose-600">{formatCurrency(salary.deduction)}</td>
                </tr>
                <tr>
                  <td>Performance Bonus</td>
                  <td className="text-right font-mono">{formatCurrency(salary.bonus)}</td>
                  <td>-</td>
                  <td className="text-right font-mono">-</td>
                </tr>
                <tr>
                  <td>Special / Other Allowance</td>
                  <td className="text-right font-mono">{formatCurrency(salary.otherAmount)}</td>
                  <td>-</td>
                  <td className="text-right font-mono">-</td>
                </tr>
                <tr className="bg-sky-50/50 font-bold border-t-2 border-slate-200">
                  <td className="text-sky-900 font-bold">Total Gross Earnings</td>
                  <td className="text-right font-mono text-sky-900">
                    {formatCurrency(salary.basicSalary + salary.bonus + salary.otherAmount)}
                  </td>
                  <td className="text-rose-900 font-bold">Total Deductions</td>
                  <td className="text-right font-mono text-rose-900">
                    {formatCurrency(salary.deduction)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Salary Highlight Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white flex items-center justify-between">
            <div>
              <p className="text-xs text-sky-100 uppercase tracking-wider font-semibold">Net Disbursed Salary</p>
              <p className="text-[11px] text-sky-200">(Basic + Bonus + Other - Deduction)</p>
            </div>
            <h3 className="text-2xl font-bold font-mono">{formatCurrency(salary.netSalary)}</h3>
          </div>

          {salary.notes && (
            <p className="text-xs text-slate-500 italic">
              Note: {salary.notes}
            </p>
          )}

          {/* Footer signatures */}
          <div className="flex items-center justify-between pt-8 text-[11px] text-slate-400">
            <div>
              <div className="w-32 border-b border-slate-300 mb-1" />
              <p>Employee Signature</p>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-slate-300 mb-1 ml-auto" />
              <p>Authorized Accountant / Principal</p>
            </div>
          </div>
        </div>

        {/* Modal footer controls */}
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn-outline btn-sm">
            Close
          </button>
          <button onClick={handlePrint} className="btn-primary btn-sm flex items-center gap-1.5 shadow-sm">
            <Printer className="w-4 h-4" />
            <span>Print Payslip</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
