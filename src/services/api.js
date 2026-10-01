const API_BASE_URL = 'http://localhost:5005/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('school_crm_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong with the request');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth
  login(credentials) {
    return this.request('/auth/login', { method: 'POST', body: credentials });
  }
  getMe() {
    return this.request('/auth/me');
  }
  updateProfile(data) {
    return this.request('/auth/profile', { method: 'PUT', body: data });
  }
  changePassword(data) {
    return this.request('/auth/change-password', { method: 'PUT', body: data });
  }

  // Dashboard
  getDashboard() {
    return this.request('/dashboard');
  }

  // Classes & Divisions
  getClasses() {
    return this.request('/classes');
  }
  addClass(data) {
    return this.request('/classes', { method: 'POST', body: data });
  }
  addDivision(classId, data) {
    return this.request(`/classes/${classId}/divisions`, { method: 'POST', body: data });
  }
  updateDivision(id, data) {
    return this.request(`/classes/divisions/${id}`, { method: 'PUT', body: data });
  }
  deleteDivision(id) {
    return this.request(`/classes/divisions/${id}`, { method: 'DELETE' });
  }

  // Students
  getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/students?${query}`);
  }
  getStudent(id) {
    return this.request(`/students/${id}`);
  }
  createStudent(data) {
    return this.request('/students', { method: 'POST', body: data });
  }
  updateStudent(id, data) {
    return this.request(`/students/${id}`, { method: 'PUT', body: data });
  }
  deleteStudent(id) {
    return this.request(`/students/${id}`, { method: 'DELETE' });
  }

  // Attendance
  getAttendanceSheet(params) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/attendance/sheet?${query}`);
  }
  saveAttendance(data) {
    return this.request('/attendance/save', { method: 'POST', body: data });
  }
  getAttendanceHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/attendance/history?${query}`);
  }

  // Staff
  getStaff(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/staff?${query}`);
  }
  getStaffById(id) {
    return this.request(`/staff/${id}`);
  }
  createStaff(data) {
    return this.request('/staff', { method: 'POST', body: data });
  }
  updateStaff(id, data) {
    return this.request(`/staff/${id}`, { method: 'PUT', body: data });
  }
  deleteStaff(id) {
    return this.request(`/staff/${id}`, { method: 'DELETE' });
  }

  // Salary
  getSalaries(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/salaries?${query}`);
  }
  createSalary(data) {
    return this.request('/salaries', { method: 'POST', body: data });
  }
  updateSalary(id, data) {
    return this.request(`/salaries/${id}`, { method: 'PUT', body: data });
  }
  deleteSalary(id) {
    return this.request(`/salaries/${id}`, { method: 'DELETE' });
  }

  // Finance (Income & Expense)
  getIncomes(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/finance/income?${query}`);
  }
  createIncome(data) {
    return this.request('/finance/income', { method: 'POST', body: data });
  }
  updateIncome(id, data) {
    return this.request(`/finance/income/${id}`, { method: 'PUT', body: data });
  }
  deleteIncome(id) {
    return this.request(`/finance/income/${id}`, { method: 'DELETE' });
  }

  getExpenses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/finance/expense?${query}`);
  }
  createExpense(data) {
    return this.request('/finance/expense', { method: 'POST', body: data });
  }
  updateExpense(id, data) {
    return this.request(`/finance/expense/${id}`, { method: 'PUT', body: data });
  }
  deleteExpense(id) {
    return this.request(`/finance/expense/${id}`, { method: 'DELETE' });
  }

  getFinancialSummary() {
    return this.request('/finance/summary');
  }

  // Reports
  getReport(type, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/reports/${type}?${query}`);
  }

  // Settings
  getSettings() {
    return this.request('/settings');
  }
  updateSettings(data) {
    return this.request('/settings', { method: 'PUT', body: data });
  }
}

export const api = new ApiClient();
export default api;
