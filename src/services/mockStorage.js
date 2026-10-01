import {
  initialSettings,
  initialClasses,
  initialDivisions,
  initialStaff,
  initialStudents,
  initialSalaries,
  initialIncomes,
  initialExpenses,
  initialAttendances,
} from './mockData';

const STORAGE_KEYS = {
  SETTINGS: 'school_crm_settings',
  CLASSES: 'school_crm_classes',
  DIVISIONS: 'school_crm_divisions',
  STAFF: 'school_crm_staff',
  STUDENTS: 'school_crm_students',
  SALARIES: 'school_crm_salaries',
  INCOMES: 'school_crm_incomes',
  EXPENSES: 'school_crm_expenses',
  ATTENDANCES: 'school_crm_attendances',
  USER: 'school_crm_admin_user',
};

class MockStorage {
  constructor() {
    this.init();
  }

  get(key, defaultVal) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('Storage set error:', e);
    }
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.set(STORAGE_KEYS.SETTINGS, initialSettings);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
      this.set(STORAGE_KEYS.CLASSES, initialClasses);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DIVISIONS)) {
      this.set(STORAGE_KEYS.DIVISIONS, initialDivisions);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STAFF)) {
      this.set(STORAGE_KEYS.STAFF, initialStaff);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      this.set(STORAGE_KEYS.STUDENTS, initialStudents);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SALARIES)) {
      this.set(STORAGE_KEYS.SALARIES, initialSalaries);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INCOMES)) {
      this.set(STORAGE_KEYS.INCOMES, initialIncomes);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
      this.set(STORAGE_KEYS.EXPENSES, initialExpenses);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCES)) {
      this.set(STORAGE_KEYS.ATTENDANCES, initialAttendances);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      this.set(STORAGE_KEYS.USER, {
        _id: 'usr_admin',
        name: 'Admin',
        email: 'admin@school.com',
        role: 'admin',
        phone: '+91 98765 43210',
        password: 'admin123',
      });
    }
  }

  // Auth
  async login(email, password) {
    const user = this.get(STORAGE_KEYS.USER);
    if (
      user &&
      email.toLowerCase().trim() === user.email.toLowerCase().trim() &&
      password === user.password
    ) {
      const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: 'mock_jwt_token_for_demo_session',
      };
      return { success: true, data };
    }
    throw new Error('Invalid email or password. Use admin@school.com / admin123');
  }

  async getMe() {
    const user = this.get(STORAGE_KEYS.USER);
    return { success: true, data: user };
  }

  async updateProfile(data) {
    const user = this.get(STORAGE_KEYS.USER);
    const updated = { ...user, ...data };
    this.set(STORAGE_KEYS.USER, updated);
    return { success: true, data: updated };
  }

  async changePassword(currentPassword, newPassword) {
    const user = this.get(STORAGE_KEYS.USER);
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    user.password = newPassword;
    this.set(STORAGE_KEYS.USER, user);
    return { success: true, message: 'Password updated successfully' };
  }

  // Dashboard
  async getDashboard() {
    const students = this.get(STORAGE_KEYS.STUDENTS, []);
    const staff = this.get(STORAGE_KEYS.STAFF, []);
    const classes = this.get(STORAGE_KEYS.CLASSES, []);
    const attendances = this.get(STORAGE_KEYS.ATTENDANCES, []);
    const incomes = this.get(STORAGE_KEYS.INCOMES, []);
    const expenses = this.get(STORAGE_KEYS.EXPENSES, []);
    const salaries = this.get(STORAGE_KEYS.SALARIES, []);

    const activeStudents = students.filter((s) => s.status === 'active');
    const activeStaff = staff.filter((s) => s.employmentStatus === 'active');

    // Today attendance
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAtts = attendances.filter((a) => a.date === todayStr);

    let todayPresent = 0;
    let todayAbsent = 0;
    let todayLate = 0;
    let todayLeave = 0;

    todayAtts.forEach((att) => {
      (att.records || []).forEach((r) => {
        if (r.status === 'Present') todayPresent++;
        else if (r.status === 'Absent') todayAbsent++;
        else if (r.status === 'Late') todayLate++;
        else if (r.status === 'Leave') todayLeave++;
      });
    });

    const todayTotal = todayPresent + todayAbsent + todayLate + todayLeave;
    const todayAttendanceRate =
      todayTotal > 0 ? Math.round(((todayPresent + todayLate * 0.5) / todayTotal) * 100) : 95;

    // Finances
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const availableBalance = totalIncome - totalExpenses;

    const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const monthIncomes = incomes.filter((i) => (i.date || '').startsWith(currentMonthStr));
    const monthExpenses = expenses.filter((e) => (e.date || '').startsWith(currentMonthStr));
    const monthSalaries = salaries.filter((s) => s.salaryMonth === currentMonthStr && s.paymentStatus === 'Paid');

    const monthIncome = monthIncomes.reduce((s, i) => s + Number(i.amount || 0), totalIncome * 0.35);
    const monthExpense = monthExpenses.reduce((s, e) => s + Number(e.amount || 0), totalExpenses * 0.4);
    const monthSalary = monthSalaries.reduce((s, sal) => s + Number(sal.netSalary || 0), 283500);

    // Class wise student count
    const classWiseStudents = classes.map((c) => {
      const clsStudents = activeStudents.filter((s) => s.classId === c._id);
      return {
        classId: c._id,
        name: c.name,
        order: c.order,
        studentCount: clsStudents.length,
        maleCount: clsStudents.filter((s) => s.gender === 'Male').length,
        femaleCount: clsStudents.filter((s) => s.gender === 'Female').length,
      };
    });

    return {
      success: true,
      data: {
        cards: {
          totalStudents: activeStudents.length,
          totalStaff: activeStaff.length,
          totalClasses: classes.length,
          todayAttendanceRate,
          todayPresent: todayPresent || 20,
          todayAbsent: todayAbsent || 1,
          todayLate: todayLate || 1,
          todayLeave: todayLeave || 0,
          monthIncome: Math.round(monthIncome),
          monthExpense: Math.round(monthExpense),
          monthSalary: Math.round(monthSalary),
          availableBalance,
        },
        classWiseStudents,
        recentIncomes: incomes.slice(0, 5),
        recentExpenses: expenses.slice(0, 5),
        recentSalaries: salaries.slice(0, 5).map((sal) => {
          const stf = staff.find((s) => s._id === sal.staffId);
          return { ...sal, staffId: stf || { name: 'Faculty Member' } };
        }),
      },
    };
  }

  // Classes & Divisions
  async getClasses() {
    const classes = this.get(STORAGE_KEYS.CLASSES, []);
    const divisions = this.get(STORAGE_KEYS.DIVISIONS, []);
    const students = this.get(STORAGE_KEYS.STUDENTS, []);

    const data = classes.map((cls) => {
      const classDivisions = divisions
        .filter((d) => d.classId === cls._id)
        .map((div) => {
          const count = students.filter(
            (s) => s.classId === cls._id && s.divisionId === div._id && s.status === 'active'
          ).length;
          return { ...div, studentCount: count };
        });

      const totalStudents = classDivisions.reduce((sum, d) => sum + d.studentCount, 0);
      return { ...cls, divisions: classDivisions, totalStudents };
    });

    return { success: true, data };
  }

  async addClass(data) {
    const classes = this.get(STORAGE_KEYS.CLASSES, []);
    const newClass = {
      _id: `cls_${Date.now()}`,
      name: data.name,
      order: data.order || classes.length + 1,
      description: data.description || '',
    };
    classes.push(newClass);
    this.set(STORAGE_KEYS.CLASSES, classes);

    // Auto add Div A
    const divisions = this.get(STORAGE_KEYS.DIVISIONS, []);
    divisions.push({
      _id: `div_${Date.now()}_a`,
      classId: newClass._id,
      name: 'A',
      roomNumber: 'Room-101',
      capacity: 40,
    });
    this.set(STORAGE_KEYS.DIVISIONS, divisions);

    return { success: true, data: newClass };
  }

  async addDivision(classId, data) {
    const divisions = this.get(STORAGE_KEYS.DIVISIONS, []);
    const newDiv = {
      _id: `div_${Date.now()}`,
      classId,
      name: data.name.toUpperCase(),
      roomNumber: data.roomNumber || '',
      capacity: Number(data.capacity) || 40,
    };
    divisions.push(newDiv);
    this.set(STORAGE_KEYS.DIVISIONS, divisions);
    return { success: true, data: newDiv };
  }

  async updateDivision(id, data) {
    const divisions = this.get(STORAGE_KEYS.DIVISIONS, []);
    const idx = divisions.findIndex((d) => d._id === id);
    if (idx !== -1) {
      divisions[idx] = { ...divisions[idx], ...data };
      this.set(STORAGE_KEYS.DIVISIONS, divisions);
      return { success: true, data: divisions[idx] };
    }
    throw new Error('Division not found');
  }

  async deleteDivision(id) {
    const divisions = this.get(STORAGE_KEYS.DIVISIONS, []);
    const updated = divisions.filter((d) => d._id !== id);
    this.set(STORAGE_KEYS.DIVISIONS, updated);
    return { success: true };
  }

  // Students
  async getStudents(params = {}) {
    let students = this.get(STORAGE_KEYS.STUDENTS, []);
    const classes = this.get(STORAGE_KEYS.CLASSES, []);
    const divisions = this.get(STORAGE_KEYS.DIVISIONS, []);

    if (params.status) {
      students = students.filter((s) => s.status === params.status);
    }
    if (params.classId) {
      students = students.filter((s) => s.classId === params.classId);
    }
    if (params.divisionId) {
      students = students.filter((s) => s.divisionId === params.divisionId);
    }
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      students = students.filter(
        (s) =>
          (s.name || '').toLowerCase().includes(q) ||
          (s.admissionNo || '').toLowerCase().includes(q) ||
          (s.parentPhone || '').includes(q) ||
          (s.rollNo || '').includes(q)
      );
    }

    const populated = students.map((s) => {
      const cls = classes.find((c) => c._id === s.classId);
      const div = divisions.find((d) => d._id === s.divisionId);
      return { ...s, classId: cls || { name: '-' }, divisionId: div || { name: '-' } };
    });

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const start = (page - 1) * limit;
    const paginated = populated.slice(start, start + limit);

    return {
      success: true,
      data: paginated,
      pagination: {
        total: populated.length,
        page,
        limit,
        pages: Math.ceil(populated.length / limit) || 1,
      },
    };
  }

  async getStudent(id) {
    const students = this.get(STORAGE_KEYS.STUDENTS, []);
    const classes = this.get(STORAGE_KEYS.CLASSES, []);
    const divisions = this.get(STORAGE_KEYS.DIVISIONS, []);
    const attendances = this.get(STORAGE_KEYS.ATTENDANCES, []);
    const incomes = this.get(STORAGE_KEYS.INCOMES, []);

    const student = students.find((s) => s._id === id);
    if (!student) throw new Error('Student not found');

    const cls = classes.find((c) => c._id === student.classId);
    const div = divisions.find((d) => d._id === student.divisionId);

    // Attendance stats
    let present = 0, absent = 0, late = 0, leave = 0;
    const recentAttendance = [];

    attendances.forEach((att) => {
      const rec = (att.records || []).find((r) => r.studentId === student._id);
      if (rec) {
        if (rec.status === 'Present') present++;
        else if (rec.status === 'Absent') absent++;
        else if (rec.status === 'Late') late++;
        else if (rec.status === 'Leave') leave++;

        recentAttendance.push({
          date: att.date,
          status: rec.status,
          reason: rec.reason || '',
        });
      }
    });

    if (recentAttendance.length === 0) {
      present = 22; absent = 1; late = 1; leave = 0;
      recentAttendance.push(
        { date: '2026-10-01', status: 'Present', reason: '' },
        { date: '2026-09-30', status: 'Present', reason: '' },
        { date: '2026-09-29', status: 'Absent', reason: 'Viral Fever' },
        { date: '2026-09-28', status: 'Present', reason: '' },
        { date: '2026-09-27', status: 'Late', reason: 'Traffic' }
      );
    }

    const totalDays = present + absent + late + leave;
    const attendanceRate = totalDays > 0 ? Math.round(((present + late * 0.5) / totalDays) * 100) : 96;

    return {
      success: true,
      data: {
        student: { ...student, classId: cls || { name: '-' }, divisionId: div || { name: '-' } },
        attendanceStats: { totalDays, present, absent, late, leave, attendanceRate },
        recentAttendance: recentAttendance.slice(0, 10),
        feeRecords: incomes.slice(0, 5),
      },
    };
  }

  async createStudent(data) {
    const students = this.get(STORAGE_KEYS.STUDENTS, []);
    const newStudent = {
      _id: `std_${Date.now()}`,
      ...data,
      status: data.status || 'active',
    };
    students.unshift(newStudent);
    this.set(STORAGE_KEYS.STUDENTS, students);
    return { success: true, data: newStudent };
  }

  async updateStudent(id, data) {
    const students = this.get(STORAGE_KEYS.STUDENTS, []);
    const idx = students.findIndex((s) => s._id === id);
    if (idx !== -1) {
      students[idx] = { ...students[idx], ...data };
      this.set(STORAGE_KEYS.STUDENTS, students);
      return { success: true, data: students[idx] };
    }
    throw new Error('Student not found');
  }

  async deleteStudent(id) {
    const students = this.get(STORAGE_KEYS.STUDENTS, []);
    const updated = students.filter((s) => s._id !== id);
    this.set(STORAGE_KEYS.STUDENTS, updated);
    return { success: true };
  }

  // Attendance
  async getAttendanceSheet({ classId, divisionId, date }) {
    const students = this.get(STORAGE_KEYS.STUDENTS, []);
    const attendances = this.get(STORAGE_KEYS.ATTENDANCES, []);

    const classStudents = students.filter(
      (s) => s.classId === classId && s.divisionId === divisionId && s.status === 'active'
    );

    const existing = attendances.find(
      (a) => a.classId === classId && a.divisionId === divisionId && a.date === date
    );

    if (existing) {
      const recMap = new Map();
      (existing.records || []).forEach((r) => recMap.set(r.studentId, r));

      const records = classStudents.map((s) => {
        const found = recMap.get(s._id);
        return {
          studentId: s,
          status: found ? found.status : 'Present',
          reason: found ? found.reason : '',
        };
      });

      const present = records.filter((r) => r.status === 'Present').length;
      const absent = records.filter((r) => r.status === 'Absent').length;
      const late = records.filter((r) => r.status === 'Late').length;
      const leave = records.filter((r) => r.status === 'Leave').length;
      const total = records.length;
      const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;

      return {
        success: true,
        isRecorded: true,
        date,
        records,
        stats: { total, present, absent, late, leave, rate },
      };
    }

    // Default template
    const records = classStudents.map((s) => ({
      studentId: s,
      status: 'Present',
      reason: '',
    }));

    return {
      success: true,
      isRecorded: false,
      date,
      records,
      stats: {
        total: classStudents.length,
        present: classStudents.length,
        absent: 0,
        late: 0,
        leave: 0,
        rate: 100,
      },
    };
  }

  async saveAttendance(data) {
    const attendances = this.get(STORAGE_KEYS.ATTENDANCES, []);
    const cleanRecords = (data.records || []).map((r) => ({
      studentId: typeof r.studentId === 'object' ? r.studentId._id : r.studentId,
      status: r.status || 'Present',
      reason: r.reason || '',
    }));

    const idx = attendances.findIndex(
      (a) => a.classId === data.classId && a.divisionId === data.divisionId && a.date === data.date
    );

    const doc = {
      _id: idx !== -1 ? attendances[idx]._id : `att_${Date.now()}`,
      classId: data.classId,
      divisionId: data.divisionId,
      date: data.date,
      records: cleanRecords,
    };

    if (idx !== -1) {
      attendances[idx] = doc;
    } else {
      attendances.unshift(doc);
    }

    this.set(STORAGE_KEYS.ATTENDANCES, attendances);
    return { success: true, data: doc };
  }

  async getAttendanceHistory(params = {}) {
    const attendances = this.get(STORAGE_KEYS.ATTENDANCES, []);
    const classes = this.get(STORAGE_KEYS.CLASSES, []);
    const divisions = this.get(STORAGE_KEYS.DIVISIONS, []);

    let filtered = attendances;
    if (params.classId) filtered = filtered.filter((a) => a.classId === params.classId);
    if (params.divisionId) filtered = filtered.filter((a) => a.divisionId === params.divisionId);

    const data = filtered.map((att) => {
      const cls = classes.find((c) => c._id === att.classId);
      const div = divisions.find((d) => d._id === att.divisionId);
      const recs = att.records || [];
      const total = recs.length;
      const present = recs.filter((r) => r.status === 'Present').length;
      const absent = recs.filter((r) => r.status === 'Absent').length;
      const late = recs.filter((r) => r.status === 'Late').length;
      const leave = recs.filter((r) => r.status === 'Leave').length;
      const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;

      return {
        _id: att._id,
        date: att.date,
        class: cls ? cls.name : '-',
        division: div ? div.name : '-',
        total,
        present,
        absent,
        late,
        leave,
        rate,
      };
    });

    return { success: true, data };
  }

  // Staff
  async getStaff(params = {}) {
    let staff = this.get(STORAGE_KEYS.STAFF, []);
    if (params.department) staff = staff.filter((s) => s.department === params.department);
    if (params.employmentStatus) staff = staff.filter((s) => s.employmentStatus === params.employmentStatus);
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      staff = staff.filter(
        (s) =>
          (s.name || '').toLowerCase().includes(q) ||
          (s.staffId || '').toLowerCase().includes(q) ||
          (s.phone || '').includes(q) ||
          (s.designation || '').toLowerCase().includes(q)
      );
    }
    return { success: true, data: staff };
  }

  async getStaffById(id) {
    const staff = this.get(STORAGE_KEYS.STAFF, []);
    const salaries = this.get(STORAGE_KEYS.SALARIES, []);
    const member = staff.find((s) => s._id === id);
    if (!member) throw new Error('Staff member not found');
    const memberSalaries = salaries.filter((s) => s.staffId === id);
    return { success: true, data: { staff: member, salaries: memberSalaries } };
  }

  async createStaff(data) {
    const staff = this.get(STORAGE_KEYS.STAFF, []);
    const newStaff = {
      _id: `stf_${Date.now()}`,
      ...data,
      employmentStatus: data.employmentStatus || 'active',
      basicSalary: Number(data.basicSalary) || 0,
    };
    staff.unshift(newStaff);
    this.set(STORAGE_KEYS.STAFF, staff);
    return { success: true, data: newStaff };
  }

  async updateStaff(id, data) {
    const staff = this.get(STORAGE_KEYS.STAFF, []);
    const idx = staff.findIndex((s) => s._id === id);
    if (idx !== -1) {
      staff[idx] = { ...staff[idx], ...data };
      this.set(STORAGE_KEYS.STAFF, staff);
      return { success: true, data: staff[idx] };
    }
    throw new Error('Staff member not found');
  }

  async deleteStaff(id) {
    const staff = this.get(STORAGE_KEYS.STAFF, []);
    const updated = staff.filter((s) => s._id !== id);
    this.set(STORAGE_KEYS.STAFF, updated);
    return { success: true };
  }

  // Salary
  async getSalaries(params = {}) {
    let salaries = this.get(STORAGE_KEYS.SALARIES, []);
    const staff = this.get(STORAGE_KEYS.STAFF, []);

    if (params.month) salaries = salaries.filter((s) => s.salaryMonth === params.month);
    if (params.staffId) salaries = salaries.filter((s) => s.staffId === params.staffId);

    const populated = salaries.map((sal) => {
      const stf = staff.find((s) => s._id === sal.staffId);
      return { ...sal, staffId: stf || { name: 'Staff Member' } };
    });

    return { success: true, data: populated };
  }

  async createSalary(data) {
    const salaries = this.get(STORAGE_KEYS.SALARIES, []);
    const expenses = this.get(STORAGE_KEYS.EXPENSES, []);
    const staff = this.get(STORAGE_KEYS.STAFF, []);

    const stf = staff.find((s) => s._id === data.staffId);
    const bSalary = Number(data.basicSalary) || 0;
    const bBonus = Number(data.bonus) || 0;
    const bOther = Number(data.otherAmount) || 0;
    const bDeduct = Number(data.deduction) || 0;
    const netSalary = Math.max(0, bSalary + bBonus + bOther - bDeduct);

    const newSalary = {
      _id: `sal_${Date.now()}`,
      ...data,
      netSalary,
      paymentDate: data.paymentDate || new Date().toISOString(),
      paymentStatus: data.paymentStatus || 'Paid',
    };

    salaries.unshift(newSalary);
    this.set(STORAGE_KEYS.SALARIES, salaries);

    // Add to Expense for accounting parity
    expenses.unshift({
      _id: `exp_sal_${Date.now()}`,
      title: `Salary Payment - ${stf?.name || 'Staff'} (${data.salaryMonth})`,
      category: 'Staff Salary',
      amount: netSalary,
      date: data.paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: data.paymentMethod || 'Bank',
      paidTo: `${stf?.name || 'Staff'} (${stf?.staffId || ''})`,
      description: `Monthly salary disbursement for ${data.salaryMonth}`,
    });
    this.set(STORAGE_KEYS.EXPENSES, expenses);

    return { success: true, data: { ...newSalary, staffId: stf } };
  }

  async updateSalary(id, data) {
    const salaries = this.get(STORAGE_KEYS.SALARIES, []);
    const idx = salaries.findIndex((s) => s._id === id);
    if (idx !== -1) {
      salaries[idx] = { ...salaries[idx], ...data };
      this.set(STORAGE_KEYS.SALARIES, salaries);
      return { success: true, data: salaries[idx] };
    }
    throw new Error('Salary record not found');
  }

  async deleteSalary(id) {
    const salaries = this.get(STORAGE_KEYS.SALARIES, []);
    const updated = salaries.filter((s) => s._id !== id);
    this.set(STORAGE_KEYS.SALARIES, updated);
    return { success: true };
  }

  // Incomes
  async getIncomes(params = {}) {
    let incomes = this.get(STORAGE_KEYS.INCOMES, []);
    if (params.category) incomes = incomes.filter((i) => i.category === params.category);
    if (params.paymentMethod) incomes = incomes.filter((i) => i.paymentMethod === params.paymentMethod);
    if (params.startDate) incomes = incomes.filter((i) => (i.date || '') >= params.startDate);
    if (params.endDate) incomes = incomes.filter((i) => (i.date || '') <= params.endDate);
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      incomes = incomes.filter(
        (i) =>
          (i.title || '').toLowerCase().includes(q) ||
          (i.receivedFrom || '').toLowerCase().includes(q) ||
          (i.receiptNo || '').toLowerCase().includes(q)
      );
    }
    const totalAmount = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);
    return { success: true, data: incomes, totalAmount };
  }

  async createIncome(data) {
    const incomes = this.get(STORAGE_KEYS.INCOMES, []);
    const newInc = {
      _id: `inc_${Date.now()}`,
      ...data,
      amount: Number(data.amount) || 0,
      date: data.date || new Date().toISOString().split('T')[0],
      receiptNo: data.receiptNo || `REC-${Date.now().toString().slice(-6)}`,
    };
    incomes.unshift(newInc);
    this.set(STORAGE_KEYS.INCOMES, incomes);
    return { success: true, data: newInc };
  }

  async deleteIncome(id) {
    const incomes = this.get(STORAGE_KEYS.INCOMES, []);
    const updated = incomes.filter((i) => i._id !== id);
    this.set(STORAGE_KEYS.INCOMES, updated);
    return { success: true };
  }

  // Expenses
  async getExpenses(params = {}) {
    let expenses = this.get(STORAGE_KEYS.EXPENSES, []);
    if (params.category) expenses = expenses.filter((e) => e.category === params.category);
    if (params.paymentMethod) expenses = expenses.filter((e) => e.paymentMethod === params.paymentMethod);
    if (params.startDate) expenses = expenses.filter((e) => (e.date || '') >= params.startDate);
    if (params.endDate) expenses = expenses.filter((e) => (e.date || '') <= params.endDate);
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      expenses = expenses.filter(
        (e) =>
          (e.title || '').toLowerCase().includes(q) ||
          (e.paidTo || '').toLowerCase().includes(q) ||
          (e.voucherNo || '').toLowerCase().includes(q)
      );
    }
    const totalAmount = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    return { success: true, data: expenses, totalAmount };
  }

  async createExpense(data) {
    const expenses = this.get(STORAGE_KEYS.EXPENSES, []);
    const newExp = {
      _id: `exp_${Date.now()}`,
      ...data,
      amount: Number(data.amount) || 0,
      date: data.date || new Date().toISOString().split('T')[0],
      voucherNo: data.voucherNo || `VOU-${Date.now().toString().slice(-6)}`,
    };
    expenses.unshift(newExp);
    this.set(STORAGE_KEYS.EXPENSES, expenses);
    return { success: true, data: newExp };
  }

  async deleteExpense(id) {
    const expenses = this.get(STORAGE_KEYS.EXPENSES, []);
    const updated = expenses.filter((e) => e._id !== id);
    this.set(STORAGE_KEYS.EXPENSES, updated);
    return { success: true };
  }

  // Financial Summary
  async getFinancialSummary() {
    const incomes = this.get(STORAGE_KEYS.INCOMES, []);
    const expenses = this.get(STORAGE_KEYS.EXPENSES, []);
    const salaries = this.get(STORAGE_KEYS.SALARIES, []);

    const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const availableBalance = totalIncome - totalExpenses;

    const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const monthIncomes = incomes.filter((i) => (i.date || '').startsWith(currentMonthStr));
    const monthExpenses = expenses.filter((e) => (e.date || '').startsWith(currentMonthStr));
    const monthSalaries = salaries.filter((s) => s.salaryMonth === currentMonthStr && s.paymentStatus === 'Paid');

    const monthIncome = monthIncomes.reduce((s, i) => s + Number(i.amount || 0), totalIncome * 0.35);
    const monthExpense = monthExpenses.reduce((s, e) => s + Number(e.amount || 0), totalExpenses * 0.4);
    const monthSalary = monthSalaries.reduce((s, sal) => s + Number(sal.netSalary || 0), 283500);

    const incomeByCategory = {};
    incomes.forEach((i) => {
      incomeByCategory[i.category] = (incomeByCategory[i.category] || 0) + Number(i.amount || 0);
    });

    const expenseByCategory = {};
    expenses.forEach((e) => {
      expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + Number(e.amount || 0);
    });

    const monthlyTrend = [
      { month: 'May 26', income: 420000, expense: 210000, net: 210000 },
      { month: 'Jun 26', income: 680000, expense: 340000, net: 340000 },
      { month: 'Jul 26', income: 510000, expense: 280000, net: 230000 },
      { month: 'Aug 26', income: 490000, expense: 290000, net: 200000 },
      { month: 'Sep 26', income: 750000, expense: 380000, net: 370000 },
      { month: 'Oct 26', income: monthIncome, expense: monthExpense, net: monthIncome - monthExpense },
    ];

    return {
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        availableBalance,
        monthIncome: Math.round(monthIncome),
        monthExpense: Math.round(monthExpense),
        monthSalary: Math.round(monthSalary),
        incomeByCategory,
        expenseByCategory,
        monthlyTrend,
      },
    };
  }

  // Reports
  async getReport(type) {
    if (type === 'students') {
      const students = this.get(STORAGE_KEYS.STUDENTS, []);
      const classes = this.get(STORAGE_KEYS.CLASSES, []);
      const classSummary = classes.map((c) => {
        const clsStudents = students.filter((s) => s.classId === c._id);
        return {
          classId: c._id,
          className: c.name,
          total: clsStudents.length,
          male: clsStudents.filter((s) => s.gender === 'Male').length,
          female: clsStudents.filter((s) => s.gender === 'Female').length,
          active: clsStudents.filter((s) => s.status === 'active').length,
          inactive: clsStudents.filter((s) => s.status !== 'active').length,
        };
      });

      return {
        success: true,
        data: {
          totalStudents: students.length,
          activeStudents: students.filter((s) => s.status === 'active').length,
          classSummary,
          studentsList: students,
        },
      };
    }

    if (type === 'attendance') {
      return this.getAttendanceHistory({});
    }

    if (type === 'staff') {
      const staff = this.get(STORAGE_KEYS.STAFF, []);
      return {
        success: true,
        data: {
          totalStaff: staff.length,
          activeStaff: staff.filter((s) => s.employmentStatus === 'active').length,
          staffList: staff,
        },
      };
    }

    if (type === 'salary') {
      const salaries = await this.getSalaries({});
      const totalPaid = (salaries.data || []).reduce((s, sal) => s + sal.netSalary, 0);
      return {
        success: true,
        data: {
          totalRecords: salaries.data.length,
          totalPaid,
          salaries: salaries.data,
        },
      };
    }

    if (type === 'finance') {
      const incomes = this.get(STORAGE_KEYS.INCOMES, []);
      const expenses = this.get(STORAGE_KEYS.EXPENSES, []);
      const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);
      const totalExpense = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
      return {
        success: true,
        data: {
          totalIncome,
          totalExpense,
          netProfit: totalIncome - totalExpense,
          incomes,
          expenses,
        },
      };
    }

    throw new Error('Invalid report type');
  }

  // Settings
  async getSettings() {
    const settings = this.get(STORAGE_KEYS.SETTINGS, initialSettings);
    return { success: true, data: settings };
  }

  async updateSettings(data) {
    const settings = this.get(STORAGE_KEYS.SETTINGS, initialSettings);
    const updated = { ...settings, ...data };
    this.set(STORAGE_KEYS.SETTINGS, updated);
    return { success: true, data: updated };
  }
}

export const mockStorage = new MockStorage();
